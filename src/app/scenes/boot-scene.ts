import { Scene } from "phaser";
import { AnimationHelper } from "@app/helpers/animation-helper";

export class BootScene extends Scene {
  private animationHelperInstance: AnimationHelper;

  constructor() {
    super({
      key: "BootScene"
    });
  }

  preload(): void {
    console.log("BootScene :: preload");

    this.load.on(
      "complete",
      function() {
        this.animationHelperInstance = new AnimationHelper(
          this,
          this.cache.json.get("animationJSON")
        );
      },
      this
    );

    // ANIMATION JSON
    this.load.json("animationJSON", "assets/animations/animations.json");

    // SOLDIER SPRITESHEET ATLAS
    this.load.atlas(
      "sms_soldier",
      "assets/sprites/sms_soldier.png",
      "assets/sprites/sms_soldier.json"
    );
  }

  update(): void {
    this.scene.start("MainScene");
  }
}
