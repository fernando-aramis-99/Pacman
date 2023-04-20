const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

let fps = 30;
let oneBockSize = 20;
let wallColor = "#342DCA";
let wallSpaceWidth = oneBockSize / 1.4;
let wallOffset = (oneBockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";
let foodColor = "#FEB897";
let score = 0;
let ghosts = [];
let ghostCount = 4;
let lives = 3;
let foodCount = 0;

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

let ghostLocations = [
    {x: 0, y: 0},
    {x: 176, y: 0},
    {x: 0, y: 121},
    {x: 176, y: 121},
]

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],

    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],

    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],

    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],

    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
        if ((map)[i][j] == 2) {
            foodCount++;
        }
    }
}

let randomTargetsForGhosts = [
    {x: 1 * oneBockSize, y: 1 * oneBockSize},
    {x: 1 * oneBockSize, y: (map.length - 2) * oneBockSize},
    {x: (map[0].length - 2) * oneBockSize, y: oneBockSize},
    {x: (map[0].length - 2) * oneBockSize, y: (map.length - 2) * oneBockSize},
]

let gameLoop = () => {
    draw();
    update();
}
let update = () => {
    pacman.moveProcess();
    pacman.eat();
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
    }
    if (pacman.checkGhostCollision()) {
        console.log("hit");
        restartGame();
    }
    if(score >= foodCount) {
        drawWin();
        clearInterval(gameInterval);
    }
}
let restartGame = () => {
    createNewPacman();
    createGhosts();
    lives--;
    if (lives == 0) {
        gameOver();
    }
}
let gameOver = () => {
    drawGameOver();
    clearInterval(gameInterval);
}
let drawGameOver = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Game Over!", 150, 200);
}
let drawWin = () => {
    canvasContext.font = "20px emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Winner winner,", 0, 200);
    canvasContext.fillText("chicken dinner!", 0, 230);
}
let drawLives = () => {
    canvasContext.font = "20px emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "Lives: ",
        220,
        oneBockSize * (map.length + 1) + 10
    );
    for (let i = 0; i < lives; i++) {
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBockSize,
            0,
            oneBockSize,
            oneBockSize,
            350 + i * oneBockSize,
            oneBockSize * map.length + 10,
            oneBockSize,
            oneBockSize
        );
    }
}
    let drawScore = () => {
        canvasContext.font = "20px Emulogic";
        canvasContext.fillStyle = "white";
        canvasContext.fillText(
            "Score: " + score,
            0,
            oneBockSize * (map.length + 1) + 10
        );
    }
    let drawFoods = () => {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if ((map)[i][j] == 2) {
                    createRect(j * oneBockSize + oneBockSize / 3,
                        i * oneBockSize + oneBockSize / 3,
                        oneBockSize / 3,
                        oneBockSize / 3,
                        foodColor
                    );
                }
            }
        }
    }
    let drawGhosts = () => {
        for (let i = 0; i < ghosts.length; i++) {
            ghosts[i].draw();
        }
    }
    let draw = () => {
        createRect(0, 0, canvas.width, canvas.height, "black")
        drawWalls();
        drawFoods();
        pacman.draw();
        drawScore();
        drawGhosts();
        drawLives();
    }

    let gameInterval = setInterval(gameLoop, 1000 / fps);

    let drawWalls = () => {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                // Then it is a wall
                if (map[i][j] == 1) {
                    createRect(
                        j * oneBockSize,
                        i * oneBockSize,
                        oneBockSize,
                        oneBockSize,
                        wallColor
                    );
                    if (j > 0 && map[i][j - 1] == 1) {
                        createRect
                        (
                            j * oneBockSize,
                            i * oneBockSize + wallOffset,
                            wallSpaceWidth + wallOffset,
                            wallSpaceWidth,
                            wallInnerColor
                        );
                    }
                    if (j < map[0], length - 1 && map[i][j + 1] == 1) {
                        createRect
                        (
                            j * oneBockSize + wallOffset,
                            i * oneBockSize + wallOffset,
                            wallSpaceWidth + wallOffset,
                            wallSpaceWidth,
                            wallInnerColor
                        );
                    }
                    if (i > 0 && map[i - 1][j] == 1) {
                        createRect
                        (
                            j * oneBockSize + wallOffset,
                            i * oneBockSize,
                            wallSpaceWidth,
                            wallSpaceWidth + wallOffset,
                            wallInnerColor
                        );
                    }
                    if (i < map.length - 1 && map[i + 1][j] == 1) {
                        createRect
                        (
                            j * oneBockSize + wallOffset,
                            i * oneBockSize + wallOffset,
                            wallSpaceWidth,
                            wallSpaceWidth + wallOffset,
                            wallInnerColor
                        );
                    }
                }
            }
        }
    };

    let createNewPacman = () => {
        pacman = new Pacman(
            oneBockSize,
            oneBockSize,
            oneBockSize,
            oneBockSize,
            oneBockSize / 5
        );
    };

    let createGhosts = () => {
        ghosts = [];
        for (let i = 0; i < ghostCount; i++) {
            let newGhost = new Ghost(
                9 * oneBockSize + (i % 2 == 0 ? 0 : 1) * oneBockSize,
                10 * oneBockSize + (i % 2 == 0 ? 0 : 1) * oneBockSize,
                oneBockSize,
                oneBockSize,
                pacman.speed / 2,
                ghostLocations[i % 4].x,
                ghostLocations[i % 4].y,
                124,
                126,
                6 + i
            );
            ghosts.push(newGhost);
        }
    }

    createNewPacman();
    createGhosts();
    gameLoop();

    window.addEventListener("keydown", (event) => {
        let k = event.keyCode
        setTimeout(() => {
            if (k == 37 || k == 65) {
                //left
                pacman.nextDirection = DIRECTION_LEFT;
            } else if (k == 38 || k == 87) {
                //up
                pacman.nextDirection = DIRECTION_UP;
            } else if (k == 39 || k == 68) {
                //right
                pacman.nextDirection = DIRECTION_RIGHT;
            } else if (k == 40 || k == 83) {
                //bottom
                pacman.nextDirection = DIRECTION_BOTTOM;
            }
        }, 1);
    });