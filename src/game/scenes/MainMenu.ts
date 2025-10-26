import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
  private background!: GameObjects.Image;
  private bottomCaption!: GameObjects.Text;
  private playBtn!: GameObjects.Image;

  constructor() {
    super('MainMenu');
  }

  preload() {
    // Use exact file names from your /public/assets folder
    this.load.image('start-bg', '/assets/start-bg.PNG');
    this.load.image('play-btn', '/assets/play-btn.png');
  }

  async create() {
    const { width, height } = this.scale;

    // Background centered, then scaled to "cover" the viewport
    this.background = this.add.image(width / 2, height / 2, 'start-bg')
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(-100);

    this.fitBgToScreen();

    // Ensure the custom font is ready (helps avoid FOUT)
    try {
      await (document as any).fonts.load('15px "Bongo8Mono"');
    } catch { /* no-op */ }

    // Tilted bottom-left caption
    this.bottomCaption = this.add.text(0, 0, 'little lantern: a cooking game', {
      fontFamily: 'Bongo8Mono',
      fontSize: '11px',
      color: '#B68962',
      stroke: '#000000',
      strokeThickness: 2,
    })
      .setOrigin(0, 2)   // left-bottom
      .setAngle(-2)
      .setDepth(120);

    // Slanted play button on the right of the caption
    this.playBtn = this.add.image(0, 0, 'play-btn')
      .setOrigin(0, 1)   // left-bottom aligns visually with caption baseline
      .setAngle(-3)
      .setDepth(100)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('Intro1'))
      .on('pointerover', () => this.playBtn.setScale(this.playBtn.scale * 1.06))
      .on('pointerout',  () => this.playBtn.setScale(this.playBtnBaseScale));

    // Normalize play button height (~40px) so it looks consistent
    this.setPlayBtnTargetHeight(40);

    // Initial placement
    this.repositionBottomUI(width, height);

    // Handle window/resolution changes
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      const { width, height } = gameSize;
      this.cameras.resize(width, height);
      this.background.setPosition(width / 2, height / 2);
      this.fitBgToScreen();
      this.repositionBottomUI(width, height);
    });

    EventBus.emit('current-scene-ready', this);
  }

  // --- helpers ---

  private fitBgToScreen() {
    const { width, height } = this.scale;
    const img = this.textures.get('start-bg').getSourceImage() as HTMLImageElement;
    if (!img || !img.width || !img.height) return;

    const scale = Math.max(width / img.width, height / img.height);
    this.background.setScale(scale);
  }

  private playBtnBaseScale = 1;

  private setPlayBtnTargetHeight(targetH: number) {
    const img = this.textures.get('play-btn').getSourceImage() as HTMLImageElement;
    if (img && img.height) {
      this.playBtnBaseScale = targetH / img.height;
      this.playBtn.setScale(this.playBtnBaseScale);
    }
  }

  private repositionBottomUI(w: number, h: number) {
    const margin = 18;  // padding from screen edges
    const gap = 10;     // space between text and button

    // Position caption left-bottom
    this.bottomCaption.setPosition(margin, h - margin);
    this.bottomCaption.y += 25; // pushes main text lower

    // Place play button to the right of the caption baseline
    const rightOfCaption = this.bottomCaption.x + this.bottomCaption.displayWidth;
    this.playBtn.setPosition(rightOfCaption + gap, h - margin);
    this.playBtn.y += 15;
  }
}
