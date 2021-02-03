package com.github.phantomv1989.diabrox.actions

import com.github.phantomv1989.diabrox.actions.Traversal.Companion.checkIsInvalidExpressionList
import com.github.phantomv1989.diabrox.actions.Traversal.Companion.isSkippable
import com.github.phantomv1989.diabrox.actions.Traversal.Companion.isStubIgnored
import com.intellij.psi.PsiDirectory
import com.intellij.psi.PsiElement
import com.intellij.psi.PsiFile
import com.intellij.psi.util.elementType


class Indexer {
    var StructureGraph = Graph(
        mutableSetOf(
            "parent",
            "child"
        )
    )

    var DataGraph = Graph(
        mutableSetOf(
            "ref",
            "new",
            "assignment",
            "callargs"
        )
    )

    fun psiToNode(ele: PsiElement, value: Int = 1): GraphNode {
        val s1 = ele.toString().split(":")
        var s2 = s1[0]
        if (s1.size > 1) {
            s2 = s1[1]
        }
        s2 = s2.replace("\"", "'").replace("\n", "\\n")

        return GraphNode(s2, getHash(ele), ele.elementType.toString(), ele, value)
    }

    fun getHash(ele: PsiElement): String {
        return System.identityHashCode(ele).toString()
    }

//    fun getNodesJsonString(): String {
//        return hobj.toString()
//    }
//
//    fun getLinksString(): String {
//        val r: MutableList<String> = ArrayList()
//        for (nodeId in nodeIndex.keys) {
//            val node = nodeIndex.get(nodeId)
//            node?.let {
//                for (l in node.links) {
//                    r.add("{\"src\":" + node.id + ",\"type\":\"" + l.type + "\",\"dst\":" + l.target.id + "}")
//                }
//            }
//        }
//        return "[" + r.joinToString(",") + "]"
//    }

    fun addDataLink(src: PsiElement, tgt: PsiElement, type: String, value: Int?) {
        val srcNode = addStructNode(src)
        val tgtNode = addStructNode(tgt)

        srcNode?.let {
            tgtNode?.let {
                DataGraph.addNode(srcNode)
                DataGraph.addNode(tgtNode)
                srcNode.addLink(tgtNode, type, value)
            }
        }
    }

    fun addStructNode(ele: PsiElement?): GraphNode? {
        if (ele == null) return null
        val id = getHash(ele)
        if (StructureGraph.IdIndex.containsKey(id)) return StructureGraph.getId(id)

        var lastExistingParent = addStructNode(ele.parent)

        fun foo(lastExistingParent: GraphNode?): GraphNode {
            var offsetKey = ele.startOffsetInParent
            var nodeObj = if (ele.elementType.toString().equals("LITERAL_EXPRESSION")) {
                psiToNode(ele, 5)
            } else {
                psiToNode(ele)
            }
            if (lastExistingParent != null) {
                if (ele is PsiFile) {
                    offsetKey = lastExistingParent.findLinks(mutableSetOf("child")).size
                }
                lastExistingParent.addLink(nodeObj, "child", offsetKey)
            }
            StructureGraph.addNode(nodeObj)
            return nodeObj
        }
        if (ele is PsiFile) return foo(lastExistingParent)
        if (ele is PsiDirectory) return foo(lastExistingParent)
        if (checkIsInvalidExpressionList(ele)) return lastExistingParent
        if (isStubIgnored(ele)) return null
        if (isSkippable(ele) && !(ele is PsiFile)) return lastExistingParent
        return foo(lastExistingParent)
    }

    fun computeGraphs() {
        StructureGraph.calculateAll()
        //DataGraph.calculateHeads()
    }


    fun toJsonStringNodes(): String {
        fun foo(n: GraphNode): String {
            var r = ArrayList<String>()
            r.add("\"name\":\"" + n.name + "\"")
            r.add("\"id\":\"" + n.id + "\"")
            r.add("\"type\":\"" + n.type + "\"")
            r.add("\"value\":" + n.value.toString() + "")
            var children = n.findLinksWithDirection(StructureGraph.ForLinks, true)
            if (children.size > 0) {
                r.add("\"children\":[" + children.map { x -> foo(x.target) }.joinToString(",") + "]")
            }
            return "{" + r.joinToString(",") + "}"
        }
        var r1 = ArrayList<String>()
        r1.add("\"name\":\"root\"")
        r1.add("\"id\":\"0\"")
        r1.add("\"type\":\"root\"")
        r1.add("\"value\":1")
        r1.add("\"children\":[" + StructureGraph.heads.values.map { x -> foo(x) }.joinToString(",") + "]")
        return "{" + r1.joinToString(",") + "}"
    }

    fun toJsonStringLinks(): String {
        var r = ArrayList<String>()
        for (n in DataGraph.IdIndex.values) {
            var links = n.findLinksWithDirection(DataGraph.ForLinks, true)
            for (l in links) {
                var r2 = ArrayList<String>()
                r2.add("\"src\":" + n.id)
                r2.add("\"dst\":" + l.target.id)
                r2.add("\"type\":" + "\"" + l.type + "\"")
                r.add("{" + r2.joinToString(",") + "}")
            }
        }
        return "[" + r.joinToString(",") + "]"
    }
}
