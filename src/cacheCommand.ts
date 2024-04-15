import * as vscode from 'vscode';
import { PythonScriptPath, logger, runPythonScript } from './common';



module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.cache', (uri: vscode.Uri) =>{
        let command = ['cache', uri.fsPath];
        vscode.window.showInputBox(
            {
                password:false,
                ignoreFocusOut:true,
                placeHolder: 'Press Enter to confirm input or Escape cancel',
                prompt: `
                usage: edkrepo cache [-h] [--enable] [--disable] [--update] [--info] [--format FORMAT] [--path PATH] [--selective] [--source-manifest-repo SOURCE_MANIFEST_REPO] [--performance] [-v] [-c] [project]

                Manages local caching support for project repos.  The goal of this feature is to improve clone performance

                positional arguments:
                project               Project or manifest/pin file to add to the cache.

                optional arguments:
                -h, --help            show this help message and exit
                --enable              Enables caching support on the system.
                --disable             Disables caching support on the system.
                --update              Update the repo cache for all cached projects. Will enable cache if currently disabled
                --info                Display the current cache information.
                --format FORMAT       Change the format that the cache information is displayed in.
                --path PATH           Path where cache will be created or "default" to restore the default path.
                --selective           Only update the cache with the objects referenced by Project or the current workspace manifest
                --source-manifest-repo SOURCE_MANIFEST_REPO
                                        The name of the workspace's source global manifest repository
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