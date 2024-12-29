class Cat {
    constructor() {
        this.reset();
    }

    reset() {
        this.direction = Math.random() < 0.5 ? 1 : -1;
        
        if (this.direction > 0) {
            this.x = -CAT.WIDTH - CAT.START_DISTANCE;
        } else {
            this.x = CANVAS_WIDTH + CAT.START_DISTANCE;
        }
        
        this.y = PHYSICS.GROUND_Y - CAT.Y_OFFSET;
        this.isAttacking = false;
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.attackTimer = 0;
    }

    update() {
        if (gameOver || gameWon) {
            return;
        }

        this.attackTimer++;
        if (this.attackTimer >= CAT.ATTACK_INTERVAL) {
            this.startAttack();
        }

        if (this.isAttacking) {
            this.x += this.direction * CAT.ATTACK_SPEED;
            
            if ((this.direction > 0 && this.x > CANVAS_WIDTH + CAT.START_DISTANCE) ||
                (this.direction < 0 && this.x < -CAT.WIDTH - CAT.START_DISTANCE)) {
                this.isAttacking = false;
                this.direction *= -1;
                if (this.direction > 0) {
                    this.x = -CAT.WIDTH - CAT.START_DISTANCE;
                } else {
                    this.x = CANVAS_WIDTH + CAT.START_DISTANCE;
                }
                this.attackTimer = 0;
            }

            this.frameCounter += CAT.ANIMATION_SPEED;
            if (this.frameCounter >= 1) {
                this.currentFrame = (this.currentFrame + 1) % CAT.FRAME_COUNT;
                this.frameCounter = 0;
            }
        } else {
            this.currentFrame = 0;
        }
    }

    startAttack() {
        if (!this.isAttacking && !gameOver && !gameWon) {
            this.isAttacking = true;
            if (catSound) catSound.play();
        }
    }

    draw() {
        push();
        imageMode(CENTER);
        translate(this.x + CAT.WIDTH/2, this.y);
        scale(this.direction, 1);
        
        if (catSpritesheet) {
            let frameWidth = 32;
            let frameHeight = 32;
            
            image(catSpritesheet, 
                  0, 0, 
                  CAT.WIDTH, CAT.HEIGHT,
                  this.currentFrame * frameWidth, 0,
                  frameWidth, frameHeight);
        } else {
            fill(200, 100, 100);
            rect(-CAT.WIDTH/2, -CAT.HEIGHT/2, CAT.WIDTH, CAT.HEIGHT);
        }
        
        pop();
    }

    hits(bottle) {
        if (gameOver || gameWon) return false;
        
        let hitboxReduction = 0.6;
        let catWidth = CAT.WIDTH * hitboxReduction;
        let catHeight = CAT.HEIGHT * hitboxReduction;
        
        return this.isAttacking && 
               abs(this.x + CAT.WIDTH/2 - bottle.x) < catWidth/2 + bottle.width/2.5 &&
               abs(this.y - (bottle.y - bottle.height/2)) < catHeight/2 + bottle.height/4;
    }
} 