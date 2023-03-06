import characters from "../constants/characters.json" assert { type: "json" };
// import groups from "./constants/groups.json" assert { type: "json" };

export const loadCharactersTxts = (scene)=>{
  characters.forEach( c => {
    let nameParts = c.name.split(' '); 
    let name = ''; 
    nameParts.map((n, i) => { 
      name += n.toLowerCase(); 
      if (i < nameParts.length-1) { name += '-' } 
    })
    
    scene.load.image( c.name, './assets/chars/'+name+'.png' );
  } );
}


export const loadBmpFonts = (scene) => {
  scene.load.bitmapFont('Pixel', './assets/fonts/Uni0554_16.png', './assets/fonts/Uni0554_16.xml');
  scene.load.bitmapFont('Pixel bold', './assets/fonts/Uni0554_bold_24.png', './assets/fonts/Uni0554_bold_24.xml');  
  scene.load.bitmapFont('Pixel bold white',
    './assets/fonts/Uni0554_bold_24_w.png', './assets/fonts/Uni0554_bold_24_w.xml');
}


export const loadBtnTextures = (scene)=>{
  let btnTextures = {
    common: ["btn_1", "btn_3", "btn_4", "btn_6"],
    accent: ["btn-g_1", "btn-g_3", "btn-g_4", "btn-g_6"],
  }
  btnTextures.common.forEach( btn => {
    scene.load.image( btn, './assets/ui/'+btn+'.png' );
  } );
  btnTextures.accent.forEach( btn => {
    scene.load.image( btn, './assets/ui/'+btn+'.png' );
  } );
  // console.log(scene.textures.exists(type+size));
}


export const loadCards = (scene)=>{
  scene.load.spritesheet('cards', './assets/ui/cards.png', {
    frameWidth: 32, frameHeight: 32
  });
  scene.load.image( 'card line', './assets/ui/card_line.png' );
  scene.load.image( 'card back', './assets/ui/card_back.png' );
}