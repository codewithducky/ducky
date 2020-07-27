// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';

import Live from './live';
import { Ducky, ReportError, Consent } from './ducky';

let statusBarItem : vscode.StatusBarItem;

function requestConsent() {
	vscode.window.showErrorMessage("In order to report errors you need to consent to use Ducky. Would you like to?", "Show me the way!").then(() => {
		vscode.commands.executeCommand("ducky.consent");
	});
}

let goLiveStatusBarItem: vscode.StatusBarItem;

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
				case 'yes': {
					Ducky.makeMachine(message.email).then(uuid => {
						if (uuid === undefined) {
							return;
						}

						vscode.window.showInformationMessage("You've consented. Time to start collecting errors!");
					});

					break;
				}
				case 'no': {
					Ducky.denyConsent();

					vscode.window.showInformationMessage("You've opted to not consent to Ducky, that's cool -- we won't collect any data from you.");

					break;
				}
			}

			panel.dispose();
		},
		undefined,
		context.subscriptions);
	});

	context.subscriptions.push(consentCommand);

	let goLiveCommand = vscode.commands.registerTextEditorCommand("ducky.goLive", (editor : vscode.TextEditor) => {
		let path = vscode.workspace.getWorkspaceFolder(editor.document.uri)!.uri.fsPath;

		let live = Live.instances[path];
		if (live === undefined) {
			live = Live.start(path);

			goLiveStatusBarItemKill(live.port);

			vscode.window.showInformationMessage("Started the live server! View it by going to http://localhost:" + live.port);

			vscode.env.openExternal(vscode.Uri.parse("http://localhost:" + live.port));

			return;
		}

		Live.kill(path);

		goLiveStatusBarItemLive();

		vscode.window.showInformationMessage("Stopped live server!");
	});

	context.subscriptions.push(goLiveCommand);

	let snapshotCommand = vscode.commands.registerTextEditorCommand('ducky.snapshot', (editor: vscode.TextEditor) => {
		if (Ducky.getConsentStatus() !== Consent.Yes) {
			requestConsent();

			return;
		}

		if (path.basename(editor.document.fileName) !== "sketch.js") {
			vscode.window.showErrorMessage("You can only Snapshot sketch.js files!" + editor.document.fileName);
	
			return;
		}

		Ducky.makeSnapshot(editor.document);

		vscode.window.showInformationMessage('Successfully lodged a snapshot!');
	});

	context.subscriptions.push(snapshotCommand);

	let reportCommand = vscode.commands.registerTextEditorCommand("ducky.report", (editor : vscode.TextEditor) => {
		if (Ducky.getConsentStatus() !== Consent.Yes) {
			requestConsent();

			return;
		}

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
				if (resp === undefined) {
					return;
				}

				console.log("report resp", resp);

				vscode.window.showInformationMessage("Successfully lodged an error report! Thank you :)");
			});
	});

	context.subscriptions.push(reportCommand);

	if (Ducky.getConsentStatus() === Consent.None) {
		vscode.commands.executeCommand("ducky.consent");
	}

	// create a new status bar item that we can now manage
	goLiveStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

	goLiveStatusBarItem.show();
	goLiveStatusBarItemLive();

	context.subscriptions.push(goLiveStatusBarItem);

}

// this method is called when your extension is deactivated
export function deactivate() {}

function goLiveStatusBarItemLive() {
	goLiveStatusBarItem.command = 'ducky.goLive';
	goLiveStatusBarItem.text = "$(broadcast) Go live (with Ducky)!";
}

function goLiveStatusBarItemKill(port: number) {
	goLiveStatusBarItem.text = "$(stop) Serving at http://localhost:" + port;
	goLiveStatusBarItem.command = 'ducky.goLive';
}