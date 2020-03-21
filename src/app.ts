import { Application } from "pixi.js";

class CoronaSimApp {
    private app: Application;
    constructor() {
        // initialize app
        this.app = new Application({
            width: 800,
            height: 800,
            backgroundColor: 0x1099bb // light blue
        })

        // create view in DOM
        document.body.appendChild(this.app.view);
    }
}

new CoronaSimApp();