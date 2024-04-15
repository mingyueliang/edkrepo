import * as vscode from 'vscode';
import { PythonScriptPath, logger, runPythonScript } from './common';


module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.checkout-pin', (uri: vscode.Uri) => {
        let command = ['chp', uri.fsPath];
        vscode.window.showInputBox(
            {
                password:false,
                ignoreFocusOut:true,
                placeHolder: 'Press Enter to confirm input or Escape cancel',
                prompt: `
                usage: edkrepo checkout-pin [-h] [-o] [--source-manifest-repo SOURCE_MANIFEST_REPO] [--performance] [-v] [-c] pinfile
                                                                                                                     
                Checks out the revisions described in a PIN file in an existing workpace of the same project                         
                                                                                                                                     
                positional arguments:                                                                                                
                  pinfile               The name of the pin file to checkout.                                                        
                                                                                                                                     
                optional arguments:                                                                                                  
                  -h, --help            show this help message and exit                                                              
                  -o, --override        Ignore warnings                                                                              
                  --source-manifest-repo SOURCE_MANIFEST_REPO                                                                        
                                        The name of the workspace's source global manifest repository                                
                  --performance         Displays performance timing data for successful commands                                     
                  -v, --verbose         Increases command verbosity                                                                  
                  -c, --color           Force color output (useful with 'less -r')                                                                   `
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