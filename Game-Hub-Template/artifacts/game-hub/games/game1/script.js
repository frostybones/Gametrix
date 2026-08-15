const canvas = document.getElementById('SnakeCanvas');
const ctx = canvas.getContext('2d');

const boardSize = 14; 
const tileSizewidth = canvas.width / boardSize; 
const tileSizeheight = canvas.height / boardSize; 

const color1 = 'rgb(6, 134, 23)'; 
const color2 = 'rgb(29, 199, 74)'; 
let snakeColor = 'rgb(39, 36, 36)';
let foodColor = 'rgb(255, 0, 0)';
let snakeposition = [{ x: 7, y: 7 },{x:6,y:7}];
let foodposition = { x: 3, y: 3 };
let running = false;
let lastDirection = 'ArrowRight';
let directionLocked = false;
let score = 0;
let partEaten = 0;
let lost=false
let highScore = 0;
const foodImage = new Image();
foodImage.onload = redraw;
foodImage.src = 'Snakeimages/apple1.png';

const spriteImages = {
  head_up: loadImage('Snakeimages/head_up.png'),
  head_down: loadImage('Snakeimages/head_down.png'),
  head_left: loadImage('Snakeimages/head_left.png'),
  head_right: loadImage('Snakeimages/head_right.png'),
  tail_up: loadImage('Snakeimages/tail_up.png'),
  tail_down: loadImage('Snakeimages/tail_down.png'),
  tail_left: loadImage('Snakeimages/tail_left.png'),
  tail_right: loadImage('Snakeimages/tail_right.png'),
  body_horizontal: loadImage('Snakeimages/body_horizontal.png'),
  body_vertical: loadImage('Snakeimages/body_vertical.png'),
  body_topleft: loadImage('Snakeimages/body_topleft.png'),
  body_topright: loadImage('Snakeimages/body_topright.png'),
  body_bottomleft: loadImage('Snakeimages/body_bottomleft.png'),
  body_bottomright: loadImage('Snakeimages/body_bottomright.png')
};



function loadImage(src) {
  const image = new Image();
  image.onload = redraw;
  image.src = src;
  return image;
}

function redraw() {
  drawBoard();
  drawSnake();
  makeFood();
  drawFood();

}

function drawBoard() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      
      if ((row + col) % 2 === 0) {
        ctx.fillStyle = color1;
      } else {
        ctx.fillStyle = color2;
      }
      ctx.fillRect(col * tileSizewidth, row * tileSizeheight, tileSizewidth, tileSizeheight);
    }
  }
}

function drawSnake() {
  snakeposition.forEach((part, index) => {
    const x = part.x * tileSizewidth;
    const y = part.y * tileSizeheight;

    if (index === 0) {
      const headImage = getHeadImage(lastDirection);
      if (headImage && headImage.complete && headImage.naturalWidth > 0) {
        ctx.drawImage(headImage, x, y, tileSizewidth, tileSizeheight);
        return;
      }
    }

    if (index === snakeposition.length - 1) {
      const tailImage = getTailImage(snakeposition[index - 1], part);
      if (tailImage && tailImage.complete && tailImage.naturalWidth > 0) {
        ctx.drawImage(tailImage, x, y, tileSizewidth, tileSizeheight);
        return;
      }
    }

    const bodyImage = getBodyImage(snakeposition[index - 1], part, snakeposition[index + 1]);
    if (bodyImage && bodyImage.complete && bodyImage.naturalWidth > 0) {
      ctx.drawImage(bodyImage, x, y, tileSizewidth, tileSizeheight);
      return;
    }

  
  });
}

function getDirection(from, to) {
  if (to.x < from.x) return 'ArrowLeft';
  if (to.x > from.x) return 'ArrowRight';
  if (to.y < from.y) return 'ArrowUp';
  if (to.y > from.y) return 'ArrowDown';
  return null;
}

function getHeadImage(direction) {
  if (direction === 'ArrowUp') return spriteImages.head_up;
  if (direction === 'ArrowDown') return spriteImages.head_down;
  if (direction === 'ArrowLeft') return spriteImages.head_left;
  if (direction === 'ArrowRight') return spriteImages.head_right;
  return null;
}

function getTailImage(previous, current) {
  const directionToPrevious = getDirection(current, previous);
  if (!directionToPrevious) return null;

  if (directionToPrevious === 'ArrowUp') return spriteImages.tail_down;
  if (directionToPrevious === 'ArrowDown') return spriteImages.tail_up;
  if (directionToPrevious === 'ArrowLeft') return spriteImages.tail_right;
  if (directionToPrevious === 'ArrowRight') return spriteImages.tail_left;
  return null;
}

function getBodyImage(previous, current, next) {
  if (!previous || !next) return null;

  const previousDirection = getDirection(current, previous);
  const nextDirection = getDirection(current, next);

  if (
    (previousDirection === 'ArrowLeft' && nextDirection === 'ArrowRight') ||
    (previousDirection === 'ArrowRight' && nextDirection === 'ArrowLeft')
  ) {
    return spriteImages.body_horizontal;
  }

  if (
    (previousDirection === 'ArrowUp' && nextDirection === 'ArrowDown') ||
    (previousDirection === 'ArrowDown' && nextDirection === 'ArrowUp')
  ) {
    return spriteImages.body_vertical;
  }

  if ((previousDirection === 'ArrowUp' && nextDirection === 'ArrowLeft') || (previousDirection === 'ArrowLeft' && nextDirection === 'ArrowUp')) {
    return spriteImages.body_topleft;
  }
  if ((previousDirection === 'ArrowUp' && nextDirection === 'ArrowRight') || (previousDirection === 'ArrowRight' && nextDirection === 'ArrowUp')) {
    return spriteImages.body_topright;
  }
  if ((previousDirection === 'ArrowDown' && nextDirection === 'ArrowLeft') || (previousDirection === 'ArrowLeft' && nextDirection === 'ArrowDown')) {
    return spriteImages.body_bottomleft;
  }
  if ((previousDirection === 'ArrowDown' && nextDirection === 'ArrowRight') || (previousDirection === 'ArrowRight' && nextDirection === 'ArrowDown')) {
    return spriteImages.body_bottomright;
  }

  return null;
}

