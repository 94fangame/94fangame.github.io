import { characters } from "../constants/characters.js" ;
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
  scene.load.bitmapFont('Pixel border',
    './assets/fonts/Uni0554_border_24.png', './assets/fonts/Uni0554_border_24.xml');
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


export const loadIcons = (scene)=>{
  scene.load.image('icon check','./assets/ui/ic_check.png');
  scene.load.image('icon cancel','./assets/ui/ic_cancel.png');
  scene.load.image('icon new','./assets/ui/ic_new.png');
  scene.load.image('icon play','./assets/ui/ic_play.png');
  scene.load.image('icon save','./assets/ui/ic_save.png');
  scene.load.image('icon swap','./assets/ui/ic_swap.png');
  scene.load.image('icon undo','./assets/ui/ic_undo.png');
  scene.load.image('icon retry','./assets/ui/ic_retry.png');
  scene.load.spritesheet('icon levels', './assets/ui/ic_levels.png', {
    frameWidth: 12, frameHeight: 12
  });
  scene.load.image('icon change-lvl','./assets/ui/ic_change-level.png');
}