//To start type npm run start

import Phaser from 'phaser';
//import logoImg from './assets/logo.png';
import spriteSheetImg from './assets/Frog.png';

const WIDTH = 800;
const HEIGHT = 450;
const LANE_HEIGHT = 50;
const WATER_COLOR = 0x0000ff;
const ROAD_COLOR = 0x303030;
const GRASS_COLOR = 0x00ff00;
const LOG_COLOR = 0x964b00;
const CAR_COLOR = 0xff0000;

const LANES = [
   // Terrain, Speed, 
    { terrain: 'grass', speed: 50 }, //Lane 1
    { terrain: 'grass', speed: 50 }, //Lane 2
    { terrain: 'road', speed: 50 }, //Lane 3
    { terrain: 'road', speed: 50 }, //Lane 4
    { terrain: 'road', speed: 50 }, //Lane 5
    { terrain: 'water', speed: 50 }, //Lane 6
    { terrain: 'water', speed: 50 }, //Lane 7
    { terrain: 'water', speed: 50 }, //Lane 8
    { terrain: 'lilypads', speed: 50 }, //Lane 9
];

LANES.forEach(lane => {
    const obstacles = Array.apply(null, Array(24))
    lane.obstacles = obstacles.map(obstacle =>{
        return Math.round(Math.random())
    })
}) 


class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        //this.load.image('spriteSheet', spriteSheetImg)
    }
      
    create ()
    {
        // Add image
        this.spriteSheet = this.add.image(0, 0, 'spriteSheet');
        
        // Draw Lanes
        for(var laneNum in LANES){
            const lane = LANES[laneNum]
            console.log(laneNum, lane)

            var color = GRASS_COLOR;
            if (lane.terrain === 'water') color = WATER_COLOR;
            if (lane.terrain === 'road') color = ROAD_COLOR;

            this.add.rectangle(WIDTH/2, HEIGHT-laneNum*LANE_HEIGHT-LANE_HEIGHT/2, WIDTH, LANE_HEIGHT, color);
        }
              
        // Set initial position
        this.spriteSheet.setPosition(WIDTH/2, HEIGHT/2);

         // Cursors input
        this.cursors = this.input.keyboard.createCursorKeys();
        
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
         else if (this.spriteSheet.x > WIDTH)
         {
             this.spriteSheet.x = WIDTH;
         }
         else if (this.spriteSheet.y < 0)
         {
             this.spriteSheet.y = 0;
         }
         else if (this.spriteSheet.y > HEIGHT)
         {
             this.spriteSheet.y = HEIGHT;
         }
   }
}



 const config = {
     type: Phaser.AUTO,
     parent: 'phaser-example',
     width: WIDTH,
     height: HEIGHT ,
     scene: MyGame,
     backgroundColor: '#000000'
 }

 const game = new Phaser.Game(config);


// Use arrow keys to move picture manually
// take inputs from arrow keys
// increament position based on what arrow key is pressed
// set the position of image

