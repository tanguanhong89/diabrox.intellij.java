package com.github.phantomv1989.diabrox.data

import com.intellij.psi.PsiElement

class GraphLink(target: GraphNode, type: String, outbound: Boolean, value: Int?) {
    val type: String = type
    val target: GraphNode = target
    val value = value
    val outbound = outbound

    fun getHash(): Int {
        return (type + outbound.toString() + value.toString() + target.hashCode().toString()).hashCode()
    }
}

open class GraphNode(name: String, id: Int, type: String, ele: PsiElement?, value: Int = 1) {
    var name: String = name
    var value: Int = value
    val id: Int = id
    val type: String = type
    val ele: PsiElement? = ele
    var links: HashMap<Int, GraphLink> = HashMap()

    fun addLink(o: GraphNode, type: String, value: Int?): GraphLink {
        val l1 = GraphLink(o, type, true, value)
        val l1hash = l1.getHash()
        if (!links.containsKey(l1hash) && id != o.id) {
            links[l1hash] = l1
            var l2 = GraphLink(this, type, false, value)
            o.links[l1hash] = l2
        }
        return l1
    }

    fun removeLinks(o: GraphNode, linkTypes: Set<String>) {
        var targets = ArrayList<GraphNode>()
        var keysToRemove = ArrayList<Int>()
        for (k in links.keys) {
            var l = links[k]!!
            for (lt in linkTypes) {
                if (l.target.equals(o) && l.type == lt) {
                    keysToRemove.add(k)
                    targets.add(l.target)
                }
            }
        }
        for (k in keysToRemove) {
            links.remove(k)
        }
        for (t in targets) {
            t.removeLinks(this, linkTypes)
        }
    }


    fun findLinks(linkTypes: Set<String>): ArrayList<GraphLink> {
        var r: ArrayList<GraphLink> = ArrayList()
        for (l in links.values) {
            if (linkTypes.contains(l.type)) {
                r.add(l)
            }
        }
        return r
    }

    fun findLinksWithDirection(linkTypes: Set<String>, outboundDirection: Boolean): ArrayList<GraphLink> {
        var r1 = findLinks(linkTypes)
        var r: ArrayList<GraphLink> = ArrayList()
        for (l in r1) {
            if (l.outbound && outboundDirection) r.add(l)
            else if (!l.outbound && !outboundDirection) {
                r.add(l)
            }
        }
        return r
    }
}

class Graph() {
    var childLinkLabel = mutableSetOf<String>("child")
    var heads: HashMap<Int, GraphNode> = HashMap()
    var headGraphs: HashMap<Int, ArrayList<String>> = HashMap()

    var LITERAL_EXPRESSIONS = ArrayList<GraphNode>()
    var EXT_REFERENCE_EXPRESSIONS = ArrayList<GraphNode>()

    var IdIndex: HashMap<Int, GraphNode> = HashMap()
    var maxDepth = 0
    var totalValueOfTerminalNodes = 0
    var totalCountOfTerminalNodes = 0
    fun addNode(node: GraphNode) {
        IdIndex[node.id] = node
    }

    fun collapseGraph() {
        if (heads.size == 0) calculateHeads()
        // collapse singly linked intermediate node(AST)

        fun foo(n: GraphNode) {
            var children = getChildren(n)
            var parent = getParent(n)
            fun f1(n1: GraphNode) {
                for (nc in getChildren(n1)) {
                    foo(nc)
                }
            }
            if (children.size == 1 && parent != null) {
                var target = children[0]
                var source = parent
                source.addLink(target, "child", children[0].value)

                n.removeLinks(target, childLinkLabel)
                n.removeLinks(source, childLinkLabel)
                f1(target)
                // for debug, compare source, n, target links.size at each step
            } else if (children.size == 0) {
                // TODO need trim useless dead-end tokens for better UI performance
                if (!n.type.equals("LITERAL_EXPRESSION")) {
                }
            } else {
                f1(n)
            }
        }

        for (h in heads.values) {
            foo(h)
        }
    }

    fun calculateAll() {
        calculateHeads()
        calculateHeadGraphs()
        calculateDataflows()
//        calculateMaxDepth()
//        calculateTerminalNodesTotalSizeAndCount()
    }

