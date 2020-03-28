import { Scene } from "phaser";

export class BootScene extends Scene {
  constructor() {
    super({
      key: "BootScene"
    });
  }

  preload(): void {
    console.log("BootScene :: preload");
    this.load.atlas("human", "assets/sprites/spritesheet.png", 'assets/sprites/spritesheet.json');
  }

  update():void {
      this.scene.start("MainScene");
  }  
}
