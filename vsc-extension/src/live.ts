import * as express from 'express';
import * as serveStatic from 'serve-static';

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

    constructor(path : string) {
        this.app = express();
        this.staticHandler = serveStatic(path);

        this.app.get("/error", (req, res) => {
            console.log(req);  
        })

        this.app.use((req, res, next) => {
            if (req.path == "/") {
                // TODO(harrison): inject code here
                console.log("going for HTML, inject some functionality here!");
            }

            next();
        });

        this.app.use(this.staticHandler);

        this.app.listen(8888);
    }
}