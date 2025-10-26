import { EventBus } from '../EventBus';
import { GameObjects, Scene } from 'phaser';

export class Kitchen extends Scene
{
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    title: GameObjects.Text;
    player: any;
    cursors: any;
    hasTransitioned: any;


    constructor ()
    {
        super('Kitchen');
    }

    create (data: { playerY?: number })
    {
        
        console.log('has player texture?', this.textures.exists('player'));
        console.log('has walk-down anim?', this.anims.exists('walk-down'));
        console.log('has walk-up anim?', this.anims.exists('walk-up'));
        console.log('has walk-side anim?', this.anims.exists('walk-side'));

        const spawnY = data.playerY ?? 150; // default if nothing is passed
        this.player = this.physics.add.sprite(-10, spawnY, 'player');

        // Enable physics 
        const anim = this.anims.get('walk-right');
        if (anim) {
            const firstFrame = anim.frames[0].frame.name; // or .frameNumber depending on your spritesheet
            this.player.setFrame(firstFrame);
        }

        this.physics.world.setBounds(-50, 100, 600, 200);
        this.player.setCollideWorldBounds(true); // stops at screen edges

        // Store movement keys
        this.cursors = this.input.keyboard!.addKeys({
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D
        });

        const {width, height} = this.scale;

        this.background = this.add.image(width / 2, height / 2, 'restaurantBg')
        .setOrigin(0.5).setDepth(0);

        const bgWidth = this.background.width;
        const bgHeight = this.background.height;

        const scaleX = width / bgWidth;
        const scaleY = height / bgHeight;
        const scale = Math.max(scaleX, scaleY);

        this.background.setScale(scale);
        
        this.player.setScale(2);
        this.player.setDepth(2);

        EventBus.emit('current-scene-ready', this);
    }


    update() {
        const speed = 100;

        // Stop previous movement
        this.player.setVelocity(0);
        const playerY = this.player.y;

        if (playerY > 500) {
            this.scene.start('Kitchen'); // replace with your next scene key
        }

        if (!this.hasTransitioned && this.player.x < -15) {
            this.hasTransitioned = true;
            this.scene.start('Cafe', { playerY: this.player.y , playerX: this.player.x});
            this.hasTransitioned = false;
        }

        // Move and play animations
        if (this.cursors.a.isDown) {
            this.player.setVelocityX(-speed);
            this.player.flipX = false; // face left
            this.player.anims.play('walk-left', true);
        } 
        else if (this.cursors.d.isDown) {
            this.player.setVelocityX(speed);
            this.player.flipX = false; // face right
            this.player.anims.play('walk-right', true);
        } 
        else if (this.cursors.w.isDown) {
            this.player.setVelocityY(-speed);
            this.player.anims.play('walk-up', true);
        } 
        else if (this.cursors.s.isDown) {
            this.player.setVelocityY(speed);
            this.player.flipX = false;
            this.player.anims.play('walk-down', true);
        } 
        else {
            // stop animations when idle
            this.player.anims.stop();
        }
    }



    changeScene ()
    {
        this.scene.start('Cafe');
    }
}