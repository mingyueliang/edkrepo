import * as vscode from 'vscode';


module.exports = function (context: vscode.ExtensionContext) {
    const refreshProjectCommand = vscode.commands.registerCommand('edkrepo.manifest.refresh', () => {
        vscode.commands.executeCommand('workbench.action.reloadWindow');
    });

    context.subscriptions.push(refreshProjectCommand);
};