//To start type npm run start

import Phaser from 'phaser';
//import logoImg from './assets/logo.png';
import spriteSheetImg from './assets/Frogger.png';

class MyGame extends Phaser.scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        //this.load.image('logo', logoImg);
        this.load.image('spriteSheet', spriteSheetImg)
    }
      
    create ()
    {
        // // Add image
        // this.spriteSheet = this.add.image(0, 0, 'spriteSheet');
        // //frogPic = this.add.image(50,50,'spriteSheet')

        // cropFrog = new Phaser.

        // spriteSheet.crop(cropFrog)

        
        // // Set initial position
        // this.spriteSheet.setPosition(0, 0);

        //  // Cursors input
        // this.cursors = this.input.keyboard.createCursorKeys();
        
    }
update ()    
    {
        
         // Cursor move 
         if (this.cursors.left.isDown)
         {
             this.spriteSheet.x -= 16;
         }
         else if (this.cursors.right.isDown)
         {
             this.spriteSheet.x += 16;
         }
         if (this.cursors.up.isDown)
         {
             this.spriteSheet.y -= 16;
         }
         else if (this.cursors.down.isDown)
         {
             this.spriteSheet.y += 16;
         }

         // Do not exceed boundry
         if (this.spriteSheet.x < 0)
         {
             this.logo.x = 0;
         }
         else if (this.spriteSheet.x > 800)
         {
             this.spriteSheet.x = 800;
         }
         else if (this.spriteSheet.y < 0)
         {
             this.spriteSheet.y = 0;
         }
         else if (this.spriteSheet.y > 600)
         {
             this.spriteSheet.y = 600;
         }
   }
}



 const config = {
     type: Phaser.AUTO,
     parent: 'phaser-example',
     width: 800,
     height: 600 ,
     scene: MyGame,
     backgroundColor: '#00FF00'
 }

 const game = new Phaser.Game(config);


// Use arrow keys to move picture manually
// take inputs from arrow keys
// increament position based on what arrow key is pressed
// set the position of image

