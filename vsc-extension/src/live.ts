import * as vscode from 'vscode';
import * as express from 'express';
import * as serveStatic from 'serve-static';

import * as path from 'path';
import * as fs from 'fs';

export default class Live {
    public static instances : Record<string, Live> = {};

    public static get(workspace: string) : Live {
        if (this.instances[workspace] === undefined) {
            console.log("making new Live instance");

            this.instances[workspace] = new Live(workspace);

            return this.instances[workspace];
        }
        
        console.log("using existing live instance")

        return this.instances[workspace];
    }

    public port : number = 0;

    private app : express.Express;

    private staticHandler : express.Handler;

    constructor(p : string) {
        this.port = 1720;
        this.app = express();
        this.staticHandler = serveStatic(p);

        this.app.get("/.well-known/error", (req, res) => {
            console.log(req.params);

            vscode.window.showInformationMessage(
                "You ran into some errors last time you ran your code. Want to report one?",
                "Report: " + req.query["message"],
            ).then(selection => {
            });

            res.end();
        })

        this.app.get("/.well-known/ducky.js", (req, res) => {
            res.set('Content-Type', 'text/javascript');
            res.write(`
console.log("successfully injected ducky code");
window.addEventListener('error', function (e) {
    console.log("making error");
    console.log(e);
    let msg = encodeURIComponent(e.message);
    console.log(msg);
    fetch("/.well-known/error?message=" + msg)
})`);
            res.end();
        })

        this.app.use((req, res, next) => {
            if (req.path == "/" || req.path == "/index.html") {
                let contents = fs.readFileSync(path.join(p, "index.html")).toString();

                contents = contents.replace("<head>", "<head><script src='/.well-known/ducky.js'></script>");

                res.write(contents);
                res.end();

                return;
            }

            next();
        });

        this.app.use(this.staticHandler);

        this.app.listen(this.port);
    }
}