import { Scene, GameObjects, Physics } from "phaser";
import { Entity } from "@app/objects/entity";

export class MainScene extends Scene {
  private entities: GameObjects.Group;

  constructor() {
    console.log("MainScene :: constructor");
    super({
      key: "MainScene"
    });
  }

  create(): void {
    console.log("MainScene :: create");

    this.entities = this.add.group({
      runChildUpdate: true
    });

    for (let i = 0; i < 100; i++) {
      this.entities.add(
        new Entity({
          scene: this,
          x: Math.floor((Math.random() * 500) + 1),
          y: Math.floor((Math.random() * 500) + 1),
          key: "sms_soldier"
        })
      );
    }

    this.physics.add.group(this.entities);
    this.physics.add.collider(this.entities, this.entities);        
  }
}
