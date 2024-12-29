class Bottle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = CANVAS_WIDTH / 2;
        this.y = PHYSICS.GROUND_Y;
        this.width = 60;
        this.height = 90;
        this.speed = 8;
        this.waterLevel = 0;
        this.velocityY = 0;
        this.isJumping = false;
    }

    move() {
        if (!this.isJumping) {
            if (keyIsDown(LEFT_ARROW)) {
                this.x = max(this.width/2, this.x - this.speed);
            }
            if (keyIsDown(RIGHT_ARROW)) {
                this.x = min(CANVAS_WIDTH - this.width/2, this.x + this.speed);
            }
        }

        if (keyIsDown(UP_ARROW) && !this.isJumping) {
            this.jump();
        }

        this.velocityY += PHYSICS.GRAVITY;
        this.y += this.velocityY;

        if (this.y > PHYSICS.GROUND_Y) {
            this.y = PHYSICS.GROUND_Y;
            this.velocityY = 0;
            this.isJumping = false;
        }
    }

    jump() {
        this.velocityY = PHYSICS.JUMP_FORCE;
        this.isJumping = true;
    }

    draw() {
        push();
        fill(...COLORS.BOTTLE.BODY);
        rect(this.x - this.width/2, this.y - this.height, this.width, this.height, 5);
        
        fill(...COLORS.BOTTLE.WATER);
        let waterHeight = map(this.waterLevel, 0, MAX_WATER_LEVEL, 0, this.height);
        rect(this.x - this.width/2, this.y - waterHeight, this.width, waterHeight, 0, 0, 5, 5);
        
        fill(...COLORS.BOTTLE.BODY);
        rect(this.x - this.width/4, this.y - this.height - 20, this.width/2, 20, 2);

        textAlign(CENTER);
        textStyle(BOLD);
        fill(...COLORS.BOTTLE.BRAND);
        textSize(16);
        text("Meysu", this.x, this.y - this.height/2);
        pop();
    }

    addWater(drop) {
        this.waterLevel += drop.waterAmount;
        if (this.waterLevel >= MAX_WATER_LEVEL) {
            this.waterLevel = MAX_WATER_LEVEL;
            gameWon = true;
            if (winSound) winSound.play();
        } else if (collectSound) {
            collectSound.play();
        }
        return true;
    }

    catches(drop) {
        return (drop.y + drop.size/2 > this.y - this.height && 
                drop.y - drop.size/2 < this.y &&
                drop.x + drop.size/2 > this.x - this.width/2 &&
                drop.x - drop.size/2 < this.x + this.width/2);
    }
} 