import { Scene, GameObjects, Physics } from "phaser";
import { Entity } from "@app/objects/entity";

export class MainScene extends Scene {
  private entities: GameObjects.Group;
  private contractionProbability: number;
  private incubationTime: number;
  private healingTime: number;
  private deathProbability: number;

  constructor() {
    console.log("MainScene :: constructor");

    super({
      key: "MainScene"
    });

    this.contractionProbability = 75.0;
    this.incubationTime = 500;
    this.healingTime = 2500;
    this.deathProbability = 3.5;
  }

  create(): void {
    console.log("MainScene :: create");

    this.entities = this.add.group({
      runChildUpdate: true
    });

    for (let i = 0; i < 499; i++) {
      this.entities.add(
        new Entity({
          scene: this,
          x: Math.floor(Math.random() * this.physics.world.bounds.width + 1),
          y: Math.floor(Math.random() * this.physics.world.bounds.height + 1),
          key: "sms_soldier",
          status: Entity.STATUS_HEALTHY,
          incubationTime: this.incubationTime,
          healingTime: this.healingTime,
          deathProbability: this.deathProbability
        })
      );
    }

    // one sick
    this.entities.add(
      new Entity({
        scene: this,
        x: Math.floor(Math.random() * this.physics.world.bounds.width + 1),
        y: Math.floor(Math.random() * this.physics.world.bounds.height + 1),
        key: "sms_soldier",
        status: Entity.STATUS_SICK,
        incubationTime: this.incubationTime,
        healingTime: this.healingTime,
        deathProbability: this.deathProbability        
      })
    );

    this.physics.add.group(this.entities);
  }

  update(): void {
    this.physics.overlap(
      this.entities,
      this.entities,
      this.collisionHandler,
      null,
      this
    );
  }

  private collisionHandler(a: Entity, b: Entity) {
    let aStatus = a.getStatus();
    let bStatus = b.getStatus();

    if (aStatus == Entity.STATUS_HEALTHY && bStatus == Entity.STATUS_HEALTHY) {
      return;
      console.log("HEALTHY");
    }

    if (
      aStatus == Entity.STATUS_SICK &&
      bStatus == Entity.STATUS_HEALTHY &&
      100 * Math.random() <= this.contractionProbability
    ) {
      b.setStatus(Entity.STATUS_INFECTED);
    }

    if (
      bStatus == Entity.STATUS_SICK &&
      aStatus == Entity.STATUS_HEALTHY &&
      100 * Math.random() <= this.contractionProbability
    ) {
      a.setStatus(Entity.STATUS_INFECTED);
    }
  }
}
