package com.github.phantomv1989.diabrox.actions

import com.intellij.ide.util.PropertiesComponent
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.project.Project
import com.intellij.openapi.roots.ProjectRootManager
import com.intellij.openapi.vfs.VirtualFile
import com.intellij.psi.PsiElement
import com.intellij.psi.PsiManager
import org.jetbrains.annotations.NotNull

internal class ActionA : AnAction() {
    override fun update(e: @NotNull AnActionEvent) {
        // Using the event, evaluate the context, and enable or disable the action.
    }


    override fun actionPerformed(e: AnActionEvent) {
        var myIndex = Indexer()
        var x = e.project?.let { ProjectRootManager.getInstance(it).contentSourceRoots }
        //var y = e.project?.let { PropertiesComponent.getInstance(it) }
        x?.let {
            e.project?.let { it1 -> traverseSourceRoots(it, it1, myIndex) }
        }
        myIndex.computeGraphs()
        var r = myIndex.toJsonStringNodes()
        var r1 = myIndex.toJsonStringLinks()
    }


    fun traverseSourceRoots(sourceRoots: Array<VirtualFile>, project: Project, nodeIndex: Indexer) {
        for (path in sourceRoots) {
            if (path.isDirectory) {
                traverseSourceRoots(path.children, project, nodeIndex)
            } else if (path.extension.toString() == "java") {
                PsiManager.getInstance(project).findFile(path)?.let { Traversal.traverseElement(it, nodeIndex) }
            }
        }
    }
}
