// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	require('./manifestCommand')(context);
	require('./statusCommand')(context);
	require('./cloneCommand')(context);
	require('./comboCommand')(context);
	require('./cleanCommand')(context);
	require('./resetCommand')(context);
	require('./maintenanceCommand')(context);
	require('./logCommand')(context);
	require('./sparseCommand')(context);
	require('./checkoutCommand')(context);
	require('./listpinsCommand')(context);
	require('./selfcheckCommand')(context);
	require('./syncCommand')(context);
	require('./UpdateManifestRepoCommand')(context);
	require('./squashCommand')(context);
	require('./cacheCommand')(context);
	require('./checkoutPinCommand')(context);
	require('./createPinCommand')(context);
	require('./f2f-cherry-pickCommad')(context);
	require('./list-reposCommand')(context);
	require('./manifestReposCommand')(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
