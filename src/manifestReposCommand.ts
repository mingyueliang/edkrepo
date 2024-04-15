import * as vscode from 'vscode';
import { PythonScriptPath, logger, runPythonScript } from './common';


module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.manifest-repos', (uri: vscode.Uri) => {
        let command = ['manifest-repos'];
        vscode.window.showInputBox(
            {
                password:false,
                ignoreFocusOut:true,
                placeHolder: 'Press Enter to confirm input or Escape cancel',
                prompt: `
                usage: edkrepo manifest-repos [-h] [--performance] [-v] [-c] {list,add,remove} [name] [url] [branch] [path]

                Lists, adds or removes a manifest repository.
                
                positional arguments:
                  {list,add,remove}  Which action "list", "add", "remove" to take
                                     List all available manifest repositories.
                                     Add a manifest repository.
                                     Remove a manifest repository.
                  name               The name of a manifest repository to add/remove. Required with Add or Remove flags.
                  url                The URL of a manifest repository to add. Required with Add flag.
                  branch             The branch of a manifest repository to use. Required with Add flag.
                  path               The local path that a manifest is stored at in the edkrepo global data directory. Required with Add flag.
                
                optional arguments:
                  -h, --help         show this help message and exit
                  --performance      Displays performance timing data for successful commands
                  -v, --verbose      Increases command verbosity
                  -c, --color        Force color output (useful with 'less -r')
                  `
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