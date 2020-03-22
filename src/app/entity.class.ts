import { Graphics, Point, Rectangle } from "pixi.js";

const healthy_color = 0x0095DD;
const sick_color = 0xDD0000;
const infected_color = 0xDD95DD;
const recovered_color = 0x00DD00;
const dead_color = 0x000000;

const STATUS_HEALTHY = 'healthy';
const STATUS_SICK = 'sick';
const STATUS_INFECTED = 'infected';
const STATUS_RECOVERED = 'recovered';
const STATUS_DEAD = 'dead';

const contractionProbability = 75.0;
const incubationTime = 500;
const healingTime = 2500;
const deathProbability = 3.5;

export class Entity {
    private location: Point;
    private acceleration: Point;
    private radius: number;
    private timeInfected: number;
    private timeSick: number;
    // private isolated: boolean;
    private color: number;
    private graphics: Graphics;
    private screen: Rectangle;
    private status: string;
    private entityPool: Entity[];

    constructor(graphics: Graphics, screen: Rectangle, entityPool: Entity[], status: string = 'healthy') { 
        this.graphics = graphics;
        this.screen = screen;
        this.radius = 5;
        this.timeInfected = 0;
        this.timeSick = 0;
        // this.isolated = false;
        this.setStatus(status);
        this.location = new Point(Math.random() * (this.screen.width - this.radius + 1) + this.radius, Math.random() * (this.screen.height - this.radius + 1) + this.radius);
        this.acceleration = new Point(1.0 * (Math.random() - 0.5), 1.0 * (Math.random() - 0.5));
        this.entityPool = entityPool;
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
        if (this.timeInfected >= incubationTime && this.status == STATUS_INFECTED) {
            this.status = STATUS_SICK;
        }

        // check if time being has passed the healing time
        if (this.timeSick >= healingTime && this.status == STATUS_SICK) {
            // recover or kill the entity
            if (Math.random() * 100.0 < deathProbability) {
                this.status = STATUS_DEAD;
                this.acceleration.set(0, 0);
            }
            else {
                this.status = STATUS_RECOVERED;
                this.timeSick = -1;
            }
        }

        // update color
        switch (this.status) {
            case STATUS_HEALTHY:
                this.color = healthy_color;
                break;

            case STATUS_SICK:
                this.color = sick_color;
                break;

            case STATUS_DEAD:
                this.color = dead_color;
                break;

            case STATUS_INFECTED:
                this.color = infected_color;
                break;

            case STATUS_RECOVERED:
                this.color = recovered_color;
                break;

            default:
                this.color = healthy_color;
                break;
        }

        this.checkCollisions();
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

    public draw() {
        this.graphics.lineStyle(0);

        this.graphics.beginFill(this.color, 1);
        this.graphics.drawCircle(this.location.x - this.radius / 2, this.location.y - this.radius / 2, this.radius);
        this.graphics.endFill();
    }

    public getStatus() {
        return this.status;
    }

    public setStatus(status: string) {
        this.status = status;
    };

    public getLocation() {
        return this.location;
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
            if (this.status == STATUS_INFECTED && entity.getStatus() == STATUS_HEALTHY && 100 * Math.random() <= contractionProbability) {
                entity.setStatus(STATUS_INFECTED);
            } else if (entity.getStatus() == STATUS_SICK && this.getStatus() == STATUS_HEALTHY && 100 * Math.random() <= contractionProbability) {
                this.setStatus(STATUS_INFECTED);
            }
            /*
                        //velocities
                        if (!b1.isolated && !b2.isolated) {
                            var temp_dx = b1.dx;
                            b1.dx = b2.dx;
                            b2.dx = temp_dx;
                            var temp_dy = b1.dy;
                            b1.dy = b2.dy;
                            b2.dy = temp_dy;
                        }
                        else if (b1.isolated) {  // this should be computed...                
                            computeVelocity(b1, b2);
                        }
                        else if (b2.isolated) {  // this should be computed...                                  
                            computeVelocity(b2, b1);
            
                        }
                        */
        }
    }
}