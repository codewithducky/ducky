// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as FormData from 'form-data'; 
import * as fs from 'fs';

import axios from 'axios';

import * as path from 'path';
import { resolveCliPathFromVSCodeExecutablePath } from 'vscode-test';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "ducky" is now active!');

	let disposable = vscode.commands.registerTextEditorCommand('ducky.snapshot', (editor: vscode.TextEditor) => {
		if (editor.document.isUntitled) {
			vscode.window.showErrorMessage("You can't snapshot an untitled file! Save it and try again :)");

			return;
		}

		let workspace = vscode.workspace.getWorkspaceFolder(editor.document.uri);

		let p = path.relative(workspace?.uri.fsPath!, editor.document.uri.fsPath);


		const form = new FormData();
		
		form.append('files[]', fs.createReadStream(editor.document.uri.fsPath));

		const request_config = {
			headers: {
			...form.getHeaders()
			}
		};

		axios.post("http://localhost:3000/snapshots", form, request_config);

		vscode.window.showInformationMessage('Hello World!');
	});

	// console.log(vscode.window.activeTextEditor.document.uri.fsPath);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}


// const form = document.querySelector("#my_form");
// const image_upload = document.querySelector("#image_upload");
// const results = document.querySelector("#results");
// 
// form.addEventListener("submit", e => {
//   /* preventDefault, so that the page doesn't refresh */
//   e.preventDefault();
// //   /* you can fill the formData object automatically with all the data from the form */
//   const formData = new FormData(form);
// // // //   /* or you can can instantiate an empty FormData object and then fill it using append(). The three arguments to append are the key (equivalent to the name field on an input), the file itself, and an optional third argument for the filename. */
//   const formData2 = new FormData();
//   formData2.append(
    // "image_file",
    // image_upload.files[0],
    // image_upload.files[0].name
//   );
// //   /* You can iterate through the FormData object to view its data (this is equivalent to using the .entries() method.) */
//   for (const item of formData2) {
    // results.innerHTML = `
    //   <p><strong>name:</strong> ${item[0]}</p>
    //   <p><strong>filename:</strong> ${item[1].name}</p>
    //   <p><strong>size:</strong> ${item[1].size}</p>
    //   <p><strong>type:</strong> ${item[1].type}</p>
    // `;
//   }
// // //   /* once you've confirmed that the FormData object has all the proper data, send a fetch request. This particular request will go nowhere since I never defined the API_ROOT variable */
//   fetch(`${API_ROOT}/uploads`, {
    // method: "POST",
    // body: formData
//   });
// });