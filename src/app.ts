import { Application, Graphics } from "pixi.js";
import { Entity } from "@app/entity.class";

const entityAmount:number = 500;    

class CoronaSimApp {
    private app: Application;
    private entities:Entity[];
    constructor() {
       // Create the application
        this.app = new Application({
            width: 800,
            height: 800,
            backgroundColor: 0xF1F1F1,
            sharedLoader: true,
        })

        // Add the view to the DOM
        document.body.appendChild(this.app.view);

        const graphics = new Graphics;
        const loader = this.app.loader;

        // Queue spritesheet
        loader.add('human', 'assets/spritesheet.json');

        // Load resources
        loader.load(() => {            
            this.entities = [];
    
            for(let i = 0; i < entityAmount - 1; i++) {
                this.entities.push(new Entity(this.app.stage, this.app.screen, this.entities));
            }
    
            // push one sick entity
            this.entities.push(new Entity(this.app.stage, this.app.screen, this.entities, 'sick'));
                    
            this.app.ticker.add(() => {
                graphics.clear();
                this.entities.forEach(entity => {
                    entity.update();
                });
              });
        });


    }
}

new CoronaSimApp();