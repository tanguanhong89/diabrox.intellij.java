package com.github.phantomv1989.diabrox.actions

import com.github.phantomv1989.diabrox.actions.Traversal.Companion.checkExpressionList
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
            "call"
        )
    )
    var hobj = HierarchicalObj("root", "", "root", null)
    var nodeIndex: HashMap<String, HierarchicalObj> = HashMap()

    fun getNodesJsonString(): String {
        return hobj.toString()
    }

    fun getLinksString(): String {
        val r: MutableList<String> = ArrayList()
        for (nodeId in nodeIndex.keys) {
            val node = nodeIndex.get(nodeId)
            node?.let {
                for (l in node.links) {
                    r.add("{\"src\":" + node.id + ",\"type\":\"" + l.type + "\",\"dst\":" + l.target.id + "}")
                }
            }
        }
        return "[" + r.joinToString(",") + "]"
    }

    fun addLink(src: PsiElement, tgt: PsiElement, type: String, value: Int?) {
        val srcNode = addElement(src)
        val tgtNode = addElement(tgt)

        addStructNode(src)
        addStructNode(tgt)
        srcNode?.let {
            tgtNode?.let { srcNode.addTarget(tgtNode, type, value) }
        }
    }

    fun addStructNode(ele: PsiElement): GraphNode? {
        val etype = ele.elementType.toString()
        val id = System.identityHashCode(ele).toString()
        if (StructureGraph.IdIndex.containsKey(id)) return StructureGraph.IdIndex.get(id)

        val eleParent = ele.parent
        var lastExistingParent: GraphNode = hobj
        if (eleParent != null) {
            lastExistingParent = addElement(eleParent)
        }
        fun foo(lastExistingParent: GraphNode): GraphNode {
            val s1 = ele.toString().split(":")
            var s2 = s1[0]
            if (s1.size > 1) {
                s2 = s1[1]
            }
            s2 = s2.replace("\"", "'").replace("\n", "\\n")
            val nodeObj = HierarchicalObj(s2, id, etype, ele)

            var offsetKey = ele.startOffsetInParent
            if (ele is PsiFile) {
                offsetKey = lastExistingParent.findLinks(mutableSetOf("child")).size
            }
            lastExistingParent.addTarget(nodeObj, "child", offsetKey)
            nodeObj.addSource(nodeObj, "parent", offsetKey)
            StructureGraph.addNode(nodeObj)
            return nodeObj
        }
        if (ele is PsiFile) {
            return foo(lastExistingParent)
        }
        if (!checkExpressionList(ele)) return lastExistingParent
        if (Traversal.isBlacklisted(ele)) return lastExistingParent
        return foo(lastExistingParent)
    }

    fun addElement(ele: PsiElement): HierarchicalObj {
        val etype = ele.elementType.toString()
        val id = System.identityHashCode(ele).toString()
        if (nodeIndex.containsKey(id)) return nodeIndex.getOrDefault(id, hobj)

        val eleParent = ele.parent
        var lastExistingParent: HierarchicalObj = hobj
        if (eleParent != null) {
            lastExistingParent = addElement(eleParent)
        }
        fun foo(lastExistingParent: HierarchicalObj): HierarchicalObj {
            val s1 = ele.toString().split(":")
            var s2 = s1[0]
            if (s1.size > 1) {
                s2 = s1[1]
            }
            s2 = s2.replace("\"", "'").replace("\n", "\\n")
            val nodeObj = HierarchicalObj(s2, id, etype, ele)

            var offsetKey = ele.startOffsetInParent
            if (ele is PsiFile) {
                offsetKey = lastExistingParent.children.size
            }
            lastExistingParent.addChild(nodeObj, offsetKey)
            nodeIndex.put(nodeObj.id, nodeObj)
            return nodeObj
        }
        if (ele is PsiFile) {
            return foo(lastExistingParent)
        }
        if (!checkExpressionList(ele)) return lastExistingParent
        if (Traversal.isBlacklisted(ele)) return lastExistingParent
        return foo(lastExistingParent)
    }
}
