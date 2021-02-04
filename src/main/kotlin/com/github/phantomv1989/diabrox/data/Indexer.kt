package com.github.phantomv1989.diabrox.data

import com.github.phantomv1989.diabrox.data.Traversal.Companion.checkIsInvalidExpressionList
import com.github.phantomv1989.diabrox.data.Traversal.Companion.isSkippable
import com.github.phantomv1989.diabrox.data.Traversal.Companion.isStubIgnored
import com.intellij.psi.PsiDirectory
import com.intellij.psi.PsiElement
import com.intellij.psi.PsiFile
import com.intellij.psi.util.elementType


class Indexer {
    var typeLookup: HashMap<Int, String> = HashMap() //doubly linked map
    var _typeLookup: HashMap<String, Int> = HashMap()

    var ignoredNames: Set<String> = mutableSetOf(
        "PsiExpressionStatement",
        "PsiExpressionList",
        "PsiDeclarationStatement",
        "PsiCodeBlock",
        "PsiIfStatement",
        "PsiBlockStatement",
        "PsiCatchSection",
        "PsiReturnStatement",
        "PsiAnnotation",
        "PsiTryStatement",
        "PsiWhileStatement",
    )

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

    fun addOrGetTypeId(s: String): Int {
        if (!_typeLookup.containsKey(s)) {
            typeLookup[_typeLookup.size] = s
            _typeLookup[s] = _typeLookup.size
        }
        return _typeLookup[s]!!
    }

    fun psiToNode(ele: PsiElement, value: Int = 1): GraphNode {
        val s1 = ele.toString().split(":")
        var s2 = s1[0]
        if (s1.size > 1) {
            s2 = s1[1]
        }
        s2 = s2.replace("\"", "'").replace("\n", "\\n")
        if (s2 in ignoredNames) return GraphNode("", getHash(ele).toInt(), ele.elementType.toString(), ele, value)
        if (s2.length > 50) s2 = s2.substring(0, 50)
        return GraphNode(s2, getHash(ele).toInt(), ele.elementType.toString(), ele, value)
    }

    fun getHash(ele: PsiElement): Int {
        return System.identityHashCode(ele)
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
            if (ele is PsiDirectory && ele.parent != null) {
                nodeObj.name = "/" + nodeObj.name.split("/").last()
            }
            lastExistingParent?.addLink(nodeObj, "child", offsetKey)
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

    fun toVisualObjProtobuf(): VisualObj.VisualNode {
        fun foo(n: GraphNode): VisualObj.VisualNode {
            var r = VisualObj.VisualNode.newBuilder()
                .setName(n.name)
                .setId(n.id)
                .setType(addOrGetTypeId(n.type))
                .setValue(n.value)

            r.addAllChildren(n.findLinksWithDirection(StructureGraph.ForLinks, true)
                .map { x -> foo(x.target) })
            return r.build()
        }

        var r = VisualObj.VisualNode.newBuilder()
            .setName("root")
            .setId(-1)
            .setType(addOrGetTypeId("root"))
            .setValue(0)
        r.addAllChildren(StructureGraph.heads.values.map { x -> foo(x) })
        return r.build()
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

    fun toCompressedOutput() {
        var protobufStr = toVisualObjProtobuf().toByteArray().contentToString()
        var typeLKArr = ArrayList<String>()

        for (k in typeLookup) {
            typeLKArr.add(k.key.toString() + ":\"" + k.value + "\"")
        }
        var typeLookupSerialized = "{" + typeLKArr.joinToString(",") + "}"
        println(protobufStr)
        println(typeLookupSerialized)
    }
}
