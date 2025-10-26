import { Scene, GameObjects } from 'phaser';

export class Intro2 extends Scene {
  private bg!: GameObjects.Image;
  private title!: GameObjects.Text;
  private body!: GameObjects.Text;
  private nextBtn!: GameObjects.Image;
  private btnBaseScale = 1;

  private STORY = `People come here after long days, looking for something warm and familiar.
It is not about fancy food or perfect timing. It is about comfort, about being reminded that someone still cares enough to make a good meal.
No matter who walks through the door, there is always a seat waiting and light in the windows.`;

  constructor() {
    super('Intro2');
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

    // Next button → Cafe
    this.nextBtn = this.add.image(width / 2, height - 10, 'next-btn')
      .setOrigin(0.5, 1)
      .setDepth(100)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('Cafe'))
      .on('pointerover', () => this.nextBtn.setScale(this.nextBtn.scale * 1.06))
      .on('pointerout',  () => this.nextBtn.setScale(this.btnBaseScale));

    // Base size, then enlarge to 1.5× and remember base
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
