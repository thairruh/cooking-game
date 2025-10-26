import { Scene, GameObjects } from 'phaser';

export class Intro1 extends Scene {
  private bg!: GameObjects.Image;
  private title!: GameObjects.Text;
  private body!: GameObjects.Text;
  private nextBtn!: GameObjects.Image;
  private btnBaseScale = 1;

  private STORY = `Little Lantern is a small place that most people pass by without noticing.
The walls are a little worn, the tables don’t match, and the sign out front hums softly when it rains.
But inside, it feels calm. The kind of calm that makes you want to stay a little longer.`;

  constructor() {
    super('Intro1');
  }

  preload() {
    this.load.image('story-bg', '/assets/story-bg.jpg');
    this.load.image('next-btn', '/assets/next-btn.PNG'); // ← use this asset
  }

  async create() {
    const { width, height } = this.scale;

    // Background
    this.bg = this.add.image(width / 2, height / 2, 'story-bg')
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(-100);
    this.fitBgToScreen();

    // Load fonts
    try {
      await (document as any).fonts.load('24px "Bongo8Mono"');
      await (document as any).fonts.load('18px "MonogramExtended"');
    } catch {}

    // Title
    this.title = this.add.text(width / 2, 0, 'Restaurant Story', {
      fontFamily: 'Bongo8Mono',
      fontSize: '20px',
      color: '#743014',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5, 0);

    // Story
    this.body = this.add.text(width / 2, 0, this.STORY, {
      fontFamily: 'MonogramExtended',
      fontSize: '14px',
      color: '#B68962',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
      wordWrap: { width: width * 0.8, useAdvancedWrap: true },
      lineSpacing: 6
    }).setOrigin(0.5, 0);

    this.layout(width, height);

    // Next button → Intro2 (kept near bottom)
    this.nextBtn = this.add.image(width / 2, height - 10, 'next-btn')
      .setOrigin(0.5, 1)
      .setDepth(100)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('Intro2'))
      .on('pointerover', () => this.nextBtn.setScale(this.nextBtn.scale * 1.06))
      .on('pointerout',  () => this.nextBtn.setScale(this.btnBaseScale));

    // Base size, then enlarge to 1.5× and remember that as base
    this.setNextBtnTargetHeight(50);
    this.applyButtonScale(1.5);

    // Resize
    this.scale.on('resize', (size: Phaser.Structs.Size) => {
      const { width, height } = size;
      this.cameras.resize(width, height);
      this.bg.setPosition(width / 2, height / 2);
      this.fitBgToScreen();
      this.body.setWordWrapWidth(width * 0.8, true);
      this.layout(width, height);
      this.nextBtn.setPosition(width / 2, height - 20);
    });
  }

  private layout(w: number, _h: number) {
    const topMargin = 32;
    const titleBodyGap = 24;
    this.title.setPosition(w / 2, topMargin);
    this.body.setPosition(w / 2, this.title.y + this.title.height + titleBodyGap);
  }

  private fitBgToScreen() {
    const { width, height } = this.scale;
    const texture = this.textures.get('story-bg');
    const img = texture && (texture.getSourceImage() as HTMLImageElement);
    if (!img?.width || !img?.height) return;
    const scale = Math.max(width / img.width, height / img.height);
    this.bg.setScale(scale);
  }

  private setNextBtnTargetHeight(targetH: number) {
    const tex = this.textures.get('next-btn');
    const img = tex && (tex.getSourceImage() as HTMLImageElement);
    if (!img?.height) return;
    this.btnBaseScale = targetH / img.height;
    this.nextBtn.setScale(this.btnBaseScale);
  }

  private applyButtonScale(mult: number) {
    this.btnBaseScale *= mult;           // remember new base
    this.nextBtn.setScale(this.btnBaseScale);
  }
}
