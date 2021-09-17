//To start type npm run start

/* TO DO
    - Make cars barriers and rode not
    - Make logs platforms and water bad
    - Lives and game over
*/

import Phaser, { LEFT } from 'phaser';
import spriteSheetImg from './assets/Frog.png';

const LANE_HEIGHT = 50;
const WIDTH = 800;
const HEIGHT = 10 * LANE_HEIGHT;
const WATER_COLOR = 0x0000ff;
const ROAD_COLOR = 0x303030;
const GRASS_COLOR = 0x00ff00;
const LOG_COLOR = 0x964b00;
const CAR_COLOR = 0xff0000;

const LANES = [
   // Terrain, Speed, 
    { terrain: 'grass', speed: 50 }, //Lane 1 starting from bottom
    { terrain: 'grass', speed: 50 }, 
    { terrain: 'road', speed: 1 }, 
    { terrain: 'road', speed: -2 }, 
    { terrain: 'road', speed: 2 }, 
    { terrain: 'grass', speed: 50 }, 
    { terrain: 'water', speed: 2 }, 
    { terrain: 'water', speed: -3 }, 
    { terrain: 'water', speed: 1 }, 
    { terrain: 'lilypads', speed: 50 }, 
];

LANES.forEach(lane => {
    const obstacles = Array.apply(null, Array(24))
    if(lane.terrain === 'grass' || lane.terrain === 'lilypads') return
    lane.obstacles = obstacles.map(obstacle =>{
        return Math.round(Math.random())
    })
}) 

const frogPos = {x: WIDTH / LANE_HEIGHT / 2 - 1, y: HEIGHT / LANE_HEIGHT}; //starting position

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('spriteSheet', spriteSheetImg)
    }
      
    create ()
    {        
        // Draw Lanes
        for(var laneNum in LANES){
            const lane = LANES[laneNum]

            var color = GRASS_COLOR;
            var obstacleColor = null;
            if (lane.terrain === 'water') {
                color = WATER_COLOR;
                obstacleColor = LOG_COLOR;
            }
            if (lane.terrain === 'road') {
                color = ROAD_COLOR;
                obstacleColor = CAR_COLOR;
            }

            this.add.rectangle(WIDTH/2, HEIGHT-laneNum*LANE_HEIGHT-LANE_HEIGHT/2, WIDTH, LANE_HEIGHT, color);

            //Obstacles
            //Loop over all obstacles and recreat rec for the ones that have 1
            //Save the resulting obstacle in the same index in the obstacle array          
            if(lane.obstacles) {
                lane.obstacleRects = lane.obstacles.map((obstacle, i) =>{
                    if(!obstacle) return null
                    return this.add.rectangle(i*LANE_HEIGHT, HEIGHT-laneNum*LANE_HEIGHT-LANE_HEIGHT/2, LANE_HEIGHT, LANE_HEIGHT, obstacleColor);
                })
            }
        }
              

        // Add image
        this.frogSprite = this.add.image(0, 0, 'spriteSheet');

        // Set initial position
        this.frogSprite.setPosition(frogPos.x * LANE_HEIGHT + LANE_HEIGHT/2, frogPos.y * LANE_HEIGHT + LANE_HEIGHT/2);
        this.frogSprite.rotation = 180 * Math.PI / 180;

         // Cursors input
        this.cursors = this.input.keyboard.createCursorKeys();
        
    }

    update ()    
    {
        //Obstacle Movement
        for(var laneNum in LANES){
            const lane = LANES[laneNum];

            if(lane.obstacleRects) {
                var obstacleGroupWidth = lane.obstacleRects.length * LANE_HEIGHT;

                lane.obstacleRects.forEach(obstacleRect => {
                    if(obstacleRect) {
                        obstacleRect.x += lane.speed;
                        
                        //set x bounds
                        if(obstacleRect.x < -LANE_HEIGHT) {
                            obstacleRect.x = obstacleGroupWidth;
                        }
                        if(obstacleRect.x > obstacleGroupWidth) {
                            obstacleRect.x = -LANE_HEIGHT;
                        }
                    }  
                })
            }
        }

    

         // Cursor move 
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left))
         {
             frogPos.x -= 1;
             this.frogSprite.x = frogPos.x * LANE_HEIGHT + LANE_HEIGHT/2;
             this.frogSprite.rotation = 90 * Math.PI / 180;
         }
         else if (Phaser.Input.Keyboard.JustDown(this.cursors.right))
         {
            frogPos.x += 1;
            this.frogSprite.x = frogPos.x * LANE_HEIGHT + LANE_HEIGHT/2;
            this.frogSprite.rotation = 270 * Math.PI / 180;
         }
         if (Phaser.Input.Keyboard.JustDown(this.cursors.up))
         {
            frogPos.y -= 1;
             this.frogSprite.y = frogPos.y * LANE_HEIGHT + LANE_HEIGHT/2;
             this.frogSprite.rotation = 180 * Math.PI / 180;
         }
         else if (Phaser.Input.Keyboard.JustDown(this.cursors.down))
         {
            frogPos.y += 1;
            this.frogSprite.y = frogPos.y * LANE_HEIGHT + LANE_HEIGHT/2;
            this.frogSprite.rotation = 0 * Math.PI / 180;
        }

         // Do not exceed boundry
         if (this.frogSprite.x < 0)
         {
             this.frogSprite.x = LANE_HEIGHT/2;
             frogPos.x = 0; 
         }
         else if (this.frogSprite.x > WIDTH)
         {
             this.frogSprite.x = WIDTH - LANE_HEIGHT/2;
             frogPos.x = WIDTH/LANE_HEIGHT - 1;
         }
         else if (this.frogSprite.y < 0)
         {
             this.frogSprite.y = LANE_HEIGHT/2;
             frogPos.y = 0;
         }
         else if (this.frogSprite.y > HEIGHT)
         {
             this.frogSprite.y = HEIGHT - LANE_HEIGHT/2;
             frogPos.y = HEIGHT/LANE_HEIGHT - 1;
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


