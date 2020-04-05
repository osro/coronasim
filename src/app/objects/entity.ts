import { GameObjects, Scene, Physics } from "phaser";

export class Entity extends GameObjects.Sprite {
  // status
  public static STATUS_HEALTHY = "healthy";
  public static STATUS_SICK = "sick";
  public static STATUS_INFECTED = "infected";
  public static STATUS_RECOVERED = "recovered";
  public static STATUS_DEAD = "dead";

  // colors
  public static COLOR_HEALTHY = 0xffffff; // no tint
  public static COLOR_SICK = 0xdd0000;
  public static COLOR_INFECTED = 0xdd95dd;
  public static COLOR_RECOVERED = 0x00dd00;
  public static COLOR_DEAD = 0x000000;

  private currentScene: Scene;
  private status: string = Entity.STATUS_HEALTHY;
  private acradeBody: Physics.Arcade.Body;
  private timeSick: number;
  private timeInfected: number;

  private incubationTime: number;
  private healingTime: number;
  private deathProbability: number;

  constructor(config) {
    super(config.scene, config.x, config.y, "sms_soldier_walk_south");

    this.currentScene = config.scene;
    this.initSprite();
    this.currentScene.add.existing(this);

    this.timeSick = this.timeInfected = 0;

    if (config.status) {
      this.setStatus(config.status);
    }

    if (config.healingTime) {
      this.healingTime = config.healingTime;
    }

    if (config.incubationTime) {
      this.incubationTime = config.incubationTime;
    }

    if (config.deathProbability) {
      this.deathProbability = config.deathProbability;
    }
  }

  public update(): void {
    this.handleAnimations();
    this.handleTimers();
    this.handleTint();
  }

  public getStatus(): string {
    return this.status;
  }

  public setStatus(value: string) {
    this.status = value;
  }

  private initSprite() {
    this.status = "healthy";

    // sprite
    this.setFlipX(false);

    // physics
    this.currentScene.physics.world.enable(this);
    this.acradeBody = this.body as Physics.Arcade.Body;
    this.acradeBody.setSize(8, 8);
    this.acradeBody.setOffset(4, 16);
    this.acradeBody.setVelocity(
      this.getRandomInt(-40, 40),
      this.getRandomInt(-40, 40)
    );
    this.acradeBody.collideWorldBounds = true;
    this.acradeBody.bounce.set(1);
  }

  private handleAnimations(): void {
    if (this.acradeBody.velocity.x > this.acradeBody.velocity.y) {
      this.anims.play("sms_soldier_walk_east", true);
      this.acradeBody.velocity.x < 0
        ? this.setFlipX(true)
        : this.setFlipX(false);
    } else {
      this.acradeBody.velocity.y < 0
        ? this.anims.play("sms_soldier_walk_north", true)
        : this.anims.play("sms_soldier_walk_south", true);
    }
  }

  private handleTimers(): void {
    // update time being sick
    if (this.status == Entity.STATUS_SICK) {
      this.timeSick += 1;
    }

    // update time being infected
    if (this.status == Entity.STATUS_INFECTED) {
      this.timeInfected += 1;
    }

    // check if incubation time has been passed
    if (
      this.timeInfected >= this.incubationTime &&
      this.status == Entity.STATUS_INFECTED
    ) {
      this.status = Entity.STATUS_SICK;
    }

    // check if time being has passed the healing time
    if (this.timeSick >= this.healingTime && this.status == Entity.STATUS_SICK) {
        // recover or kill the entity
        if (Math.random() * 100.0 < this.deathProbability) {
            this.status = Entity.STATUS_DEAD;            
            this.acradeBody.setVelocity(0,0);
        }
        else {
            this.status = Entity.STATUS_RECOVERED;
            this.timeSick = -1;
        }
    }
  }

  private handleTint(): void {
    switch (this.status) {
      case Entity.STATUS_HEALTHY:
        this.tint = Entity.COLOR_HEALTHY;
        break;

      case Entity.STATUS_SICK:
        this.tint = Entity.COLOR_SICK;
        break;

      case Entity.STATUS_DEAD:
        this.tint = Entity.COLOR_DEAD;
        break;

      case Entity.STATUS_INFECTED:
        this.tint = Entity.COLOR_INFECTED;
        break;

      case Entity.STATUS_RECOVERED:
        this.tint = Entity.COLOR_RECOVERED;
        break;

      default:
        this.tint = Entity.COLOR_HEALTHY;
        break;
    }
  }

  private getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
