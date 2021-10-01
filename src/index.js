//To start type npm run start

// 3 Parts of a block of code (Not all 3 parts are needed all times, but usually at least 2)
//  -Input: Set up (getting and making sure you have varabiles and constants needed)
//  -Logic: Do something (what are you doing with the variables)
//  -Output: Return (Return value or print or format or render)  

/* TO DO
    - Make logs platforms and water bad
*/

import Phaser, { LEFT } from 'phaser';
import spriteSheetImg from './assets/Frog.png';

//Define lanes for the game
const LANES = [
    // object keys are terrain and speed 
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

// Gloabal game constants
const LANE_HEIGHT = 50;         
const WIDTH = 800;                  //screen width
const HEIGHT = LANES.length * LANE_HEIGHT;    //screen height
const WATER_COLOR = 0x0000ff;       
const ROAD_COLOR = 0x303030;
const GRASS_COLOR = 0x00ff00;
const LOG_COLOR = 0x964b00;
const CAR_COLOR = 0xff0000;
const LOG_DENSITY = 1;              //density of how many logs generate
const CAR_DENSITY = .8;             //density of how many cars generate

// Frog start position and rotation
const FROG_START_POS_X = WIDTH / LANE_HEIGHT / 2 - 1;   //middle of screen
const FROG_START_POS_Y = HEIGHT / LANE_HEIGHT;          //bottom of screen
const FROG_START_POS_ROT = 180;                         //pointing up
const frogPos = {
    x: FROG_START_POS_X,        //frog x starting position
    y: FROG_START_POS_Y,        //frog y starting position
    rot: FROG_START_POS_ROT     //frog starting rotation
}; 

// Generate logs and cars
LANES.forEach(lane => {
    // loop through each of the lanes to create obstacles
    const obstacles = Array.apply(null, Array(24))

    // if the lane terrain is grass or lilypads return out of the function
    if(lane.terrain === 'grass' || lane.terrain === 'lilypads') return  //return nothing

    // create each individual obstacle
    lane.obstacles = obstacles.map(obstacle =>{
        if(lane.terrain === 'water'){
            return Math.round(Math.random() * LOG_DENSITY) //Generate logs
        } else{
            return Math.round(Math.random() * CAR_DENSITY) //Generate cars
        }
    })
}) 

//Assign a lane index number to road lanes
const ROAD_LANE_INDEXES = LANES.map((lane, i) => {
    if (lane.terrain === 'road') return i;
    return -1;
}).filter(laneIndex => {
    return laneIndex !== -1;
})

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

            //check for water and assign colors
            if (lane.terrain === 'water') {
                color = WATER_COLOR;
                obstacleColor = LOG_COLOR;
            }
            //check for lane as road and assign colors
            if (lane.terrain === 'road') {
                color = ROAD_COLOR;
                obstacleColor = CAR_COLOR;
            }

            //generate lane background
            this.add.rectangle(WIDTH/2, HEIGHT-laneNum*LANE_HEIGHT-LANE_HEIGHT/2, WIDTH, LANE_HEIGHT, color);

            //Obstacles
            //Loop over all obstacles in array
            //Save the resulting obstacle in the same index in the obstacle array          
            if(lane.obstacles) {
                lane.obstacleRects = lane.obstacles.map((obstacle, i) =>{
                    if(!obstacle) return null       // if index 0 do not generate obstacle
                    //generate obstacle rec
                    return this.add.rectangle(i*LANE_HEIGHT, HEIGHT-laneNum*LANE_HEIGHT-LANE_HEIGHT/2, LANE_HEIGHT, LANE_HEIGHT, obstacleColor);
                })
            }
        }
              

        // Add image
        this.frogSprite = this.add.image(0, 0, 'spriteSheet');

        // Generate initial position of frog
        this.frogSprite.setPosition(frogPos.x * LANE_HEIGHT + LANE_HEIGHT/2, frogPos.y * LANE_HEIGHT + LANE_HEIGHT/2);
        this.frogSprite.rotation = frogPos.rot;

         // Map cursor inputs
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
           

         // Cursor movement of frog
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {                //cursor left
             frogPos.x -= 1;
             frogPos.rot = 90;
         }
         else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {         //cursor right
            frogPos.x += 1;
            frogPos.rot = 270;
         }
         if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {                 //cursor up
            frogPos.y -= 1;
             frogPos.rot = 180;
         }
         else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {          //cursor down
            frogPos.y += 1;
            frogPos.rot = 0;
         }


         // Setting from screen boundaries
         if (this.frogSprite.x < 0) {                                           //left boundary wall
             frogPos.x = 0; 
         }
         else if (this.frogSprite.x > WIDTH) {                                  //right boundary wall
             frogPos.x = WIDTH/LANE_HEIGHT - 1;
         }
         else if (this.frogSprite.y < 0) {                                      //bottom boundary wall
             frogPos.y = 0;
         }
         else if (this.frogSprite.y > HEIGHT) {                                 //top boundary wall
             frogPos.y = HEIGHT/LANE_HEIGHT - 1;
         }
     
         // Setting up cars as obstacles
         if (ROAD_LANE_INDEXES.includes(LANES.length - 1 - frogPos.y)) {
            const lane = LANES[LANES.length - 1 - frogPos.y];

            //loop throgh each obstacle in the array to check if 1 or 0
            lane.obstacleRects.forEach(obstacleRect => {
                if(obstacleRect) {
                    //if value is 1, determine if obstacle position and frog position collided
                    if(obstacleRect.x - LANE_HEIGHT/2 < this.frogSprite.x + this.frogSprite.width * 0.8 / 2 && this.frogSprite.x - this.frogSprite.width * 0.8 / 2 < obstacleRect.x + LANE_HEIGHT/2) {                         
                       //if positions have collided, send frog to starting position
                       frogPos.x = FROG_START_POS_X
                       frogPos.y = FROG_START_POS_Y
                    }
                }
            })
        }

        // Update Rendering for Frog
        this.frogSprite.x = frogPos.x * LANE_HEIGHT + LANE_HEIGHT / 2;
        this.frogSprite.y = frogPos.y * LANE_HEIGHT + LANE_HEIGHT / 2;
        this.frogSprite.rotation = frogPos.rot * Math.PI / 180;                   //in degrees
   }
}


 const config = {                                                                  //configure game screen
     type: Phaser.AUTO,
     parent: 'phaser-example',
     width: WIDTH,
     height: HEIGHT ,
     scene: MyGame,
     backgroundColor: '#000000'
 }

 const game = new Phaser.Game(config);


