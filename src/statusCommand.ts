import * as vscode from 'vscode';
import path, * as syspath from 'path';
import { PythonScriptPath, logger, runPythonScript } from './common';
import { stdout } from 'process';
import { error } from 'console';
import { start } from 'repl';




let StatusPanel = new Map();
let args_list: string[] = [];


/**
 * Allows users to view the currently checked out combo, the currently checked out branch and the status of each repo in the workspace
 */
module.exports = function (context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.status', async (uri: vscode.Uri) => {
        const currentPath = uri.fsPath;
        const currentDirName:any = currentPath.split(syspath.sep).pop();
        var colum = vscode.window.activeTextEditor?vscode.window.activeTextEditor.viewColumn:undefined;
        // If we already have a panel, show it.
        // if (StatusPanel.get(currentDirName)) {
        //     StatusPanel.get(currentDirName).reveal(colum);
        // } else {
            const panel = vscode.window.createWebviewPanel(
                '',
                'edkrepo status',
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
            vscode.window.showInputBox(
                {
                    password:false,
                    ignoreFocusOut:true,
                    placeHolder: 'Press Enter to confirm input or Escape cancel',
                    prompt: `
                    usage: edkrepo status [-h] [--performance] [-v] [-c]

                    Displays the current combo and the status of each repository in the combination.

                    optional arguments:
                        -h, --help     show this help message and exit
                        --performance  Displays performance timing data for successful commands
                        -v, --verbose  Increases command verbosity
                        -c, --color    Force color output (useful with 'less -r')
                    `
                }
            ).then(args => {
                let command = ['status', uri.fsPath];
                if (args !== undefined && args !== '') {
                    command = command.concat(args.split(' '));
                }
                runPythonScript(PythonScriptPath, command, logger)
                .then(stdout => {
                    // const opc = vscode.window.createOutputChannel('status');
                    // opc.clear();
                    // opc.append(stdout);
                    // opc.show();
                    
                    panel.webview.html= getWebviewHtml(context, stdout);
                })
                .catch( error => {
                    console.log(error);
                    if (error !== undefined) {
                        vscode.window.showInformationMessage(error);
                    }
                });

            });
            
            // Call python script 
            // const output = execSync(`py -3 ${path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py')} status ${currentPath}`).toString();
            // runPythonScript(path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py'), ['status', uri.fsPath])
            // .then(stdout => {
            //     vscode.window.showInformationMessage(stdout);
            //     panel.webview.html= getWebviewHtml(context, stdout);
            // }

            // )
            // .catch(
            //     error => console.log(error)
            // );

            // Listen for when the panel disposed
            // This happens when the user closes the panel or when the panel is closed programmatically
            panel.onDidDispose(() => dispose(panel, currentDirName), null, []);

        // }
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
    );
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