import * as vscode from 'vscode';
import { runPythonScript } from './common';
import path from 'path';


/**
 * The 'log; command allows users to see the combined log output for all repositories in their workspace. 
 * The log entries for all repositories are interleaved showing a chronological history of the project.
 */
module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.log', (uri:vscode.Uri) => {
        vscode.window.showInputBox(
            {
                password:false,
                ignoreFocusOut:true,
                placeHolder: 'Press Enter to confirm input or Escape cancel',
                prompt: `
                usage: edkrepo log [-h] [-n NUMBER] [-o] [--performance] [-v] [-c]              
                                                                                
                Combined log output for all repos across the workspace                          
                                                                                                
                optional arguments:                                                             
                  -h, --help            show this help message and exit                         
                  -n NUMBER, --number NUMBER                                                    
                                        Only show NUMBER most recent commits                    
                  -o, --oneline         Show a single-line summary for each commit              
                  --performance         Displays performance timing data for successful commands
                  -v, --verbose         Increases command verbosity                             
                  -c, --color           Force color output (useful with 'less -r')`
            }
        ).then(
            args => {
                let command = ['log',uri.fsPath];
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