import { GameOver } from './scenes/GameOver';
import { CharSelect as CharSelect } from './scenes/CharSelect';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Cafe } from './scenes/Cafe';
import { Intro1 } from './scenes/Intro1';
import { Intro2 } from './scenes/Intro2';
import {Kitchen} from './scenes/Kitchen';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 500,
    height: 300,
    parent: 'game-container',
    backgroundColor: '#f3bdbd',
    pixelArt: true,

    physics: {
        default: 'arcade',
        arcade: {
        gravity: { x: 0, y: 0 },
        },
    },

    scale: {
    // mode: Phaser.Scale.RESIZE,
    // autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 3,
    },

    scene: [
        Preloader,
        MainMenu,
        Intro1,
        Intro2,
        Cafe,
        Kitchen,
        GameOver,
    ],

    };




const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
