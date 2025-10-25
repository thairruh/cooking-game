import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { CharSelect as CharSelect } from './scenes/CharSelect';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Cafe } from './scenes/Cafe';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#f3bdbd',

    scale: {
        mode: Phaser.Scale.RESIZE,              
        autoCenter: Phaser.Scale.CENTER_BOTH, 
        width: 1920,
        height: 1080,
    },

    scene: [
        Boot,
        Preloader,
        MainMenu,
        CharSelect,
        Cafe,
        GameOver
    ]
    
};



const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
