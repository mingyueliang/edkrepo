import * as vscode from 'vscode';
import { PythonScriptPath, logger, runPythonScript } from './common';


module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.list-repos', (uri: vscode.Uri) => {
        let command = ['list-repos'];
        vscode.window.showInputBox(
            {
                password:false,
                ignoreFocusOut:true,
                placeHolder: 'Press Enter to confirm input or Escape cancel',
                prompt: `
                usage: edkrepo list-repos [-h] [--repos REPOS [REPOS ...]] [-a] [--format FORMAT] [--performance] [-v] [-c]                                                      
                                                                                                                                                                 
                Lists the git repos used by available projects and the branches that are used.                                                                                   
                                                                                                                                                                                 
                optional arguments:                                                                                                                                              
                  -h, --help            show this help message and exit                                                                                                          
                  --repos REPOS [REPOS ...]                                                                                                                                      
                                        Only show the given subset of repos instead of all repos. The name of a repo is determined by the name given by the most manifest files. 
                  -a, --archived        Include a listing of archived projects.                                                                                                  
                  --format FORMAT       Choose between text or json output format. Default is text.                                                                              
                  --performance         Displays performance timing data for successful commands                                                                                 
                  -v, --verbose         Increases command verbosity                                                                                                              
                  -c, --color           Force color output (useful with 'less -r')
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