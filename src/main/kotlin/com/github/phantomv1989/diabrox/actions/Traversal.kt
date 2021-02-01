package com.github.phantomv1989.diabrox.actions

import com.intellij.psi.PsiElement
import com.intellij.psi.util.elementType


class Traversal {
    companion object {
        fun traverseElement(ele: PsiElement, indexer: Indexer) {
            if (isStubIgnored(ele)) return
            findLinks(ele, indexer)
            indexer.addStructNode(ele)
            for (x1 in ele.children) traverseElement(x1, indexer)
        }

        fun findLinks(ele: PsiElement, nodeIndex: Indexer) {
            findRef(ele, nodeIndex)
            findNew(ele, nodeIndex)
            findAssignment(ele, nodeIndex)
            findMethodCallArgs(ele, nodeIndex)
        }

        fun findRef(ele: PsiElement, nodeIndex: Indexer) {
            var x = ele.reference
            if (x != null) {
                var y = x?.resolve()
                var refEle = y?.originalElement
                if (refEle != null) {
                    if (refEle.containingFile != null) {
                        nodeIndex.addDataLink(ele, refEle, "ref", null)
                    }
                }
            }
        }

        fun findBinary(ele: PsiElement, nodeIndex: Indexer) {

        }

        fun findNew(ele: PsiElement, nodeIndex: Indexer) {
            if (ele.elementType.toString() != "NEW_EXPRESSION") return
            var eleParent = ele.parent
            while (!eleParent.elementType.toString().endsWith("VARIABLE")) {
                eleParent = eleParent.parent
            }
            for (child in ele.children) {
                if(!checkIsInvalidExpressionList(child)){
                    nodeIndex.addDataLink(eleParent, child, "new", null)
                }
            }
        }

        fun findAssignment(ele: PsiElement, nodeIndex: Indexer) {
            if (ele.elementType.toString() != "ASSIGNMENT_EXPRESSION") return
            for (child in ele.children) {
                if (child.elementType.toString().equals("REFERENCE_EXPRESSION")) {
                    for (child1 in ele.children) {
                        if (!child1.elementType.toString().equals("REFERENCE_EXPRESSION")) {
                            nodeIndex.addDataLink(child, child1, "assignment", null)
                        }
                    }
                    break
                }
            }
        }

        fun findMethodCallArgs(ele: PsiElement, nodeIndex: Indexer) {
            // if no args, then no tgt
            if (ele.elementType.toString() != "METHOD_CALL_EXPRESSION") return
            for (child in ele.children) {
                if (child.elementType.toString().equals("REFERENCE_EXPRESSION")) {
                    for (child1 in ele.children) {
                        if (child1.elementType.toString() == "EXPRESSION_LIST") {
                            for (child2 in child1.children) {
                                nodeIndex.addDataLink(child, child2, "callargs", null)
                            }
                        }
                    }
                    break
                }
            }
        }

        fun isStubIgnored(ele: PsiElement): Boolean {
            val ignoredL = mutableSetOf(
                "IMPORT_LIST",
                "DOC_COMMENT_END",
                "DOC_COMMENT_LEADING_ASTERISKS",
                "DOC_COMMENT_DATA",
                "TRUE_KEYWORD",
                "PACKAGE_KEYWORD",
                "IMPORT_KEYWORD",
                "WHITE_SPACE",
                "SEMICOLON",
                "COMMA",
                "EQ",
                "DOC_COMMENT",
                "END_OF_LINE_COMMENT",
                "C_STYLE_COMMENT",
                "LBRACE",
                "RBRACE",
                "RPARENTH",
                "LPARENTH",
                "DOT",
                "CLASS_KEYWORD",
                "NEW_KEYWORD",
                "REFERENCE_PARAMETER_LIST",
                "IDENTIFIER",
                "STRING_LITERAL"
            )
            return ignoredL.contains(ele.elementType.toString())
        }

        fun isSkippable(ele: PsiElement): Boolean {
            val skip = mutableSetOf(
                "null",
                "IMPORT_STATEMENT",
                "IMPORT_LIST",
                "MODIFIER_LIST",
                "TYPE",
                "TYPE_PARAMETER_LIST",
                "EXTENDS_LIST",
                "IMPLEMENTS_LIST",
                "THROWS_LIST",
            )
            return skip.contains(ele.elementType.toString())
        }

        fun checkIsInvalidExpressionList(ele: PsiElement): Boolean {
            // EXPRESSION_LIST
            if (ele.elementType.toString() != "EXPRESSION_LIST") return false
            return ele.children.size <= 2
        }
    }
}