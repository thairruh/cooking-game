import { GridEngine, GridEngineHeadless } from "grid-engine";
import { GameOver } from './scenes/GameOver';
import { CharSelect as CharSelect } from './scenes/CharSelect';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Cafe } from './scenes/Cafe';
import { Intro1 } from './scenes/Intro1';
import { Intro2 } from './scenes/Intro2';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 300,
    height: 250,
    parent: 'game-container',
    backgroundColor: '#f3bdbd',

    pixelArt: true,
    scale: {
        // mode: Phaser.Scale.RESIZE,              
        // autoCenter: Phaser.Scale.CENTER_BOTH, 
        zoom: 4
    },

    

    scene: [
        Preloader,
        MainMenu,
        Intro1,
        Intro2,
        CharSelect,
        Cafe,
        GameOver,
    ],

    plugins: {
    scene: [
        {key: "gridEngine",
        plugin: GridEngine,
        mapping: "gridEngine",
        },
        ],
    },
    
};



const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
