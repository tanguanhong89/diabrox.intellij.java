package com.github.phantomv1989.diabrox.data

import com.intellij.psi.PsiElement

class GraphLink(target: GraphNode, type: String, outbound: Boolean, value: Int?) {
    val type: String = type
    val target: GraphNode = target
    val value = value
    val outbound = outbound
}

open class GraphNode(name: String, id: Int, type: String, ele: PsiElement?, value: Int = 1) {
    var name: String = name
    var value: Int = value
    val id: Int = id
    val type: String = type
    val ele: PsiElement? = ele
    var links: HashMap<Int, GraphLink> = HashMap()

    fun addLink(o: GraphNode, type: String, value: Int?) {
        val l1 = GraphLink(o, type, true, value)
        if (!links.containsKey(l1.hashCode())) {
            links[l1.hashCode()] = l1
            var l2 = GraphLink(this, type, false, value)
            o.links[l2.hashCode()] = l2
        }
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

class Graph(links: Set<String>) {
    val ForLinks: Set<String> = links
    var heads: HashMap<Int, GraphNode> = HashMap()
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
            var outLinks = n.findLinksWithDirection(ForLinks, true)
            var inlinks = n.findLinksWithDirection(ForLinks, false)
            fun f1(n1: GraphNode) {
                for (nc in n1.findLinksWithDirection(ForLinks, true).map { x -> x.target }) {
                    foo(nc)
                }
            }
            if (outLinks.size == 1 && inlinks.size == 1) {
                var target = outLinks[0].target
                var source = inlinks[0].target
                source.addLink(target, outLinks[0].type, outLinks[0].value)

                n.removeLinks(target, ForLinks)
                n.removeLinks(source, ForLinks)
                f1(target)
                // for debug, compare source, n, target links.size at each step
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
//        calculateMaxDepth()
//        calculateTerminalNodesTotalSizeAndCount()
    }

    fun calculateHeads(): HashMap<Int, GraphNode> {
        for (l in IdIndex.keys) {
            if (IdIndex.get(l)!!.findLinksWithDirection(ForLinks, false).size == 0)
                heads[l] = IdIndex[l]!!
        }
        return heads
    }

    fun calculateMaxDepth(): Int {
        if (heads.size == 0) calculateHeads()
        if (maxDepth > 0) return maxDepth
        for (h in heads.values) {
            var covered: Set<String> = mutableSetOf()
            fun foo(n: GraphNode, curdepth: Int): Int {
                if (!covered.contains(n.id)) {
                    var targets = n.findLinksWithDirection(ForLinks, true).map { x -> x.target }
                    var md = targets.map { x -> foo(x, curdepth + 1) }.max()
                    md?.let {
                        if (it > maxDepth) maxDepth = md!!
                    }
                }
                return curdepth
            }

            var depth = foo(h, 0)
            if (depth > maxDepth) maxDepth = depth
        }
        return maxDepth
    }

    fun calculateTerminalNodesTotalSizeAndCount(): Int {
        if (heads.size == 0) calculateHeads()
        if (totalValueOfTerminalNodes > 0) return totalValueOfTerminalNodes
        for (h in heads.values) {
            var covered: Set<String> = mutableSetOf()
            fun foo(n: GraphNode) {
                if (!covered.contains(n.id)) {
                    var targets = n.findLinksWithDirection(ForLinks, true).map { x -> x.target }
                    if (targets.size == 0) {
                        totalValueOfTerminalNodes += n.value
                        totalCountOfTerminalNodes += 1
                    } else {
                        targets.forEach { x -> foo(x) }
                    }
                }
                return
            }
            foo(h)
        }
        return maxDepth
    }

    fun getId(id: Int): GraphNode? {
        return IdIndex.get(id)
    }
}