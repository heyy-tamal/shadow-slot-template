import { Application, Container } from "pixi.js";
import { GameScene } from "../scenes/GameScene";

export class Manager {
    private constructor() {}

    // Initialize the app
    private static app: Application;

    // Current active scene
    private static currentScene: IScene;

    // Screen size variables
    public static screenWidth: number;
    public static screenHeight: number;

    // Initialize the application and setup the screen
    public static init(appWidth: number, appHeight: number): void {
        Manager.screenWidth = appWidth;
        Manager.screenHeight = appHeight;

        // Create the Pixi Application
        Manager.app = new Application({
            width: Manager.screenWidth,
            height: Manager.screenHeight,
            backgroundColor: 0x000000, // Optional background color
        });

        // Append to the DOM
        document.body.appendChild(Manager.app.view);

        const gameScene = new GameScene();

        // Set up initial scene
        Manager.changeScene(gameScene);
    }

    // Method to change the current scene
    public static changeScene(newScene: IScene): void {
        if (Manager.currentScene) {
            // Clean up the current scene if there is one
            Manager.app.stage.removeChild(Manager.currentScene);
            Manager.currentScene.destroy({ children: true });
        }

        // Set new scene and add it to the stage
        Manager.currentScene = newScene;
        Manager.app.stage.addChild(Manager.currentScene);
    }

    // Method to resize the game (update screen size)
    public static resize(width: number, height: number): void {
        Manager.screenWidth = width;
        Manager.screenHeight = height;

        // Resize the app view
        Manager.app.renderer.resize(width, height);

        // If current scene exists, resize it as well
        if (Manager.currentScene) {
            Manager.currentScene.resize(width, height);
        }
    }

    // Get the current Pixi application instance
    public static getApp(): Application {
        return Manager.app;
    }

    // Accessor for current scene
    public static getCurrentScene(): IScene {
        return Manager.currentScene;
    }
}


export interface IScene extends Container {
    assetBundles: string[];  // Array of asset bundles required for this scene

    // Updates the scene (e.g., animations, logic)
    update(): void;

    // Resizes the scene to fit the new screen dimensions
    resize(screenWidth: number, screenHeight: number): void;

    // Initializes the scene after assets have been loaded
    constructorWithAssets(): void;
}
