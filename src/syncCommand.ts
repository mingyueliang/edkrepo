import * as vscode from 'vscode';
import { PythonScriptPath, logger, runPythonScript } from './common';


/**
 * The sync command will download the latest changes for your currently checked-out branch combination, 
 * including submodules. No changes will be made to your local development branches, however EdkRepo will 
 * alert you if a rebase of your local branch is required following an update. In addition to fetching the 
 * latest code additionally sync will alert you to any updates to your project manifest file and allow you 
 * to update your workspace to include these changes using the -u/--update-local-manifest flag. 
 */
module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.sync', (uri: vscode.Uri) =>{
        let command = ['sync', uri.fsPath, '-u', '-o'];
        runPythonScript(PythonScriptPath, command, logger);
    }));
};