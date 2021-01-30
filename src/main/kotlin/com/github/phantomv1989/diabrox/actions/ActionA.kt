package com.github.phantomv1989.diabrox.actions

import com.intellij.ide.util.PropertiesComponent
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.project.Project
import com.intellij.openapi.roots.ProjectRootManager
import com.intellij.openapi.vfs.VirtualFile
import com.intellij.psi.PsiElement
import com.intellij.psi.PsiManager
import com.intellij.psi.util.elementType
import org.jetbrains.annotations.NotNull
import com.google.gson.Gson
import com.google.gson.GsonBuilder

internal class HierarchicalObj(name: String, id: String, etype: String) {
    val name: String = name
    var value: Int = 5
    val id: String = id
    val etype: String = etype
    var children: HashMap<String, HierarchicalObj> = HashMap()
    var parent: HierarchicalObj? = null

    fun addChildren(h: HierarchicalObj) {
        children.set(h.id, h)
        h.parent = this
    }

    override fun toString(): String {
        val r: MutableList<String> = ArrayList()
        r.add("\"name\":\"" + this.name + "\"")
        r.add("\"value\":" + this.value.toString())
        r.add("\"id\":\"" + this.id + "\"")
        r.add("\"etype\":\"" + this.etype + "\"")
        val children: MutableList<String> = ArrayList()
        for (c in this.children) {
            children.add(c.value.toString())
        }
        if (children.size > 0) {
            r.add("\"children\":" + "[" + children.joinToString(",") + "]")
        }
        return "{" + r.joinToString(",") + "}"
    }
}

internal class ActionA : AnAction() {
    var visualObj = HierarchicalObj("root", "", "root")

    override fun update(e: @NotNull AnActionEvent) {
        // Using the event, evaluate the context, and enable or disable the action.
    }


    override fun actionPerformed(e: AnActionEvent) {
        visualObj = HierarchicalObj("root", "", "root")
        var x = e.project?.let { ProjectRootManager.getInstance(it).contentSourceRoots }
        var y = e.project?.let { PropertiesComponent.getInstance(it) }
        x?.let {
            e.project?.let { it1 -> traverseSourceRoots(it, it1, visualObj) }
        }
        visualObj.toString()
    }


    fun traverseSourceRoots(sourceRoots: Array<VirtualFile>, project: Project, visualObj: HierarchicalObj) {
        for (path in sourceRoots) {
            val vchild = HierarchicalObj(path.name, System.identityHashCode(path).toString(), "path")
            visualObj.addChildren(vchild)
            if (path.isDirectory) {
                traverseSourceRoots(path.children, project, vchild)
            } else if (path.extension.toString() == "java") {
                println("file:" + path.path)
                PsiManager.getInstance(project).findFile(path)?.let { findRef(it, vchild) }
            }
        }
    }

    fun findRef(ele: PsiElement, visualObj: HierarchicalObj) {
        var x = ele.reference
        if (x != null) {
            var y = x?.resolve()
            var y1 = y?.originalElement
            if (y1 != null) {
                if (y1.containingFile != null) {
                    println("     src:" + ele.elementType.toString() + " tgt:" + y1.elementType.toString() + " " + ele.text + " --->:" + y1.containingFile.toString())
                }
            }
        }
        try {
            var etype = ele.elementType.toString()
            when (etype) {
                "PACKAGE_STATEMENT" -> return
                "IMPORT_STATEMENT" -> return
                "IMPORT_LIST" -> return
                "WHITE_SPACE" -> return
                "MODIFIER_LIST" -> return
                "SEMICOLON" -> return
                "EQ" -> return
                "TYPE" -> return
                "TYPE_PARAMETER_LIST" -> return
                "EXTENDS_LIST" -> return
                "IMPLEMENTS_LIST" -> return
                "THROWS_LIST" -> return
                "DOC_COMMENT" -> return
                "REFERENCE_PARAMETER_LIST" -> return
                "END_OF_LINE_COMMENT" -> return
                "C_STYLE_COMMENT" -> return
                "LBRACE" -> return
                "RBRACE" -> return
                "RPARENTH" -> return
                "LPARENTH" -> return
                "DOT" -> return
                "CLASS_KEYWORD" -> return
                "NEW_KEYWORD" -> return
                "NE" -> return
                "IDENTIFIER" -> return
                else -> {
                    val s1 = ele.toString().split(":")
                    fun foo() {
                        for (x1 in ele.children) {
                            findRef(x1, visualObj)
                        }
                    }
                    if (s1.size == 1) {
                        foo()
                    } else {
                        when (etype) {
                            "METHOD_CALL_EXPRESSION" -> foo()
                            "NEW_EXPRESSION" -> foo()
//                            "ASSIGNMENT_EXPRESSION" -> foo()
//                            "REFERENCE_EXPRESSION" -> foo()
//                            "RESOURCE_LIST" -> foo()
//                            "LOCAL_VARIABLE" -> foo()
//                            "FIELD" -> foo()
//                            "JAVA_CODE_REFERENCE" -> foo()
//                            "BINARY_EXPRESSION" -> foo()
//                            "LITERAL_EXPRESSION" -> foo()
                            else -> {
                                var s2 = s1[1].replace("\"", "'").replace("\n", "\\n")
                                val vchild = HierarchicalObj(s2, System.identityHashCode(ele).toString(), etype)
                                visualObj.addChildren(vchild)
                                for (x1 in ele.children) {
                                    findRef(x1, vchild)
                                }
                            }
                        }
                    }
                }
            }
        } catch (e: Exception) {
            println("ERROR:" + e.toString())
        }
    }
}