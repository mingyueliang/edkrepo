import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';



module.exports = function (context: vscode.ExtensionContext) {
    // const rootPath = vscode.workspace.name;
    const manifestProvider = new ManifestProvider();

    vscode.window.createTreeView('edkrepo.manifest', {treeDataProvider: manifestProvider});
};

export class ProjectItemNode extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
    }

}

export class ManifestProvider implements vscode.TreeDataProvider<ProjectItemNode> {
    getTreeItem(element: ProjectItemNode): vscode.TreeItem | Thenable<ProjectItemNode> {
        return element;
    }

    getChildren(element?: ProjectItemNode): vscode.ProviderResult<ProjectItemNode[]> {
        return ['repo1', 'repo2', 'repo3'].map(
            item => new ProjectItemNode(item as string, vscode.TreeItemCollapsibleState.None as vscode.TreeItemCollapsibleState)
        );
    }
}