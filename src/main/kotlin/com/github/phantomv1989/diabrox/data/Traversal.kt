package com.github.phantomv1989.diabrox.data

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
            // *_EXPRESSION to *_EXPRESSION
            if (ele.elementType.toString() != "BINARY_EXPRESSION") return
            for (child in ele.children) {
                if (child.elementType.toString().endsWith("_EXPRESSION")) {
                    var c = child.nextSibling
                    while (c != null) {
                        if (c.elementType.toString().endsWith("_EXPRESSION")) {
                            nodeIndex.addDataLink(child, c, "binary", null)
                            break
                        } else {
                            c = c.nextSibling
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
                "RBRACKET",
                "LBRACKET",
                "DOT",
                "CLASS_KEYWORD",
                "NEW_KEYWORD",
                "REFERENCE_PARAMETER_LIST",
                "IDENTIFIER",
                "STRING_LITERAL",
                "INTEGER_LITERAL", "INT_KEYWORD", "STATIC_KEYWORD",
                "TRY_KEYWORD",
                "VOID_KEYWORD",
                "PUBLIC_KEYWORD",
                "IF_KEYWORD"
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