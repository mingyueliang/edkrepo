import * as vscode from 'vscode';
import { PythonScriptPath, logger, runPythonScript } from './common';


module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.update_manifest_repo', ()=>{
        let command = ['umr', '--hard'];
        runPythonScript(PythonScriptPath, command, logger);
    }));
};