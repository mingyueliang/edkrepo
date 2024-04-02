import path, { resolve } from 'path';
import * as vscode from 'vscode';
import { callPythonScript, runPythonScript, trimString } from './common';
import { stdout } from 'process';
import { rejects } from 'assert';


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

        
        // const data = execSync(`py -3 ${path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py')} manifest`).toString();
        // console.log(data.substring(data.indexOf('Projects:') + 9).trim().split('\n'));
        // const Projects = data.substring(data.indexOf('Projects:') + 9).trim().split('\n');
        vscode.window.showInputBox(
            {
                password:false,
                ignoreFocusOut:true,
                placeHolder: 'Press Enter to confirm input or Escape cancel',
                prompt: `
                usage: edkrepo manifest [-h] [-a] [--performance] [-v] [-c]

                Lists the available projects.
                
                optional arguments:
                  -h, --help      show this help message and exit
                  -a, --archived  Include a listing of archived projects.
                  --performance   Displays performance timing data for successful commands
                  -v, --verbose   Increases command verbosity
                  -c, --color     Force color output (useful with 'less -r')
                `
            }
        ).then(args => {
            let manifestCommand = ['manifest'];
            if (args !== undefined && args !== '') {
                manifestCommand = manifestCommand.concat(args.split(' '));
            }
            if (manifestCommand.indexOf('-h') !== -1) {
                runPythonScript(path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py'), manifestCommand)
                .then(stdout => {
                    vscode.window.showInformationMessage(stdout);
                });
            } else {
                vscode.window.showInformationMessage("Executing edkrepo manifest command...");
                runPythonScript(path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py'), manifestCommand)
                .then(stdout => {
                    vscode.window.showInformationMessage(stdout);
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
                    const Projects = stdout.substring(stdout.indexOf('Projects:') + 9).trim().split('\n');
                    panel.webview.postMessage(Projects);
                    panel.webview.html = getWebviewContent(context);

                    // vscode recive message from webview
                    panel.webview.onDidReceiveMessage((project: string) => {
                        // vscode.window.showInformationMessage(`Starting clone ${trimString(project)}`);
                        vscode.window.showInputBox(
                            {
                                password:false,
                                ignoreFocusOut:true,
                                placeHolder: 'Press Enter to confirm input or Escape cancel',
                                prompt: `
                                usage: edkrepo clone [-h] [--sparse] [--nosparse] [--treeless] [--blobless] [--single-branch] [--no-tags] [-s]                                                                                     
                                                    [--source-manifest-repo SOURCE_MANIFEST_REPO] [--performance] [-v] [-c]                                                                                                       
                                                    Workspace ProjectNameOrManifestFile [Combination]                                                                                                                             
                                                                                                                                                                                                            
                                Downloads a project and creates a new workspace.                                                                                                                                                   
                                                                                                                                                                                                                                
                                positional arguments:                                                                                                                                                                              
                                    Workspace             The destination for the newly created workspace, this must be an empty directory.                                                                                          
                                                        A value of "." indicates the current working directory.                                                                                                                               
                                    Combination           The name of the combination to checkout. If not specified the projects default combination is used.                                                                        
                                                                                                                                                                                                                                    
                                    optional arguments:                                                                                                                                                                                
                                    -h, --help            show this help message and exit                                                                                                                                            
                                    --sparse              Enables sparse checkout if supported by the project manifest file.                                                                                                         
                                    --nosparse            Disables sparse checkout if the project manifest file enables it by default.                                                                                               
                                    --treeless            Creates a partial "treeless" clone; all reachable commits will be downloaded with additional blobs and trees being downloaded on demand by future Git operations as needed.
                                                        Treeless clones result in significantly faster initial clone times and minimize the amount of content downloaded.                                                          
                                                        Workspaces created with this option are best used for one time workspaces that will be discarded.                                                                          
                                    --blobless            Creates a partial "blobless" clone; all reachable commits and trees will be downloaded with additional blobs being downloaded on demand by future Git operations as needed.
                                                        Blobless clones result in significantly faster initial clone times and minimize the amount of content downloaded.                                                          
                                                        Workspaces created with this option are best used for persistent development environments                                                                                  
                                    --single-branch       Clone only the history leading to the tip of a single branch for each repository in the workspace.                                                                         
                                                        The branch is determined by the default combination or by the Combination parameter.                                                                                       
                                    --no-tags             Skips download of tags and updates config settings to ensure that future pull and fetch operations do not follow tags.                                                     
                                                        Future explicit tag fetches will continue to work as expected.                                                                                                             
                                    -s, --skip-submodule  Skip the pull or sync of any submodules.                                                                                                                                   
                                    --source-manifest-repo SOURCE_MANIFEST_REPO                                                                                                                                                      
                                                        The name of the workspace's source global manifest repository                                                                                                              
                                    --performance         Displays performance timing data for successful commands                                                                                                                   
                                    -v, --verbose         Increases command verbosity                                                                                                                                                
                                    -c, --color           Force color output (useful with 'less -r')                                                                                                                                 
                                `
                            }
                        ).then(args => {
                            var command: string[] = ['clone'];
                            if (args !== undefined && args !== '') {
                                let args_list = args.split(' ');
                                if (args_list.indexOf('-h') !== -1) {
                                    command = command.concat(['-h']);
                                }else {
                                    // Search workspace
                                    for (let index = 0; index < args_list.length; index++) {
                                        const arg = args_list[index];
                                        if (arg.indexOf('-') !== -1) {
                                            args_list.splice(index, 1);
                                        }
                                    }
                                    if (args_list.length !== 0) {
                                        command = command.concat([path.join(uri, args_list[0]), trimString(project)]);
                                    }else {
                                        command = command.concat(args.split(' ').concat([path.join(uri, trimString(project)), trimString(project)]));
                                    }
                                }
                            }else {
                                command = command.concat([path.join(uri, trimString(project)), trimString(project)]);
                            }
                            runPythonScript(path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py'), command)
                            .then(stdout => {
                                if (stdout !== undefined) {
                                    vscode.window.showInformationMessage(stdout);
                                }
                            })
                            .catch(stderr => {
                                vscode.window.showInformationMessage(stderr);
                            });

                        });
                    });
                    // Listen for when the panel disposed
                    // This happens when the user closes the panel or when the panel is closed programmatically
                    panel.onDidDispose(() => dispose(panel, 'Projects'), null, []);

                })
                .catch(stderr => {
                    // vscode.window.showInformationMessage(stderr);
                    console.log(stderr);
                });
            }
        });
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