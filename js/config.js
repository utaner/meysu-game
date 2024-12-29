// Oyun sabitleri
const MAX_MISSED_DROPS = 3;
const MAX_WATER_LEVEL = 100;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;

// Fizik sabitleri
const PHYSICS = {
    GRAVITY: 0.6,
    JUMP_FORCE: -15,
    GROUND_Y: CANVAS_HEIGHT - 120
};

// Kedi sabitleri
const CAT = {
    WIDTH: 80,
    HEIGHT: 80,
    ATTACK_SPEED: 6,
    ATTACK_INTERVAL: 300,
    FRAME_COUNT: 7,
    ANIMATION_SPEED: 0.15,
    Y_OFFSET: 30,
    START_DISTANCE: 250
};

// Damla boyutları ve puanları
const DROP_SIZES = {
    SMALL: {
        size: 20,
        points: 5,
        waterAmount: 2,
        chance: 0.6
    },
    MEDIUM: {
        size: 30,
        points: 10,
        waterAmount: 4,
        chance: 0.3
    },
    LARGE: {
        size: 40,
        points: 20,
        waterAmount: 6,
        chance: 0.1
    }
};

// Oyun hızlanma sabitleri
const GAME_SPEED = {
    INITIAL_INTERVAL: 60,
    MIN_INTERVAL: 20,
    SPEED_INCREASE: 0.2,
    MAX_DROPS: 4
};

// Oyun durumu
let score = 0;
let gameOver = false;
let gameWon = false;
let gameStarted = false;
let missedDrops = 0;
let gameTime = 0;

// Ses efektleri
let collectSound;
let winSound;
let loseSound;
let catSound;

// Görseller
let dropImage;
let catSpritesheet;

// Renk sabitleri
const COLORS = {
    BOTTLE: {
        BODY: [220, 220, 255, 230],
        WATER: [30, 144, 255, 200],
        BRAND: [0, 102, 204]
    },
    BACKGROUND: {
        TOP: [135, 206, 235],
        BOTTOM: [70, 130, 180]
    },
    DROP: {
        MAIN: [65, 105, 225, 200], // Daha koyu mavi
        HIGHLIGHT: [255, 255, 255, 150],
        SHADOW: [25, 25, 112, 150] // Lacivert gölge
    }
}; 