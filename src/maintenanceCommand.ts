import * as vscode from 'vscode';
import { runPythonScript } from './common';
import path from 'path';


/**
 * The ‘maintenance’ command performs workspace wide repository maintenance and configuration maintenance operations. 
 */
module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.maintenance', (uri:vscode.Uri) => {
        vscode.window.showInputBox(
            {
                password:false,
                ignoreFocusOut:true,
                placeHolder: 'Press Enter to confirm input or Escape cancel',
                prompt: `
                usage: edkrepo maintenance [-h] [--no-gc] [--performance] [-v] [-c]

                Performs workspace wide maintenance operations

                optional arguments:
                    -h, --help     show this help message and exit
                    --no-gc        Skips garbage collection operations. Performs all other workspace maintenance operations.
                    --performance  Displays performance timing data for successful commands
                    -v, --verbose  Increases command verbosity
                    -c, --color    Force color output (useful with 'less -r')              
                `
            }
        ).then(
            args => {
                let command = ['maintenance',uri.fsPath];
                if (args !== '' && args !== undefined) {
                    let args_list = args.split(' ');
                    command = command.concat(args_list);
                }
                runPythonScript(path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py'), command)
                .then(stdout => console.log(stdout))
                .catch(stderr => console.log(stderr));
            }
        );
    }));
};