    fun calculateDataflows() {
        IdIndex.forEach { k, v ->
            if (v.type.equals("LITERAL_EXPRESSION")) {
                var covered = mutableSetOf<Int>()
                var links = ArrayList<GraphLink>()

                fun foo(e: GraphNode) {
                    covered.add(e.id)

                    // parent resolution
                    var eparent = getParent(e)
                    eparent?.let { it ->
                        fun linkSibling(s: String) {
                            getChildren(it).filter { x ->
                                x.type.endsWith(s)
                            }.forEach { x ->
                                links.add(e.addLink(x, "data", 1))
                            }
                            foo(it)
                        }
                        if (covered.contains(it.id)) return
                        when (it.type) {
                            "EXPRESSION_LIST" -> {// move to parent
                                links.add(e.addLink(it, "data", 1))
                                foo(it)
                            }
                            "NEW_EXPRESSION" -> {//check siblings for JAVA_CODE_REFERENCE
                                links.add(e.addLink(it, "data", 1))
                                linkSibling("REFERENCE")
                                foo(it)
                            }
                            "LOCAL_VARIABLE" -> {
                                links.add(e.addLink(it, "data", 1))
                                foo(it)
                            }
                            "RESOURCE_VARIABLE" -> {
                                links.add(e.addLink(it, "data", 1))
                                foo(it)
                            }
                            "ASSIGNMENT_EXPRESSION" -> {
                                linkSibling("REFERENCE_EXPRESSION")
                            }
                            "METHOD_CALL_EXPRESSION" -> {
                                linkSibling("REFERENCE_EXPRESSION")
                            }
                            "BINARY_EXPRESSION" -> {
                                val target = getChildren(it).filter { x -> x.id != e.id && !x.type.contains("EQ") }[0]
                                links.add(e.addLink(target, "data", 1))
                            }
                            "RETURN_STATEMENT" -> {
                                eparent = getParent(it)
                                while (!eparent?.type.equals("METHOD")) {
                                    eparent = eparent?.let { it1 -> getParent(it1) }
                                }
                                eparent?.let {
                                    if (eparent!!.type.equals("METHOD")) {
                                        links.add(e.addLink(eparent!!, "data", 1))
                                        foo(eparent!!)
                                    }
                                }
                            }
                            else -> {
                            }
                        }
                    }

                    // ref resolution
                    e.findLinksWithDirection(mutableSetOf("ref"), false).forEach { x ->
                        e.addLink(x.target, "data", 1)
                        foo(x.target)
                    }
                }
                foo(v)
            }
        }
    }

    fun calculateHeads(): HashMap<Int, GraphNode> {
        for (l in IdIndex.keys) {
            if (IdIndex.get(l)!!.findLinksWithDirection(childLinkLabel, false).size == 0)
                heads[l] = IdIndex[l]!!
        }
        return heads
    }

    fun calculateHeadGraphs() {
        heads.forEach { x -> headGraphs[x.key] = getGraphForNode(x.value) }
    }


    fun getId(id: Int): GraphNode? {
        return IdIndex.get(id)
    }


    fun getGraphForNode(n: GraphNode): ArrayList<String> {
        var covered = mutableSetOf<Int>()
        fun foo(n: GraphNode): ArrayList<String> {
            var r = ArrayList<String>()
            if (!covered.contains(n.id)) {
                covered.add(n.id)
                var outboundLinks = n.links.values.filter { x -> x.outbound }
                outboundLinks.sortedBy { x -> x.value }.forEach { l ->
                    var r1 = ArrayList<String>()
                    r1.add("\"s\":" + n.id.toString())
                    r1.add("\"d\":" + l.target.id.toString())
                    r.add("{" + r1.joinToString(",") + "}")
                    r.addAll(foo(l.target))
                }
            }
            return r
        }
        return foo(n)
    }

    fun getParent(e: GraphNode): GraphNode? {
        var _ep = e.findLinksWithDirection(mutableSetOf("child"), false)
        if (_ep.size > 0) return _ep[0].target
        return null
    }

    fun getChildren(e: GraphNode): List<GraphNode> {
        return e.findLinksWithDirection(mutableSetOf("child"), true).map { x -> x.target }
    }
}