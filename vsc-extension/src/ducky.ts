import * as vscode from 'vscode';

import * as FormData from 'form-data'; 
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

import axios from 'axios';

export interface ReportError {
	expected?: string;
    got?: string;
    message?: string;
}

export enum Consent {
    None,
    No,
    Yes
}

export class Ducky {
    public static uuid? : string;

    public static consentPath() : string {
        return path.join(os.homedir(), ".ducky");
    }

    public static denyConsent() {
        fs.writeFileSync(this.consentPath(), "");
    }

    public static getConsentStatus() : Consent {
        if (fs.existsSync(this.consentPath())) {
            this.uuid = fs.readFileSync(this.consentPath()).toString();

            if (this.uuid!.length > 0) {
                return Consent.Yes;
            }

            return Consent.No;
        }

        return Consent.None;
    }

    public static makeReport(snapshotID: number, err : ReportError) : Thenable<any> {
        return axios.post(vscode.workspace.getConfiguration("ducky").apiHost + "/api/reports",
        {
            data: err,
            snapshot_id: snapshotID,
        }).catch(err => {
            vscode.window.showErrorMessage("Wasn't able to submit error report. " + err);
        });
    }

    public static makeSnapshot(document : vscode.TextDocument) : Thenable<number | void | undefined>{
        return this.makeSnapshotFromPath(document.uri.fsPath);
    }

    public static makeSnapshotFromPath(filePath : string) : Thenable<number | void | undefined> {
        const form = new FormData();
    
        form.append("uuid", this.uuid!);
        form.append("project", path.basename(path.dirname(filePath)));
        form.append('files[]', fs.createReadStream(filePath));

        return axios.post(vscode.workspace.getConfiguration("ducky").apiHost + "/api/snapshots", form, {
            headers: {
            ...form.getHeaders()
            }
        })
        .then(data => {
            return new Promise<number | void | undefined>(
                (acc, rej) => {
                    if (!data.data.ok) {
                        rej();
    
                        return;
                    }
    
                    acc(data.data.id);
                });
        })
        .catch(err => {
            vscode.window.showErrorMessage("Couldn't submit snapshot. " + err);
        });
    }

    public static makeMachine() : Promise<string | void> {
        return axios.post(vscode.workspace.getConfiguration("ducky").apiHost + "/api/machines").then(data => {
            return new Promise<string>((acc, rej) => {
                if (data.data.ok) {
                    this.uuid = data.data.uuid;

                    fs.writeFileSync(this.consentPath(), data.data.uuid);

                    acc(data.data.uuid);

                    return;
                }

                rej();
            });
        }).catch(err => {
            vscode.window.showErrorMessage("Something has gone wrong setting issuing this machine a unique identifier. " + err);
        });
    }
}