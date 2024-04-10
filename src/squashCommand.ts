import path from 'path';
import * as vscode from 'vscode';
import { PythonScriptPath, logger, runPythonScript } from './common';


/**
 * Enables users to convert multiple commits into a single commit. Users specify a range of 
 * commits which will be merged into one using the same syntax expected by 'git rev-list'. 
 * EdkRepo will conduct the squash operation on a newly created local branch. 
 */
module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.squash', (uri: vscode.Uri) => {
        vscode.window.showInputBox(
            {
                password:false,
                ignoreFocusOut:true,
                placeHolder: 'Press Enter to confirm input or Escape cancel',
                prompt: `
                usage: edkrepo squash [-h] [--oneline] [--performance] [-v] [-c] commit-ish new-branch

                Convert multiple commits in to a single commit

                positional arguments:
                commit-ish     The range of commits to be squashed, specified using the same syntax as git rev-list.
                new-branch     The single commit that is the result of the squash operation will be placed in to a new branch with this name.

                optional arguments:
                -h, --help     show this help message and exit
                --oneline      Compact the commit messsages of the squashed commits down to one line
                --performance  Displays performance timing data for successful commands
                -v, --verbose  Increases command verbosity
                -c, --color    Force color output (useful with 'less -r')
                `
            }
        ).then(args =>{
            let command = ['squash'];
            if (args !== undefined && args !=='') {
                let args_list = args.split(' ');
                if (args_list.indexOf('-h') !== -1) {
                    command = command.concat(['-h']);
                }else {
                    command = command.concat(args_list);
                }
            }
            runPythonScript(PythonScriptPath, command, logger);
        });
    }));
};