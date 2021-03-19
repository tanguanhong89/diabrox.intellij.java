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

    var nodeIdLookup: HashMap<Int, Int> = HashMap() //doubly linked map
    var _nodeIdLookupHashToId: HashMap<Int, Int> = HashMap()

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

    var StructureGraph = Graph()


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
        var id = addOrGetUniqueId(ele)
        if (s2 in ignoredNames) return GraphNode("", id, ele.elementType.toString(), ele, value)
        if (s2.length > 50) s2 = s2.substring(0, 50)
        return GraphNode(s2, id, ele.elementType.toString(), ele, value)
    }

    fun addOrGetUniqueId(ele: PsiElement): Int {
        val s = System.identityHashCode(ele)
        if (!_nodeIdLookupHashToId.containsKey(s)) {
            nodeIdLookup[_nodeIdLookupHashToId.size] = s
            _nodeIdLookupHashToId[s] = _nodeIdLookupHashToId.size
        }
        return _nodeIdLookupHashToId[s]!!
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
                srcNode.addLink(tgtNode, type, value)
            }
        }
    }

    fun addStructNode(ele: PsiElement?): GraphNode? {
        if (ele == null) return null
        val id = addOrGetUniqueId(ele)
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

            r.addAllChildren(n.findLinksWithDirection(StructureGraph.childLinkLabel, true)
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

    fun toJsonStringNodes(compress: Boolean): String {
        fun foo(n: GraphNode): String {
            if (compress) {
                var r = ArrayList<String>()
                //r.add("\"n\":\"" + n.name + "\"")
                r.add("\"i\":\"" + n.id + "\"")
                r.add("\"t\":\"" + addOrGetTypeId(n.type).toString() + "\"")
                r.add("\"v\":" + n.value.toString() + "")
                var children = n.findLinksWithDirection(StructureGraph.childLinkLabel, true)
                if (children.size > 0) {
                    r.add("\"c\":[" + children.map { x -> foo(x.target) }.joinToString(",") + "]")
                }
                return "{" + r.joinToString(",") + "}"
            } else {
                var r = ArrayList<String>()
                r.add("\"n\":\"" + n.name + "\"")
                r.add("\"i\":\"" + n.id + "\"")
                r.add("\"t\":\"" + n.type + "\"")
                r.add("\"v\":" + n.value.toString() + "")
                var children = n.findLinksWithDirection(StructureGraph.childLinkLabel, true)
                if (children.size > 0) {
                    r.add("\"c\":[" + children.map { x -> foo(x.target) }.joinToString(",") + "]")
                }
                return "{" + r.joinToString(",") + "}"
            }
        }

        var r1 = ArrayList<String>()
        r1.add("\"n\":\"root\"")
        r1.add("\"i\":\"0\"")
        r1.add("\"t\":" + addOrGetTypeId("root").toString())
        r1.add("\"v\":1")
        r1.add("\"c\":[" + StructureGraph.heads.values.map { x -> foo(x) }.joinToString(",") + "]")
        return "{" + r1.joinToString(",") + "}"
    }

    fun toJsonStringDataflow(): String {
        var r = ArrayList<String>()
        var covered = mutableSetOf<Int>()
        fun foo(v: GraphNode) {
            if (!covered.contains(v.id)) {
                covered.add(v.id)
                val datalinks = v.findLinksWithDirection(mutableSetOf("data"), true)
                datalinks.forEach { l ->
                    print(v.name)
                    print(":")
                    println(l.target.name)
                    foo(l.target)
                }
            }
        }
        StructureGraph.IdIndex.forEach { k, v ->
            if (v.type.equals("LITERAL_EXPRESSION")) {
                foo(v)
            }
        }
        return "{" + r.joinToString(",") + "}"
    }

    fun toJsonStringDataflow1(): String {
        var r = ArrayList<String>()
        StructureGraph.IdIndex.forEach { k, v ->
            var dlinks = v.findLinksWithDirection(mutableSetOf("data"), true)
            if (dlinks.size > 0) {
                r.add(v.id.toString() + ":[" + dlinks.map { x -> x.target.id.toString() }.joinToString(",") + "]")
            }
        }
        return "{" + r.joinToString(",") + "}"
    }

    fun toJsonStringLinks(): String {
        var r = ArrayList<String>()
        StructureGraph.headGraphs.forEach { x ->
            r.add("\"" + x.key.toString() + "\":[" + x.value.joinToString(",") + "]")
        }
        return "{" + r.joinToString(",") + "}"
    }

    fun toJsonStringNodesProtobuf() {
        val protobufStr = toVisualObjProtobuf().toByteArray()!!.contentToString()
        val typeLKArr = ArrayList<String>()

        for (k in typeLookup) {
            typeLKArr.add(k.key.toString() + ":\"" + k.value + "\"")
        }
        val typeLookupSerialized = "{" + typeLKArr.joinToString(",") + "}"
        println(protobufStr)
        println(typeLookupSerialized)
    }
}
