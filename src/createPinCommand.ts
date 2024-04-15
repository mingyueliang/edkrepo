import * as vscode from 'vscode';
import { PythonScriptPath, logger, runPythonScript } from './common';


module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.create-pin', (uri: vscode.Uri) => {
        let command = ['crp', uri.fsPath];
        vscode.window.showInputBox(
            {
                password:false,
                ignoreFocusOut:true,
                placeHolder: 'Press Enter to confirm input or Escape cancel',
                prompt: `
                usage: edkrepo create-pin [-h] [--source-manifest-repo SOURCE_MANIFEST_REPO] [--performance] [-v] [-c] PinFileName Description

                Creates a PIN file based on the current workspace state
                
                positional arguments:
                  PinFileName           The name of the PIN file. Extension must be .xml. File paths are supported only if the --push option is not used.
                  Description           A short summary of the PIN file contents. Must be contained in ""
                
                optional arguments:
                  -h, --help            show this help message and exit
                  --source-manifest-repo SOURCE_MANIFEST_REPO
                                        The name of the workspace's source global manifest repository
                  --performance         Displays performance timing data for successful commands
                  -v, --verbose         Increases command verbosity
                  -c, --color           Force color output (useful with 'less -r')`
                }
        )
        .then(args =>{
            if (args !== undefined && args !== '') {
                const args_list = args.split(' ');
                command = command.concat(args_list);
            }
            runPythonScript(PythonScriptPath, command, logger);
        });
    }));
};