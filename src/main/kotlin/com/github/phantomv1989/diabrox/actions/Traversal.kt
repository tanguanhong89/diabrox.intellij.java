package com.github.phantomv1989.diabrox.actions

import com.intellij.psi.PsiElement
import com.intellij.psi.util.elementType


class Traversal {
    companion object {
        fun traverseElement(ele: PsiElement, nodeIndex: Indexer) {
            if (isStubIgnored(ele)) return
            findLinks(ele, nodeIndex)
            nodeIndex.addElement(ele)
            nodeIndex.addStructNode(ele)
            for (x1 in ele.children) traverseElement(x1, nodeIndex)
        }

        fun findLinks(ele: PsiElement, nodeIndex: Indexer) {
            findRef(ele, nodeIndex)
            findNew(ele, nodeIndex)
            findAssignment(ele, nodeIndex)
            findMethodCall(ele, nodeIndex)
        }

        fun findRef(ele: PsiElement, nodeIndex: Indexer) {
            var x = ele.reference
            if (x != null) {
                var y = x?.resolve()
                var refEle = y?.originalElement
                if (refEle != null) {
                    if (refEle.containingFile != null) {
                        nodeIndex.addLink(ele, refEle, "ref",null)
                    }
                }
            }
        }

        fun findNew(ele: PsiElement, nodeIndex: Indexer) {
            if (ele.elementType.toString() != "NEW_EXPRESSION") return
            var eleParent = ele.parent
            while (!eleParent.elementType.toString().endsWith("VARIABLE")) {
                eleParent = eleParent.parent
            }
            for (child in ele.children) {
                nodeIndex.addLink(eleParent, child, "new",null)
            }
        }

        fun findAssignment(ele: PsiElement, nodeIndex: Indexer) {
            if (ele.elementType.toString() != "ASSIGNMENT_EXPRESSION") return
            for (child in ele.children) {
                if (child.elementType.toString().equals("REFERENCE_EXPRESSION")) {
                    for (child1 in ele.children) {
                        if (!child1.elementType.toString().equals("REFERENCE_EXPRESSION")) {
                            nodeIndex.addLink(child, child1, "assignment",null)
                        }
                    }
                    break
                }
            }
        }

        fun findMethodCall(ele: PsiElement, nodeIndex: Indexer) {
            // if no args, then no tgt
            if (ele.elementType.toString() != "METHOD_CALL_EXPRESSION") return
            for (child in ele.children) {
                if (child.elementType.toString().equals("REFERENCE_EXPRESSION")) {
                    for (child1 in ele.children) {
                        if (!child1.elementType.toString().equals("REFERENCE_EXPRESSION")) {
                            if (checkExpressionList(child1)) nodeIndex.addLink(child, child1, "call",null)
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

                )
            return ignoredL.contains(ele.elementType.toString())
        }

        fun isBlacklisted(ele: PsiElement): Boolean {
            val blacklist = mutableSetOf(
                "null",
                "PACKAGE_KEYWORD",
                "IMPORT_KEYWORD",
                "IMPORT_STATEMENT",
                "IMPORT_LIST",
                "WHITE_SPACE",
                "MODIFIER_LIST",
                "SEMICOLON",
                "COMMA",
                "EQ",
                "TYPE",
                "TYPE_PARAMETER_LIST",
                "EXTENDS_LIST",
                "IMPLEMENTS_LIST",
                "THROWS_LIST",
                "DOC_COMMENT",
                "REFERENCE_PARAMETER_LIST",
                "END_OF_LINE_COMMENT",
                "C_STYLE_COMMENT",
                "LBRACE",
                "RBRACE",
                "RPARENTH",
                "LPARENTH",
                "DOT",
                "CLASS_KEYWORD",
                "NEW_KEYWORD",
                "NE",
                "IDENTIFIER",
                "STRING_LITERAL",
            )
            return blacklist.contains(ele.elementType.toString())
        }

        fun checkExpressionList(ele: PsiElement): Boolean {
            // EXPRESSION_LIST
            if (ele.elementType.toString() != "EXPRESSION_LIST") return true
            return ele.children.size > 2
        }

    }
}