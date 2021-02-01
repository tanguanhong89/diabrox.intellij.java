package com.github.phantomv1989.diabrox.actions

import com.intellij.psi.PsiElement

class GraphLink(target: GraphNode, type: String, outbound: Boolean, value: Int?) {
    val type: String = type
    val target: GraphNode = target
    val value = value
    val outbound = outbound
}

open class GraphNode(name: String, id: String, type: String, ele: PsiElement?) {
    val name: String = name
    var value: Int = 1
    val id: String = id
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
    var heads: HashMap<String, GraphNode> = HashMap()
    var IdIndex: HashMap<String, GraphNode> = HashMap()
    fun addNode(node: GraphNode) {
        IdIndex[node.id] = node
    }

    fun calculateHeads(): HashMap<String, GraphNode> {
        for (l in IdIndex.keys) {
            if (IdIndex.get(l)!!.findLinksWithDirection(ForLinks, false).size == 0)
                heads[l] = IdIndex[l]!!
        }
        return heads
    }

    fun getId(id: String): GraphNode? {
        return IdIndex.get(id)
    }
}