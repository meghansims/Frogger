//To start type npm run start

import Phaser, { LEFT } from 'phaser';
import spriteSheetImg from './assets/Frog.png';

const WIDTH = 800;
const HEIGHT = 500;
const LANE_HEIGHT = 50;
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

const frogPos = {x: 7, y: 9}; //starting position

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
        this.spriteSheet = this.add.image(0, 0, 'spriteSheet');

        // Set initial position
        this.spriteSheet.setPosition(frogPos.x * LANE_HEIGHT, frogPos.y * LANE_HEIGHT);

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
             this.spriteSheet.x = frogPos.x * LANE_HEIGHT;
         }
         else if (Phaser.Input.Keyboard.JustDown(this.cursors.right))
         {
            frogPos.x += 1;
            this.spriteSheet.x = frogPos.x * LANE_HEIGHT;
         }
         if (Phaser.Input.Keyboard.JustDown(this.cursors.up))
         {
            frogPos.y -= 1;
             this.spriteSheet.y = frogPos.y * LANE_HEIGHT;
         }
         else if (Phaser.Input.Keyboard.JustDown(this.cursors.down))
         {
            frogPos.y += 1;
            this.spriteSheet.y = frogPos.y * LANE_HEIGHT;
         }

         // Do not exceed boundry
         if (this.spriteSheet.x < 0)
         {
             this.spriteSheet.x = 0;
             frogPos.x = 0;             
         }
         else if (this.spriteSheet.x > WIDTH)
         {
             this.spriteSheet.x = WIDTH;
             frogPos.x = WIDTH/LANE_HEIGHT
         }
         else if (this.spriteSheet.y < 0)
         {
             this.spriteSheet.y = 0;
             frogPos.y = 0;
         }
         else if (this.spriteSheet.y > HEIGHT)
         {
             this.spriteSheet.y = HEIGHT;
             frogPos.y = HEIGHT/LANE_HEIGHT;
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


