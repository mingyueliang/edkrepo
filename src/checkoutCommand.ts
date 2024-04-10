import * as vscode from 'vscode';
import { PythonScriptPath, callPythonScript, logger, runPythonScript } from './common';
import path from 'path';

let webviewPanel = new Map();


/**
 * Allows users to switch between different branch combinations as defined in the project manifest file.
 */
module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.checkout', (uri: vscode.Uri) =>{
        createWebviewPanel(context, uri.fsPath);
    }));
};


/**
 * Create combos pannel
 * @param context 
 * @param uri 
 */
function createWebviewPanel(context: vscode.ExtensionContext, uri: string) {
    var column = vscode.window.activeTextEditor?vscode.window.activeTextEditor.viewColumn:undefined;
    if (webviewPanel.get("combos")) {
        webviewPanel.get('combos').reveal(column);
    } else {
        let comboCommand = ['combo', uri];
        // const logger = vscode.window.createOutputChannel('logChannel');
        runPythonScript(PythonScriptPath, comboCommand, logger)
        .then(stdout => {
            const panel = vscode.window.createWebviewPanel(
                '',
                'combos',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );
            webviewPanel.set('combos', panel);
            const Combos = trim(stdout.split(/[\r\n]/g));
            panel.webview.postMessage(Combos);
            panel.webview.html = getWebviewContent();

            // vscode recive message from webview
            panel.webview.onDidReceiveMessage((combo: string) => {
                let checkoutCommand = ['checkout', combo, uri];
                vscode.window.showInformationMessage(`Execute command: edkrepo checkout ${combo}`);
                
                runPythonScript(PythonScriptPath, checkoutCommand, logger)
                .then(stdout =>  {
                    // console.log(stdout);
                    // let poc = vscode.window.createOutputChannel("combo");
                    // poc.clear();
                    // poc.append(stdout);
                    // poc.show();
                })
                .catch(stderr => vscode.window.showErrorMessage(stderr));
                
            });
            // Listen for when the panel disposed
            // This happens when the user closes the panel or when the panel is closed programmatically
            panel.onDidDispose(() => dispose(panel, 'combos'), null, []);

        })
        .catch(stderr => {
            // vscode.window.showInformationMessage(stderr);
            console.log(stderr);
        });
    }
}


function getWebviewContent() {
    return (
        `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>repos</title>
                <script src="https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js"></script>
                <style type="text/css">
                    #branch{
                        color:green;
                    }
                    ul li:hover{
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <div id="manifest">
                    <spwn id="project"><spwn>
                    <ul id="branchs"></ul>
                </div>

                <script type="text/javascript">
                    const vscode = acquireVsCodeApi()

                    window.addEventListener('message', (event) => {
                        const combos = event.data
                        var ul = document.getElementById('branchs')

                        for (let i=1; i<combos.length; i++) {
                            var li = document.createElement('li')
                            li.setAttribute("title", "Click to checkout combo")
                            if (combos[i].indexOf("\*") !== -1){
                                li.setAttribute("id", "branch")
                                li.innerText = combos[i].substring(combos[i].indexOf("*")+1)
                            } else {
                                li.innerText = combos[i]
                            }
                            ul.appendChild(li)
                        };
                    })

                    $('#branchs').on('click', 'li', function(e) {
                        vscode.postMessage($(e.target)[0].innerText)
                    })
            </script>

            </body>
        </html>`
    );
}

/**
 * Remove spaces from both sides and delete empty elements
 * @param array 
 * @returns array
 */
function trim(array:string[]) {
    let arr: string[] = [];
    const reg = /^\s+|\s+$/g;
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element === '') {
            continue;
        }
        arr.push(element.replace(reg, ''));
    }
    
    return arr;
}


/**
 * @description Close webview panel
 * @param panel webview panel
 * @param name webview name
 */
function dispose(panel: vscode.WebviewPanel, name: string){
    panel.dispose();
    webviewPanel.delete(name);
};