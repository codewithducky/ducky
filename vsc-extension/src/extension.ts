// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as FormData from 'form-data'; 
import * as fs from 'fs';
import * as http from 'http';

import axios from 'axios';

import * as path from 'path';

import Live from './live';
import { promisify } from 'util';

interface ReportError {
	expected: string | undefined;
	got: string | undefined;
};

let statusBarItem : vscode.StatusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let goLiveCommand = vscode.commands.registerTextEditorCommand("ducky.goLive", (editor : vscode.TextEditor) => {
		let path = vscode.workspace.getWorkspaceFolder(editor.document.uri)!.uri.fsPath;

		Live.get(path);
	});

	context.subscriptions.push(goLiveCommand);

	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.text = "Go live!";
	statusBarItem.command = 'ducky.goLive';

	context.subscriptions.push(statusBarItem);

	let snapshotCommand = vscode.commands.registerTextEditorCommand('ducky.snapshot', (editor: vscode.TextEditor) => {
		if (editor.document.fileName != "sketch.js") {
			vscode.window.showErrorMessage("You can only Snapshot sketch.js files!");
	
			return;
		}

		snapshot(editor.document)

		vscode.window.showInformationMessage('Successfully lodged a snapshot!');
	});

	context.subscriptions.push(snapshotCommand);

	let reportCommand = vscode.commands.registerTextEditorCommand("ducky.report", (editor : vscode.TextEditor) => {
		if (path.basename(editor.document.fileName) != "sketch.js") {
			vscode.window.showErrorMessage("You can only Snapshot sketch.js files!");
	
			return;
		}

		let obj : ReportError = {expected: "", got: ""};

		vscode.window.showInputBox({prompt: "What are you expecting to happen?"})
			.then(out => {
				obj.expected = out;

				return vscode.window.showInputBox({prompt: "What does happen?"})
			})
			.then(out => {
				obj.got = out;

				return snapshot(editor.document);
			}).then(id => {
				return report(<number>id, obj);
			})
			.then(resp => {
				console.log("report resp", resp);

				vscode.window.showInformationMessage("Successfully lodged an error report! Thank you :)");
			})
	})

	context.subscriptions.push(reportCommand);
}

function report(snapshotID: number, err : ReportError) : Thenable<any> {
	return axios.post("http://localhost:3000/reports",
	{
		project_hash: "not_ready_for_prod",
		data: err,
		snapshot_id: snapshotID,
	})
}

function snapshot(document : vscode.TextDocument) : Thenable<number | void | undefined>{
	let workspace = vscode.workspace.getWorkspaceFolder(document.uri);

	const form = new FormData();

	form.append('files[]', fs.createReadStream(document.uri.fsPath));

	return axios.post("http://localhost:3000/snapshots", form, {
		headers: {
		...form.getHeaders()
		}
	})
	.then(data => {
		console.log("then", data);

		return new Promise<number | void | undefined>(
			(acc, rej) => {
				if (!data.data.ok) {
					rej(data.data);

					return;
				}

				acc(data.data.id)
			});
	})
}

// this method is called when your extension is deactivated
export function deactivate() {}