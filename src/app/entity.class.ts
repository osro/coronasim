import { Point, Rectangle, Sprite, Container, Texture } from "pixi.js";


const healthy_color = 0xFFFFFF; // no tint
const sick_color = 0xDD0000;
const infected_color = 0xDD95DD;
const recovered_color = 0x00DD00;
// const dead_color = 0x000000;

const STATUS_HEALTHY = 'healthy';
const STATUS_SICK = 'sick';
const STATUS_INFECTED = 'infected';
const STATUS_RECOVERED = 'recovered';
const STATUS_DEAD = 'dead';

export class Entity {
    private location: Point;
    private acceleration: Point;
    private radius: number;
    private timeInfected: number;
    private timeSick: number;
    // private isolated: boolean;
    // private color: number;
    private screen: Rectangle;
    private status: string;
    private entityPool: Entity[];
    private sprite: Sprite;
    private stage: Container;

    private textureHealthy: Texture;
    private textureDead: Texture;

    private contractionProbability: number = 75.0;
    private incubationTime: number = 500;
    private healingTime: number = 2500;
    private deathProbability: number = 3.5;

    constructor(stage: Container, screen: Rectangle, entityPool: Entity[], status: string = 'healthy') {
        this.textureHealthy = Texture.from('tile000.png');
        this.textureDead = Texture.from('tile025.png');

        this.stage = stage;
        this.sprite = Sprite.from(this.textureHealthy);
        this.sprite.scale = new Point(0.6, 0.6);

        this.sprite.anchor.set(0.5);
        this.sprite.x = 100;
        this.sprite.y = 100;

        this.screen = screen;
        this.radius = 5;
        this.timeInfected = 0;
        this.timeSick = 0;
        // this.isolated = false;
        this.setStatus(status);
        this.location = new Point(Math.random() * (this.screen.width - this.radius + 1) + this.radius, Math.random() * (this.screen.height - this.radius + 1) + this.radius);
        this.acceleration = new Point(1.0 * (Math.random() - 0.5), 1.0 * (Math.random() - 0.5));
        this.entityPool = entityPool;
        this.stage.addChild(this.sprite);
    }

    public update() {
        // update coordinates
        this.location.x += this.acceleration.x;
        this.location.y += this.acceleration.y;

        // update time being sick
        if (this.status == STATUS_SICK) {
            this.timeSick += 1;
        }

        // update time being infected
        if (this.status == STATUS_INFECTED) {
            this.timeInfected += 1;
        }

        // check if incubation time has been passed
        if (this.timeInfected >= this.incubationTime && this.status == STATUS_INFECTED) {
            this.status = STATUS_SICK;
        }

        // check if time being has passed the healing time
        if (this.timeSick >= this.healingTime && this.status == STATUS_SICK) {
            // recover or kill the entity
            if (Math.random() * 100.0 < this.deathProbability) {
                this.status = STATUS_DEAD;
                this.acceleration.set(0, 0);
                this.sprite.zIndex = -666;
            }
            else {
                this.status = STATUS_RECOVERED;
                this.timeSick = -1;
            }
        }

        // update color

        switch (this.status) {
            case STATUS_HEALTHY:
                this.sprite.tint = healthy_color;
                break;

            case STATUS_SICK:
                this.sprite.tint = sick_color;
                break;

            case STATUS_DEAD:
                this.sprite.tint = healthy_color;
                this.sprite.texture = this.textureDead;
                break;

            case STATUS_INFECTED:
                this.sprite.tint = infected_color;
                break;

            case STATUS_RECOVERED:
                this.sprite.tint = recovered_color;
                break;

            default:
                this.sprite.tint = healthy_color;
                break;
        }


        this.checkCollisions();

        this.sprite.x = this.location.x;
        this.sprite.y = this.location.y;
    }

    public checkCollisions() {
        // screen edges
        if (this.location.x < 0 || this.location.x > (this.screen.width)) {
            this.acceleration.x = -this.acceleration.x;
        }

        if (this.location.y < 0 || this.location.y > (this.screen.height)) {
            this.acceleration.y = -this.acceleration.y;
        }

        // other entities
        this.entityPool.forEach(entity => {
            this.collision(entity);
        });
    }

    public getStatus() {
        return this.status;
    }

    public setStatus(status: string) {
        this.status = status;
    };

    public setIncubationTime(value: number) {
        this.incubationTime = value;
    }

    public setHealingTime(value: number) {
        this.healingTime = value;
    }

    public setDeathProbability(value: number) {
        this.deathProbability = value;
    }

    public setContractionProbability(value: number) {
        this.contractionProbability = value;
    }

    public getLocation() {
        return this.location;
    }

    public destroy() {
        this.stage.removeChild(this.sprite);
    }

    private collision(entity: Entity) {
        if (this.getStatus() == STATUS_DEAD || entity.getStatus() == STATUS_DEAD) {
            return;
        }

        let entityLocation: Point = entity.getLocation();

        if (this.location.x - entityLocation.x > 2 * this.radius)
            return;

        if (this.location.y - entityLocation.y > 2 * this.radius)
            return;

        if (entityLocation.x - this.location.x > 2 * this.radius)
            return;

        if (entityLocation.y - this.location.y > 2 * this.radius)
            return;

        var dist_squared = (this.location.x - entityLocation.x) * (this.location.x - entityLocation.x) + (this.location.y - entityLocation.y) * (this.location.y - entityLocation.y);

        if (dist_squared < 4 * (this.radius) * (this.radius)) {
            if (this.status == STATUS_INFECTED && entity.getStatus() == STATUS_HEALTHY && 100 * Math.random() <= this.contractionProbability) {
                entity.setStatus(STATUS_INFECTED);
            } else if (entity.getStatus() == STATUS_SICK && this.getStatus() == STATUS_HEALTHY && 100 * Math.random() <= this.contractionProbability) {
                this.setStatus(STATUS_INFECTED);
            }
        }
    }
}