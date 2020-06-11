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

export class Ducky {
    public static makeReport(snapshotID: number, err : ReportError) : Thenable<any> {
        return axios.post("http://localhost:3000/api/reports",
        {
            project_hash: "not_ready_for_prod",
            data: err,
            snapshot_id: snapshotID,
            uuid: fs.readFileSync(path.join(os.homedir(), ".ducky")).toString(),
        });
    }

    public static makeSnapshot(document : vscode.TextDocument) : Thenable<number | void | undefined>{
        return this.makeSnapshotFromPath(document.uri.fsPath);
    }

    public static makeSnapshotFromPath(filePath : string) : Thenable<number | void | undefined> {
        const form = new FormData();
    
        form.append('files[]', fs.createReadStream(filePath));

        return axios.post("http://localhost:3000/api/snapshots", form, {
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
        });
    }

    public static makeMachine() : Thenable<string> {
        return axios.post("http://localhost:3000/api/machines").then(data => {
            return new Promise<string>((acc, rej) => {
                if (data.data.ok) {
                    acc(data.data.uuid);

                    return;
                }

                rej();
            });
        });
    }
}