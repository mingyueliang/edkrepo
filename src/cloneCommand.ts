import path from 'path';
import * as vscode from 'vscode';
import { callPythonScript, runPythonScript, trimString } from './common';
import * as fs from 'fs'
;
import { execSync } from 'child_process';
import { url } from 'inspector';
import { stderr, stdout } from 'process';
import { start } from 'repl';

let webviewPanel = new Map();

module.exports = function (context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.clone', (uri: vscode.Uri) => {
        vscode.window.showInformationMessage(`uri: ${uri.fsPath}`);

        createWebviewPanel(context, uri.fsPath);
    }));
};


/**
 * Generate html through communication
 * @param context 
 * @returns html
 */
function getWebviewContent(context: vscode.ExtensionContext,) {
    return (
        `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>repos</title>
                <script src="https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js"></script>
                <style></style>
            </head>
            <body>
                <div id="manifest">
                    <spwn> Projects: <spwn>
                    <ul id="projects"></ul>
                </div>

                <script type="text/javascript">
                    const vscode = acquireVsCodeApi()

                    window.addEventListener('message', (event) => {
                        const message = event.data
                        var ul = document.getElementById('projects')
                        for (let i=0; i< message.length; i++) {
                            var li = document.createElement('li')
                            li.setAttribute('id', 'project')
                            li.innerText = message[i];
                            ul.appendChild(li)
                        };
                    })

                    $('#projects').on('click', 'li', function(e) {
                        vscode.postMessage($(e.target)[0].innerText)
                    })
            </script>

            </body>
        </html>      `
    );
}

/**
 * Create webview panel
 * @param context 
 * @param uri 
 */
function createWebviewPanel(context: vscode.ExtensionContext, uri: string) {
    var column = vscode.window.activeTextEditor?vscode.window.activeTextEditor.viewColumn:undefined;
    if (webviewPanel.get("Projects")) {
        webviewPanel.get('Projects').reveal(column);
    } else {
        const panel = vscode.window.createWebviewPanel(
            'Projects',
            'Projects',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );
        webviewPanel.set('Projects', panel);
        
        // const data = execSync(`py -3 ${path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py')} manifest`).toString();
        // console.log(data.substring(data.indexOf('Projects:') + 9).trim().split('\n'));
        // const Projects = data.substring(data.indexOf('Projects:') + 9).trim().split('\n');
        runPythonScript(path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py'), ['manifest'])
        .then(stdout => {
            const Projects = stdout.substring(stdout.indexOf('Projects:') + 9).trim().split('\n');
            panel.webview.postMessage(Projects);
            panel.webview.html = getWebviewContent(context);
        })
        .catch(stderr => console.log(stderr));
    
        // vscode post message to webview
        // panel.webview.postMessage(Projects);
        // panel.webview.html = getWebviewContent(context);

        // vscode recive message from webview
        panel.webview.onDidReceiveMessage(project => {
            vscode.window.showInformationMessage(`Starting clone ${trimString(project)}`);
            callPythonScript(path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py'), ['clone', path.join(uri, trimString(project)), trimString(project)])
            .then(stdout => console.log(stdout))
            .catch(stderr => console.log(stderr));

        });
        // Listen for when the panel disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        panel.onDidDispose(() => dispose(panel, 'Projects'), null, []);
    }
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