class WaterDrop {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = random(50, CANVAS_WIDTH - 50);
        this.y = -20;
        
        const rand = random(1);
        if (rand < DROP_SIZES.SMALL.chance) {
            this.type = 'SMALL';
        } else if (rand < DROP_SIZES.SMALL.chance + DROP_SIZES.MEDIUM.chance) {
            this.type = 'MEDIUM';
        } else {
            this.type = 'LARGE';
        }

        const sizeConfig = DROP_SIZES[this.type];
        this.size = sizeConfig.size;
        this.points = sizeConfig.points;
        this.waterAmount = sizeConfig.waterAmount;
        
        let baseSpeed = this.type === 'SMALL' ? random(5, 7) :
                       this.type === 'MEDIUM' ? random(4, 6) :
                       random(3, 5);
                       
        let timeSpeedIncrease = min(gameTime * GAME_SPEED.SPEED_INCREASE, 8);
        this.speed = baseSpeed + timeSpeedIncrease;
        
        this.rotation = random(TWO_PI);
        this.rotationSpeed = random(-0.05, 0.05);
        this.horizontalSpeed = random(-1, 1); 
    }

    update() {
        this.y += this.speed;
        this.x += sin(this.y / 30) * this.horizontalSpeed;
        this.rotation += this.rotationSpeed;
        
        this.x = constrain(this.x, this.size/2, CANVAS_WIDTH - this.size/2);
        
        return this.y > CANVAS_HEIGHT;
    }

    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        
        if (dropImage) {
            imageMode(CENTER);
            image(dropImage, 0, 0, this.size, this.size);
        } else {
            fill(30, 144, 255, 200);
            ellipse(0, 0, this.size, this.size);
        }
        
        pop();
    }
} 