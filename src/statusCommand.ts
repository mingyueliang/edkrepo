import * as vscode from 'vscode';
import path, * as syspath from 'path';
import * as fs from 'fs';
import { runPythonScript } from './common';




let StatusPanel = new Map();

module.exports = function (context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.status', async (uri: vscode.Uri) => {
        const currentPath = uri.fsPath;
        const currentDirName:any = currentPath.split(syspath.sep).pop();
        var colum = vscode.window.activeTextEditor?vscode.window.activeTextEditor.viewColumn:undefined;
        // If we already have a panel, show it.
        if (StatusPanel.get(currentDirName)) {
            StatusPanel.get(currentDirName).reveal(colum);
        } else {
            const panel = vscode.window.createWebviewPanel(
                '',
                currentDirName,
                vscode.ViewColumn.One,
                {
                    // Allow JS script execution
                    enableScripts: true,
                    // Switching WebView is not visible, and the page content can still be saved.
                    retainContextWhenHidden: true,
                    // Allow load local resource
                    localResourceRoots: [vscode.Uri.file(syspath.join(context.extensionPath, 'src'))]
                }
            );
            StatusPanel.set(currentDirName, panel);
            
            // Call python script 
            // const output = execSync(`py -3 ${path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py')} status ${currentPath}`).toString();
            runPythonScript(path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py'), ['status', uri.fsPath])
            .then(
                stdout => panel.webview.html= getWebviewHtml(context, stdout)
            )
            .catch(
                error => console.log(error)
            );
            // Post data to webview
            // panel.webview.postMessage(output);
            
            // get webview html
            // const htmlSrc = path.join(path.dirname(__filename), 'status.html');
            // panel.webview.html = getWebviewContent(context, htmlSrc);
            // panel.webview.html = getWebviewHtml(context, output);

            // Listen for when the panel disposed
            // This happens when the user closes the panel or when the panel is closed programmatically
            panel.onDidDispose(() => dispose(panel, currentDirName), null, []);

        }
    }));
};


function getWebviewHtml(context: vscode.ExtensionContext, content: string) {
    return (
        `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>status</title>
        </head>
        <body>
            <div id="status">
                <pre>${content}</pre>
            </div>
        </body>
        </html>
        `
    )
}


/**
 * @description Close webview panel
 * @param panel webview panel
 * @param name webview name
 */
function dispose(panel: vscode.WebviewPanel, name: string){
    panel.dispose();
    StatusPanel.delete(name);
}