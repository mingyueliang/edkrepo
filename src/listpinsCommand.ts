import * as vscode from 'vscode';
import { PythonScriptPath, logger, runPythonScript } from './common';
import path from 'path';


module.exports = function(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('edkrepo.menus.listpins', (uri: vscode.Uri) => {
        let list_pins_commands = ['list-pins', `${uri.fsPath}`];
        runPythonScript(PythonScriptPath, list_pins_commands, logger);
    }));
};