const imgcharactersize = 32;

export class ClickGame extends Phaser.Scene {
  constructor() {
    super({key: 'click game'});
  }

  init(data) {
    this.charsTexts = data.characters; //textures
    // data.characters.forEach(t => {
    //   console.log(t);
    // });
  }

  create() {
    const getRandom = ()=>{
      return this.charsTexts[ Math.floor(Math.random() * this.charsTexts.length) ];
    }

    this.add.bitmapText(144, 0, 'Pixel', 'Click on same character as current')
      .setOrigin(0.5, 0).setFontSize(8);

    // CURRENT CLICKABLE
    this.current = this.add.image(128, 32, getRandom());
    this.add.image(this.current.x, this.current.y, 'frame');

    //SCORE
    this.score = 0;
    this.scoreTxt = this.add.bitmapText(160, 32, 'Pixel bold', 'Score: 0').setOrigin(0, 0.5).setScale(0.5);
    
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        let aux = this.add.image((j+2) * imgcharactersize, (i+2.5) * imgcharactersize, getRandom());
        aux.setInteractive()
          .on(Phaser.Input.Events.POINTER_DOWN, ()=>{
            if (aux.texture.key == this.current.texture.key) {
              this.score++;
              this.scoreTxt.text = 'Score: ' + this.score;
            }
          })
          .on(Phaser.Input.Events.POINTER_OVER, ()=>{
            aux.setTint(0xE1E7F2);
          })
          .on(Phaser.Input.Events.POINTER_OUT, ()=>{
            aux.setTint(0xFFFFFF);
          });
      }
    }
  }
}