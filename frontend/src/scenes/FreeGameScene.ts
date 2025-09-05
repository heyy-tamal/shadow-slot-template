import { IScene, Manager } from "../core/Manager";
import { Container, Sprite, Text, TextStyle } from "pixi.js";

export class FreeGameScene extends Container implements IScene {
    assetBundles: string[];

    constructor() {
        super();
        this.assetBundles = ["game-assets"]; // Placeholder for assets you want to load
    }

    // Update logic for this scene (e.g., animations, game logic)
    update(): void {
        // Example: Update a sprite's position or state
        console.log("Updating GameScene...");
    }

    // Resize the scene based on new screen dimensions
    resize(screenWidth: number, screenHeight: number): void {
        // Resize background or UI elements if needed
        console.log(`Resizing GameScene to ${screenWidth}x${screenHeight}`);
    }

    // Initializes the scene after assets are loaded
    constructorWithAssets(): void {
        // Load and display a simple background or element
        const background = Sprite.from("background.png"); // Assuming this asset is loaded
        background.width = Manager.screenWidth;
        background.height = Manager.screenHeight;
        this.addChild(background);

        const message = new Text("Welcome to the Game!", new TextStyle({
            fill: "#ffffff",
            fontSize: 36
        }));
        message.x = Manager.screenWidth / 2 - message.width / 2;
        message.y = Manager.screenHeight / 2 - message.height / 2;
        this.addChild(message);
    }
}
