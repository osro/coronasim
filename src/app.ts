import { Application, Graphics } from "pixi.js";
import { Entity } from "@app/entity.class";

class CoronaSimApp {
    private app: Application;
    private entities:Entity[];
    constructor() {
       // Create the application
        this.app = new Application({
            width: 1500,
            height: 900,
            backgroundColor: 0xF1F1F1
        })

        // Add the view to the DOM
        document.body.appendChild(this.app.view);

        const graphics = new Graphics;
        const entityAmount:number = 1000;

        this.app.stage.addChild(graphics);

        this.entities = [];

        for(let i = 0; i < entityAmount - 1; i++) {
            this.entities.push(new Entity(graphics, this.app.screen, this.entities));
        }

        // push one sick entity
        this.entities.push(new Entity(graphics, this.app.screen, this.entities, 'sick'));
                
        this.app.ticker.add(() => {
            graphics.clear();
            this.entities.forEach(entity => {
                entity.update();
                entity.draw();
            });
          });
    }
}

new CoronaSimApp();