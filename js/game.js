let bottle;
let waterDrops = [];
let cat;

function preload() {
    try {
        dropImage = loadImage('assets/waterdrop.png');
        catSpritesheet = loadImage('assets/cat_spritesheet.png');
    } catch (e) {
        console.log('Görseller yüklenemedi, yedek çizimler kullanılacak');
        dropImage = null;
        catSpritesheet = null;
    }

    try {
        soundFormats('mp3');
        collectSound = loadSound('sounds/collect.mp3');
        winSound = loadSound('sounds/win.mp3');
        loseSound = loadSound('sounds/lose.mp3');
        catSound = loadSound('sounds/cat.mp3');
    } catch (e) {
        console.log('Ses dosyaları yüklenemedi, oyun sessiz modda çalışacak');
        collectSound = null;
        winSound = null;
        loseSound = null;
        catSound = null;
    }
}

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    bottle = new Bottle();
    cat = new Cat();
}

function drawBackground() {
    for(let y = 0; y < CANVAS_HEIGHT; y++) {
        let inter = map(y, 0, CANVAS_HEIGHT, 0, 1);
        let c = lerpColor(
            color(...COLORS.BACKGROUND.TOP), 
            color(...COLORS.BACKGROUND.BOTTOM), 
            inter
        );
        stroke(c);
        line(0, y, CANVAS_WIDTH, y);
    }
}

function draw() {
    drawBackground();

    if (!gameStarted) {
        drawStartScreen();
    } else if (!gameOver && !gameWon) {
        updateGame();
        drawGame();
    } else {
        drawGameOver();
    }
}

function drawStartScreen() {
    fill(0, 0, 0, 180);
    rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    fill(255);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    
    textSize(64);
    text("MEYSU", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 120);
    
    textSize(24);
    textStyle(NORMAL);
    text("Su şişesini hareket ettirmek için", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 20);
    text("← → ok tuşlarını kullanın", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 50);
    
    if (frameCount % 60 < 30) {
        textSize(28);
        text("BAŞLAMAK İÇİN ENTER'A BASIN", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 120);
    }
}

function updateGame() {
    bottle.move();
    cat.update();

    if (cat.hits(bottle)) {
        gameOver = true;
        if (loseSound) loseSound.play();
        return;
    }

    if (frameCount % 60 === 0) {
        gameTime++;
    }

    let dropInterval = max(
        GAME_SPEED.INITIAL_INTERVAL - floor(gameTime / 5) * 2,
        GAME_SPEED.MIN_INTERVAL
    );

    if (frameCount % dropInterval === 0 && waterDrops.length < GAME_SPEED.MAX_DROPS) {
        let createChance = map(waterDrops.length, 0, GAME_SPEED.MAX_DROPS, 1, 0.3);
        if (random() < createChance) {
            waterDrops.push(new WaterDrop());
        }
    }

    for (let i = waterDrops.length - 1; i >= 0; i--) {
        let drop = waterDrops[i];
        
        if (bottle.catches(drop)) {
            waterDrops.splice(i, 1);
            score += drop.points;
            bottle.addWater(drop);
            if (gameWon) break;
            continue;
        }

        if (drop.update()) {
            waterDrops.splice(i, 1);
            missedDrops++;
            
            if (missedDrops >= MAX_MISSED_DROPS) {
                gameOver = true;
                if (loseSound) loseSound.play();
            }
        }
    }
}

function drawGame() {
    waterDrops.forEach(drop => drop.draw());
    bottle.draw();
    cat.draw();

    fill(255);
    textStyle(BOLD);
    textSize(24);
    textAlign(LEFT);
    text('Skor: ' + score, 20, 40);
    text('Kaçırılan: ' + missedDrops + '/' + MAX_MISSED_DROPS, 20, 70);
    text('Süre: ' + gameTime + ' sn', 20, 100);
    text('Su Seviyesi: %' + Math.round(bottle.waterLevel), 20, 130);
}

function drawGameOver() {
    background(0, 0, 0, 180);
    fill(255);
    textStyle(BOLD);
    textSize(48);
    textAlign(CENTER, CENTER);
    
    if (gameWon) {
        text('TEBRİKLER!', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 100);
        text('Şişe Doldu!', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 40);
    } else {
        text('OYUN BİTTİ!', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 60);
    }
    
    textSize(36);
    text('Toplam Skor: ' + score, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 20);
    text('Süre: ' + gameTime + ' saniye', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 70);
    textSize(24);
    text('Yeniden başlamak için ENTER tuşuna basın', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 120);
}

function keyPressed() {
    if (keyCode === ENTER) {
        if (!gameStarted) {
            gameStarted = true;
        } else if (gameOver || gameWon) {
            gameOver = false;
            gameWon = false;
            gameStarted = false;
            score = 0;
            missedDrops = 0;
            gameTime = 0;
            bottle.reset();
            cat.reset();
            waterDrops = [];
        }
    }
} 