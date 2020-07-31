import * as vscode from 'vscode';
import * as express from 'express';
import * as ws from 'ws';
import * as serveStatic from 'serve-static';

import * as path from 'path';
import * as fs from 'fs';
import { Ducky, Consent } from './ducky';
import { Server, maxHeaderSize } from 'http';

export default class Live {
    public static portOffset = 0;
    public static instances : Record<string, Live> = {};

    public static start(workspace: string) : Live {
        console.log("making new Live instance");

        this.instances[workspace] = new Live(workspace);

        this.portOffset += 1;

        return this.instances[workspace];
    }

    public static kill(workspace: string) : void {
        if (this.instances[workspace] === undefined) {
            console.log("can't kill a workspace that doesn't exist");

            return;
        }

        let instance = this.instances[workspace];

        instance.wss.close();
        instance.server.close();

        delete this.instances[workspace];

        this.portOffset -= 1;
    }

    public static triggerReload(workspace: string) : void {
        if (this.instances[workspace] === undefined) {
            return;
        }

        console.log("triggering reload");

        let instance = this.instances[workspace];

        instance.wss.clients.forEach(e => {
            e.send('reload');
        })
    }

    public port : number = 0;

    private app : express.Express;
    private wss : ws.Server;
    private server : Server;

    private staticHandler : express.Handler;

    constructor(p : string) {
        this.port = vscode.workspace.getConfiguration("ducky").port  + Live.portOffset;
        this.app = express();
        this.staticHandler = serveStatic(p);

        this.app.get("/.well-known/error", (req, res) => {
            let selection : string | null = null;
            vscode.window.showInformationMessage(
                "You ran into some errors last time you ran your code. Want to report one?",
                "Report: " + req.query["message"]
            ).then(s => {
                selection = s!;

                return Ducky.makeSnapshotFromPath(path.join(p, "sketch.js"));
            }).then(id => {
                return Ducky.makeReport(<number>id, { message: selection! });
            }).then(() => {
                vscode.window.showInformationMessage("Your error report has been logged. Thank you!");
            });

            res.end();
        });

        this.app.get("/.well-known/ducky.js", (req, res) => {
            res.set('Content-Type', 'text/javascript');
            res.write(`
const wss = new WebSocket('ws://' + location.host);

wss.onmessage = e => {
    if (e.data !== 'reload') {
        return;
    }

    console.log('reloading');

    window.location.reload();
}  

console.log("successfully injected ducky code");
window.addEventListener('error', function (e) {
    console.log("making error");
    console.log(e);
    let msg = encodeURIComponent(e.message);
    console.log(msg);
    fetch("/.well-known/error?message=" + msg)
})`);
            res.end();
        });

        this.app.use((req, res, next) => {
            if (Ducky.getConsentStatus() !== Consent.Yes) {
                next();

                return;
            }

            if (req.path === "/" || req.path === "/index.html") {
                let contents = fs.readFileSync(path.join(p, "index.html")).toString();

                contents = contents.replace("<head>", "<head><script src='/.well-known/ducky.js'></script>");

                res.write(contents);
                res.end();

                return;
            }

            next();
        });

        this.app.use(this.staticHandler);

        this.server = this.app.listen(this.port);

        this.wss = new ws.Server({
            server: this.server,
        });
    }
}