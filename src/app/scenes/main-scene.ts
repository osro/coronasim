import { Scene } from "phaser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Game"
  };

export class MainScene extends Scene {
    constructor() {
        console.log("MainScene :: constructor");
        super(sceneConfig);
    }
}