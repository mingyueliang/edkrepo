import * as vscode from 'vscode';
import { runPythonScript } from './common';
import path from 'path';


/**
 * Allows users to check for updates to EdkRepo and initiate an update if a newer version is available. 
 */
module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.update', (uri:vscode.Uri) => {
        vscode.window.showInputBox(
            {
                password:false,
                ignoreFocusOut:true,
                placeHolder: 'Press Enter to confirm input or Escape cancel',
                prompt: `
                usage: edkrepo update [-h] [--dry-run] [--performance] [-v] [-c]

                Checks for a more recent version of edkrepo. If available attempts to download and install the new version.
                
                optional arguments:
                  -h, --help     show this help message and exit
                  --dry-run      Checks for available updates and notifies the user but does not download or install them.
                  --performance  Displays performance timing data for successful commands
                  -v, --verbose  Increases command verbosity
                  -c, --color    Force color output (useful with 'less -r')`
                }
        ).then(
            args => {
                let command = ['update'];
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