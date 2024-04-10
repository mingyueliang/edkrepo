import * as vscode from 'vscode';
import { PythonScriptPath, logger, runPythonScript } from './common';
import path from 'path';


/**
 * The 'log; command allows users to see the combined log output for all repositories in their workspace. 
 * The log entries for all repositories are interleaved showing a chronological history of the project.
 */
module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.sparse', (uri:vscode.Uri) => {
        // vscode.window.showInputBox(
        //     {
        //         password:false,
        //         ignoreFocusOut:true,
        //         placeHolder: 'Press Enter to confirm input or Escape cancel',
        //         prompt: `
        //         usage: edkrepo sparse [-h] [--enable] [--disable] [--performance] [-v] [-c]

        //         Displays the current sparse checkout status and enables changing the sparse checkout state.
                
        //         optional arguments:
        //           -h, --help     show this help message and exit
        //           --enable       Enables sparse checkout if supported in the project manifest file.
        //           --disable      Disables sparse checkout if it is currently enabled.
        //           --performance  Displays performance timing data for successful commands
        //           -v, --verbose  Increases command verbosity
        //           -c, --color    Force color output (useful with 'less -r')`            
        //         }
        // ).then(
        //     args => {
        //         let command = ['sparse',uri.fsPath];
        //         if (args !== '' && args !== undefined) {
        //             let args_list = args.split(' ');
        //             command = command.concat(args_list);
        //         }
        //         runPythonScript(path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py'), command, logger)
        //         .then(stdout => console.log(stdout))
        //         .catch(stderr => console.log(stderr));
        //     }
        // );
        let command = ['sparse',uri.fsPath];
        runPythonScript(PythonScriptPath, command, logger);
    }));
};