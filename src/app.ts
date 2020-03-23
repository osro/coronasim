import './styles.css';
import { Application, Graphics } from "pixi.js";
import { Entity } from "@app/entity.class";

class CoronaSimApp {
    private app: Application;
    private entities: Entity[];
    private entityAmount: number = 500;
    private incubationTime: number = 500;
    private healingTime: number = 2500;
    private deathProbability: number = 3;
    private contractionProbability: number = 75;

    constructor() {
        // Create the application
        this.app = new Application({
            width: 640,
            height: 480,
            backgroundColor: 0xF1F1F1,
            sharedLoader: true,
        })

        // Add the view to the DOM
        document.getElementById('pixi-canvas').appendChild(this.app.view);;

        const graphics = new Graphics;
        const loader = this.app.loader;

        // Queue spritesheet
        loader.add('human', 'assets/spritesheet.json');

        // Load resources
        loader.load(() => {
            // defaults
            this.updateSetup({
                incubationTime: this.incubationTime,
                healingTime: this.healingTime,
                deathProbability: this.deathProbability,
                contractionProbability: this.contractionProbability
            });

            this.app.ticker.add(() => {
                graphics.clear();
                this.entities.forEach(entity => {
                    entity.update();
                });
            });
        });

        const form = document.querySelector('form')!;

        form.onsubmit = (_) => {
            const data = new FormData(form);
            this.entityAmount = parseInt(data.get('amount') as string);
            this.incubationTime = parseInt(data.get('incubationtime') as string);
            this.healingTime = parseInt(data.get('healingtime') as string);
            this.deathProbability = parseInt(data.get('deathprobability') as string);

            let options = {
                incubationTime: this.incubationTime,
                healingTime: this.healingTime,
                deathProbability: this.deathProbability,
                contractionProbability: this.contractionProbability
            }

            this.updateSetup(options);
            return false; // prevent reload
        };
    }

    updateSetup(options: any) {
        console.log(options);

        // remove old textures
        if (this.entities && this.entities.length) {
            this.entities.forEach(entity => {
                entity.destroy();
            });
        }

        // reset
        this.entities = [];

        for (let i = 0; i < this.entityAmount - 1; i++) {

            let entity = new Entity(this.app.stage, this.app.screen, this.entities);
            entity.setIncubationTime(options.incubationTime);
            entity.setHealingTime(options.healingTime);
            entity.setDeathProbability(options.deathProbability);
            entity.setContractionProbability(options.contractionProbability);
            this.entities.push(entity);
        }

        // push one sick entity
        let entity = new Entity(this.app.stage, this.app.screen, this.entities, 'sick');
        entity.setIncubationTime(options.incubationTime);
        entity.setHealingTime(options.healingTime);
        entity.setDeathProbability(options.deathProbability);
        entity.setContractionProbability(options.contractionProbability);
        this.entities.push(entity);
    }
}

new CoronaSimApp();