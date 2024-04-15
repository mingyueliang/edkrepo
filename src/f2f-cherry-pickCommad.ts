import * as vscode from 'vscode';
import { PythonScriptPath, logger, runPythonScript } from './common';


module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.cherry-pick', (uri: vscode.Uri) => {
        let command = ['f2f-cherry-pick', uri.fsPath];
        vscode.window.showInputBox(
            {
                password:false,
                ignoreFocusOut:true,
                placeHolder: 'Press Enter to confirm input or Escape cancel',
                prompt: `
                usage: edkrepo f2f-cherry-pick [-h] [--template TEMPLATE] [--folders FOLDERS [FOLDERS ...]] [--continue] [--abort] [--list-templates] [-x] [--squash] [--performance] [-v] [-c] [commit-ish]                       
                                                                                                                                                                                                                   
                Cherry pick changes between different folders.                                                                                                                                                                     
                                                                                                                                                                                                                                   
                positional arguments:                                                                                                                                                                                              
                  commit-ish            The commit or range of commits to be cherry picked, specified using the same syntax as git rev-parse/rev-list.                                                                             
                                                                                                                                                                                                                                   
                optional arguments:                                                                                                                                                                                                
                  -h, --help            show this help message and exit                                                                                                                                                            
                  --template TEMPLATE   The source and destination name seperated by a colon (:). Names are taken from templates pre-defined in the manifest file. Example: CNL:ICL might merge CannonLakeSiliconPkg->IceLakeSilico
                nPkg + CannonLakePlatSamplePkg->IceLakePlatSamplePkg. This can also be done in reverse (ICL:CNL).                                                                                                                  
                  --folders FOLDERS [FOLDERS ...]                                                                                                                                                                                  
                                        A list of source and destination folders seperated by a colon (:). Only needed if a pre-defined template is not in the manifest file. Example: CannonLakeSiliconPkg:IceLakeSiliconPkg      
                  --continue            Continue processing a Cherry Pick after resolving a merge conflict                                                                                                                         
                  --abort               Abort processing a Cherry Pick after encountering a merge conflict                                                                                                                         
                  --list-templates      Print a list of templates defined in the manifest file, and the mappings they define.                                                                                                      
                  -x, --append-sha      Append a line that says "(cherry picked from commit ...)" to the original commit message in order to indicate which commit this change was cherry-picked from.                             
                  --squash              If given a range of commits, automatically squash them during the Cherry Pick                                                                                                              
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