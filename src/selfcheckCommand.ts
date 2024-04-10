import * as vscode from 'vscode';
import { PythonScriptPath, logger, runPythonScript } from './common';


/**
 * Displays diagnostic information including the installed git version and verifies the
 * connections to all remote repositories listed in the workspace manifest. Can be passed a
 * list of projects to verify connectivity to repositories prior to cloning.
*/
module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.selfcheck', (uri: vscode.Uri) =>{
        vscode.window.showInputBox(
            {
                password:false,
                ignoreFocusOut:true,
                placeHolder: 'Press Enter to confirm input or Escape cancel',
                prompt: `
                usage: edkrepo self-check [-h] [--project PROJECT [PROJECT ...]] [--source-manifest-repo SOURCE_MANIFEST_REPO]
                          [--performance] [-v] [-c]

                Displays diagnostic information including the installed git version and verifies the connections to all remote repositories listed in the workspace manifest. 
                Can be passed a list of projects to verify connectivity to repositories prior to cloning.

                optional arguments:
                -h, --help            show this help message and exit
                --project PROJECT [PROJECT ...]
                --source-manifest-repo SOURCE_MANIFEST_REPO
                                        The name of the workspace's source global manifest repository
                --performance         Displays performance timing data for successful commands
                -v, --verbose         Increases command verbosity
                -c, --color           Force color output (useful with 'less -r')
                `
            }
        ).then(args => {
            let selfcheckCommnads = ['self-check'];
            runPythonScript(PythonScriptPath, selfcheckCommnads, logger);
        });
    }));
};