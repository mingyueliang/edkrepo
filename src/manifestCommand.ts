import * as vscode from 'vscode';
import { PythonScriptPath, logger, runPythonScript } from './common';


/**
 * Provides a list of available projects in the manifest repository.  It will additionally do validation of the manifest files.
 */
module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.manifest', (uri: vscode.Uri) => {
        let command = ['manifest'];
        runPythonScript(PythonScriptPath, command, logger);
    }));
};