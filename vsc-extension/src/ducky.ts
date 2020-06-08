import * as vscode from 'vscode';

import * as FormData from 'form-data'; 
import * as fs from 'fs';

import axios from 'axios';

export interface ReportError {
	expected: string | undefined;
	got: string | undefined;
};

export class Ducky {
    public static makeReport(snapshotID: number, err : ReportError) : Thenable<any> {
        return axios.post("http://localhost:3000/reports",
        {
            project_hash: "not_ready_for_prod",
            data: err,
            snapshot_id: snapshotID,
        })
    }

    public static makeSnapshot(document : vscode.TextDocument) : Thenable<number | void | undefined>{
        const form = new FormData();
    
        form.append('files[]', fs.createReadStream(document.uri.fsPath));
    
        return axios.post("http://localhost:3000/snapshots", form, {
            headers: {
            ...form.getHeaders()
            }
        })
        .then(data => {
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
}