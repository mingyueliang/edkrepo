import * as vscode from 'vscode';
import { PythonScriptPath, logger, runPythonScript } from './common';
import path from 'path';
import { stderr } from 'process';

/**
 * Deletes untracked files from all repositories in the workspace
 */
module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.clean', (uri: vscode.Uri) => {
        // vscode.window.showInputBox(
        //     {
        //         password:false,
        //         ignoreFocusOut:true,
        //         placeHolder: 'Press Enter to confirm input or Escape cancel',
        //         prompt: `
        //         usage: edkrepo clean [-h] [-f] [-q] [-d] [-x] [--performance] [-v] [-c]             
                                                                                    
        //         Deletes untracked files from all repositories in the workspace                      
                                                                                                    
        //         optional arguments:                                                                 
        //           -h, --help            show this help message and exit                             
        //           -f, --force           Without this flag untracked files are listed but not deleted
        //           -q, --quiet           Don't list files as they are deleted                        
        //           -d, --dirs            Remove directories in addition to files                     
        //           -x, --include-ignored                                                             
        //                                 Removes all untracked files                                 
        //           --performance         Displays performance timing data for successful commands    
        //           -v, --verbose         Increases command verbosity                                 
        //           -c, --color           Force color output (useful with 'less -r')`,
        //         // validateInput: function(text){return text;}
        //     }
        // )
        // .then(function(args){
        //     let command = ['clean', uri.fsPath];
        //     if (args !== undefined && args !== '') {
        //         command = command.concat(args?.split(' '));
        //     }
        //     runPythonScript(path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py'), command, logger);
        // });
        let command = ['clean', uri.fsPath, '-d', '-f'];
        runPythonScript(PythonScriptPath, command, logger);
    }));
};