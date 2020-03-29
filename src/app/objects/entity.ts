import { GameObjects, Scene, Physics } from "phaser";

export class Entity extends GameObjects.Sprite {
  private currentScene: Scene;
  private acceleration: number = 0.5;
  private status: string;
  private acradeBody: Physics.Arcade.Body;

  constructor(config) {
    super(config.scene, config.x, config.y, "sms_soldier_walk_south");

    this.currentScene = config.scene;
    this.initSprite();
    this.currentScene.add.existing(this);
  }

  update(): void {
    this.handleAnimations();
  }

  private initSprite() {
    console.log("Entity :: initSprite");
    this.status = "healthy";

    // sprite
    this.setFlipX(false);

    // physics
    this.currentScene.physics.world.enable(this);

    this.acradeBody = this.body as Physics.Arcade.Body;
    this.acradeBody.setSize(8, 8);
    this.acradeBody.setOffset(4, 16);
    this.acradeBody.setVelocity(
      10 + Math.random() * 40,
      10 + Math.random() * 40
    );
    this.acradeBody.collideWorldBounds = true;
    this.acradeBody.bounce.set(1);
  }

  private handleAnimations(): void {

    if (this.acradeBody.velocity.x > this.acradeBody.velocity.y) {
      this.anims.play("sms_soldier_walk_east", true);
      this.acradeBody.velocity.x < 0 ? this.setFlipX(true) : this.setFlipX(false);      
    } else {
      this.acradeBody.velocity.y < 0 ? this.anims.play("sms_soldier_walk_north", true) : this.anims.play("sms_soldier_walk_south", true);
    }
  }
}