function drawFood() {
  const x = foodposition.x * tileSizewidth;
  const y = foodposition.y * tileSizeheight;
  if (foodImage.complete && foodImage.naturalWidth > 0) {
    ctx.drawImage(foodImage, x, y, tileSizewidth, tileSizeheight);
    return;
  }
  ctx.fillStyle = foodColor;
  ctx.fillRect(x, y, tileSizewidth, tileSizeheight);
}


window.addEventListener('keydown', event => {
  if (directionLocked) return;
  if (snakeposition[0].y === -1 ||snakeposition[0].x === -1 ||snakeposition[0].y === boardSize ||snakeposition[0].x === boardSize)return;

  if (event.key === 'ArrowUp' && lastDirection != 'ArrowDown') {
      lastDirection = event.key;
      directionLocked = true;
  } else if (event.key === 'ArrowDown' && lastDirection != 'ArrowUp') {
      lastDirection = event.key;
      directionLocked = true;
  } else if (event.key === 'ArrowLeft' && lastDirection != 'ArrowRight') {
      lastDirection = event.key;
      directionLocked = true;
  } else if (event.key === 'ArrowRight' && lastDirection != 'ArrowLeft') {
      lastDirection = event.key;
      directionLocked = true;
  }
})

function moveSnake() {
  const previousPositions = snakeposition.map(part => ({ ...part }));
  const nextPositions = [];
  const head = { ...previousPositions[0] };
  if (lastDirection === 'ArrowUp') {
    head.y -= 1;
  } else if (lastDirection === 'ArrowDown') {
    head.y += 1;
  } else if (lastDirection === 'ArrowLeft') {
    head.x -= 1;
  } else if (lastDirection === 'ArrowRight') {
    head.x += 1;
  }
  nextPositions[0] = head;
  for (let i = 1; i < previousPositions.length; i++) {
    nextPositions[i] = { ...previousPositions[i - 1] };
  }

  snakeposition = nextPositions;
}
function tick() { 
  if (running) {
    setTimeout(() => {
      drawBoard();
      moveSnake();
      drawSnake();
      checkCollision();
      drawFood();
      updateScore();
      directionLocked = false;
      tick();
    }, 150);
  }
}  
function checkCollision() {
  snakeposition.forEach((part, index) => {
    if (index !== 0 && part.x === snakeposition[0].x && part.y === snakeposition[0].y ) {
      partEaten = index;
      lost = true;
      running = false;
      drawSnake();
      gameOver();
    }})
  if (snakeposition[0].x=== foodposition.x && snakeposition[0].y === foodposition.y) {
    makeFood();
    snakeposition.forEach((part, index) => {
      if (part.x === foodposition.x && part.y === foodposition.y) {
        makeFood();
      }
    });
    snakeposition.push({ ...snakeposition[snakeposition.length - 1] });
    score += 1;
    console.log(snakeposition);
  }
  if (snakeposition[0].x < 0){
    snakeposition[0].x = boardSize ;
  } 
  else if (snakeposition[0].x >= boardSize) {
    snakeposition[0].x = -1;
  }
  else if  (snakeposition[0].y < 0 ){
    snakeposition[0].y = boardSize ;
  }
  else if (snakeposition[0].y >= boardSize) {
    snakeposition[0].y = -1;
  }
  
}  
function startGame() {
  if (!running) {
    running = true;
    makeFood();
    snakeposition = [{ x: 7, y: 7 },{x:6,y:7}];
    lastDirection = 'ArrowRight';
    directionLocked = false;
    score = 0;
    partEaten = 0;
    lost=false
    tick();
  }
}
function resetGame() {
  running = false;
  makeFood();
  snakeposition = [{ x: 7, y: 7 },{x:6,y:7}];
  lastDirection = 'ArrowRight';
  directionLocked = false;
  score = 0;
  partEaten = 0;
  lost=false
  drawBoard();
  drawSnake();
  checkCollision();
  updateScore();
  
}
function makeFood() {
  let valid = false;
  while (!valid) {
    foodposition.x = Math.floor(Math.random() * boardSize);
    foodposition.y = Math.floor(Math.random() * boardSize);
    valid = !snakeposition.some(pos => pos.x === foodposition.x && pos.y === foodposition.y);
  }
}
function pauseGame() {
  if(lost) {
    return;
  }
  if (running) {
    running = false;
    document.getElementById('pauseBtn').innerText = 'Resume Game';
  }else {
    running = true;
    document.getElementById('pauseBtn').innerText = 'Pause Game';
    tick();
  }
}
function updateScore() {
  document.getElementById('score').innerText = `Score: ${score}`;
}
function updateHighScore() {
  if (score > highScore) {
    highScore = score;
  }
  document.getElementById('high-score').innerText = ` ${highScore}`;
}
function gameOver() {
  ctx.font='50px MV Bold';
  ctx.fillStyle='red';
  ctx.textAlign='center';
  ctx.fillText('Game Over',canvas.width/2,canvas.height/2);
  ctx.font='30px MV Bold';
  ctx.fillStyle='black';
  ctx.fillText(`Score: ${score}`,canvas.width/2,canvas.height/2 + 50);
  updateHighScore();
}

