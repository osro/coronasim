import { Game } from "phaser";
import { MainScene } from "@app/scenes/main-scene";
import { BootScene } from "@app/scenes/boot-scene";

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Corona Simulation Test",
  type: Phaser.AUTO,
  scale: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  physics: {      
    default: "arcade",
    arcade: {
      debug: false,
      maxEntries: 10000,
      fps: 60
    }
  },
  scene: [BootScene, MainScene],
  parent: "game",
  backgroundColor: "#F1F1F1",
  render: {
    pixelArt: true,
    antialias: false
  }
};

export const game = new Game(gameConfig);
