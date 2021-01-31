package com.github.phantomv1989.diabrox.actions

import com.intellij.psi.PsiElement

class GraphLink(source: GraphNode, target: GraphNode, type: String, value: Int?) {
    val source: GraphNode = source
    val type: String = type
    val target: GraphNode = target
    val value = value
}

open class GraphNode(name: String, id: String, type: String, ele: PsiElement?) {
    val name: String = name
    var value: Int = 0
    val id: String = id
    val type: String = type
    val ele: PsiElement? = ele
    var links: MutableList<GraphLink> = ArrayList()

    fun addTarget(o: GraphNode, type: String, value: Int?) {
        links.add(GraphLink(this, o, type, value))
    }

    fun addSource(o: GraphNode, type: String, value: Int?) {
        links.add(GraphLink(o, this, type, value))
    }

    fun findLinks(linkTypes: Set<String>): ArrayList<GraphLink> {
        var r: ArrayList<GraphLink> = ArrayList()
        for (l in links) {
            if (linkTypes.contains(l.type)) {
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
        IdIndex[node.id]=node
    }
    fun calculateHeads():HashMap<String, GraphNode>{
        return heads
    }

}