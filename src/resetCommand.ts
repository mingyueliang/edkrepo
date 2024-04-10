import * as vscode from 'vscode';
import { PythonScriptPath, logger, runPythonScript } from './common';
import path from 'path';


/**
 * Allows users to unstage all staged changes from all repositories in their workspace with a single command
 */
module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.reset', (uri:vscode.Uri) => {
        // vscode.window.showInputBox(
        //     {
        //         password:false,
        //         ignoreFocusOut:true,
        //         placeHolder: 'Press Enter to confirm input or Escape cancel',
        //         prompt: `
        //         usage: edkrepo reset [-h] [--hard] [--performance] [-v] [-c]             
                                                                         
        //         Unstages all staged files in the workspace                               
                                                                                         
        //         optional arguments:                                                      
        //           -h, --help     show this help message and exit                         
        //           --hard         Deletes files after unstaging                           
        //           --performance  Displays performance timing data for successful commands
        //           -v, --verbose  Increases command verbosity                             
        //           -c, --color    Force color output (useful with 'less -r')              
        //         `
        //     }
        // ).then(
        //     args => {
        //         let command = ['reset'];
        //         if (args !== '' && args !== undefined) {
        //             let args_list = args.split(' ');
        //             command = command.concat([uri.fsPath]).concat(args_list);
        //         }
        //         if (command.length <= 1) {
        //             command = command.concat(['-h']);
        //         }
        //         runPythonScript(path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py'), command, logger)
        //         .then(stdout => console.log(stdout))
        //         .catch(stderr => console.log(stderr));
        //     }
        // );
        let command = ['reset', uri.fsPath,'--hard', '-v'];
        runPythonScript(PythonScriptPath, command, logger);
    }));
};