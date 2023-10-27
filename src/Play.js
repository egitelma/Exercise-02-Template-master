class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image("ball", "ball.png");
        this.load.image("wall", "wall.png");
        this.load.image("oneway", "one_way_wall.png");
    }

    create() {

        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        //display variables
        let textConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            color: "#FFFFFF",
            align: "right",
            padding: {
                top: 5,
                bottom: 5
            }
        }
        this.shotCounter = 0;
        this.shotCounterText = this.add.text(0, 0, "SHOTS TAKEN: " + this.shotCounter, textConfig);
        this.holeCounter = 0;
        this.holeCounterText = this.add.text(0, 30, "HOLES IN: " + this.holeCounter, textConfig);
        this.successPercent = 0;
        this.successText = this.add.text(0, 60, "SUCCESS PERCENTAGE: " + this.successPercent + "%", textConfig);

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, "cup").setOrigin(0)
        this.cup.body.setCircle(this.cup.width/4)
        this.cup.body.setOffset(this.cup.width/4)
        this.cup.body.setImmovable(true);

        //add ball *for clarity, be careful with chains
        this.ball = this.physics.add.sprite(width/2, height - height/10, "ball").setOrigin(0)
        this.ball.body.setCircle(this.ball.width/2);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setBounce(0.5);
        this.ball.body.setDamping(true).setDrag(0.5);

        //add walls
        let wallA = this.physics.add.sprite(0, height/4, "wall");
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2));
        wallA.body.setImmovable(true);
        wallA.body.setCollideWorldBounds(true);
        //CMD + D to select all wallBs.
        let wallB = this.physics.add.sprite(0, height/2, "wall");
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2));
        wallB.body.setImmovable(true);

        this.walls = this.add.group([wallA, wallB]);

        //one way wall
        this.oneway = this.physics.add.sprite(0, height/4 * 3, "oneway");
        this.oneway.setX(Phaser.Math.Between(0 + this.oneway.width/2, width - this.oneway.width/2));
        this.oneway.body.setImmovable(true);
        this.oneway.body.checkCollision.down = false;

        //shot constants
        this.SHOT_VELOCITY_X = 200;
        this.SHOT_VELOCITY_Y_MIN = 700;
        this.SHOT_VELOCITY_Y_MAX = 1100;

        //mouse input
        this.input.on("pointerdown", (pointer) => {
            let shotDirectionY;
            let shotDirectionX;
            //? evaluates statement to true or false
            //: leads to the "else"
            pointer.y <= this.ball.y ? shotDirectionY = 1 : shotDirectionY = -1;
            pointer.x <= this.ball.x ? shotDirectionX = 1 : shotDirectionX = -1;
            this.ball.body.setVelocityX(Phaser.Math.Between(0, this.SHOT_VELOCITY_X) * shotDirectionX);
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY);
            this.shotCounter++;
            this.shotCounterText.destroy();
            this.shotCounterText = this.add.text(0, 0, "SHOTS TAKEN: " + this.shotCounter, textConfig);
        });

        //collision detection - create colliders
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            //ball & cup are new parameters. they just keep it clean scope-wise
            ball.setX(width/2);
            ball.setY(height - height/10);
            this.holeCounter++;
            this.holeCounterText = this.add.text(0, 30, "HOLES IN: " + this.holeCounter, textConfig);
            //update success percentage
            this.successPercent += this.holeCounter/this.shotCounter;
            this.successText = this.add.text(0, 60, "SUCCESS PERCENTAGE: " + this.successPercent + "%", textConfig);
        });
        this.physics.add.collider(this.ball, this.walls);
        this.physics.add.collider(this.ball, this.oneway);
    }

    update() {
        

    }
}