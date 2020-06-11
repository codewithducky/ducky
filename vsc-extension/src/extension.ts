// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

import Live from './live';
import { Ducky, ReportError } from './ducky';

let statusBarItem : vscode.StatusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let consentCommand = vscode.commands.registerCommand('ducky.consent', () => {
		const panel = vscode.window.createWebviewPanel(
			'duckyConsent', // Identifies the type of the webview. Used internally
			'Consent to Ducky', // Title of the panel displayed to the user
			vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
			{
				enableScripts: true,
			}
		  );

		const filePath: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, 'consent.html'));
		panel.webview.html = fs.readFileSync(filePath.fsPath, 'utf8');

		panel.webview.onDidReceiveMessage(message => {
			switch (message.command) {
				case 'consent':
					let uuid = Ducky.makeMachine().then(uuid => {
						vscode.window.showInformationMessage("You've consented! Start collecting errors. UUID: " + uuid);

						fs.writeFileSync(path.join(os.homedir(), ".ducky"), uuid);
					});

					break;
			}
		},
		undefined,
		context.subscriptions);
	});

	context.subscriptions.push(consentCommand);

	let goLiveCommand = vscode.commands.registerTextEditorCommand("ducky.goLive", (editor : vscode.TextEditor) => {
		let path = vscode.workspace.getWorkspaceFolder(editor.document.uri)!.uri.fsPath;

		let live = Live.get(path);

		vscode.window.showInformationMessage("Server is now live at localhost:" + live.port);
	});

	context.subscriptions.push(goLiveCommand);

	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.text = "Go live!";
	statusBarItem.command = 'ducky.goLive';

	context.subscriptions.push(statusBarItem);

	let snapshotCommand = vscode.commands.registerTextEditorCommand('ducky.snapshot', (editor: vscode.TextEditor) => {
		if (path.basename(editor.document.fileName) !== "sketch.js") {
			vscode.window.showErrorMessage("You can only Snapshot sketch.js files!" + editor.document.fileName);
	
			return;
		}

		Ducky.makeSnapshot(editor.document);

		vscode.window.showInformationMessage('Successfully lodged a snapshot!');
	});

	context.subscriptions.push(snapshotCommand);

	let reportCommand = vscode.commands.registerTextEditorCommand("ducky.report", (editor : vscode.TextEditor) => {
		if (path.basename(editor.document.fileName) !== "sketch.js") {
			vscode.window.showErrorMessage("You can only Snapshot sketch.js files!" + editor.document.fileName);
	
			return;
		}

		let obj : ReportError = {expected: "", got: ""};

		vscode.window.showInputBox({prompt: "What are you expecting to happen?"})
			.then(out => {
				obj.expected = out;

				return vscode.window.showInputBox({prompt: "What does happen?"});
			})
			.then(out => {
				obj.got = out;

				return Ducky.makeSnapshot(editor.document);
			}).then(id => {
				return Ducky.makeReport(<number>id, obj);
			})
			.then(resp => {
				console.log("report resp", resp);

				vscode.window.showInformationMessage("Successfully lodged an error report! Thank you :)");
			});
	});

	context.subscriptions.push(reportCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}