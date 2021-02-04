/* eslint max-classes-per-file: ["error", 3] */

class Ball {
  constructor() {
    this.radius = 10;
    this.color = '#6f0b4d';
    this.x = 240;
    this.y = 330;
    this.dx = 2;
    this.dy = -2;
  }

  drawBall(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  move(canvas) {
    if (this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius) {
      this.dx = -this.dx;
    }

    if (this.y + this.dy > canvas.height - this.radius || this.y + this.dy < this.radius) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  determineLoss(canvas, paddle) {
    if (this.y + this.dy > canvas.height - this.radius) {
      if (this.x > paddle.x && this.x < paddle.x + paddle.width) {
        this.dy = -this.dy;
      } else {
        // eslint-disable-next-line no-alert
        alert('GAME OVER');
        document.location.reload();
      }
    }
  }
}

// ********************

class Brick {
  constructor(argX, argY, argStatus) {
    this.x = argX;
    this.y = argY;
    this.status = argStatus;
    this.color = '#6f0b4d';
    this.width = 75;
    this.height = 20;
  }

  drawBricks(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  detectCollision(ball) {
    if (ball.x > this.x && ball.x < this.x + this.width
      && ball.y > this.y && ball.y < this.y + this.height) {
      ball.dy = -ball.dy;
      this.status = 0;
    }
  }
}

// ********************

class Paddle {
  constructor(canvas) {
    this.color = '#6f0b4d';
    this.width = 75;
    this.height = 10;
    this.x = (canvas.width - this.width) / 2;
  }

  drawPaddle(canvas, ctx, rightPressed, leftPressed) {
    if (this.x > canvas.width - this.width) {
      this.x = canvas.width - this.width;
    } else if (rightPressed) {
      this.x -= 7;
    }

    if (this.x < 0) {
      this.x = 0;
    } else if (leftPressed) {
      this.x += 7;
    }

    ctx.beginPath();
    ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

// ********************

// initialization of canvas
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const ball = new Ball();

const brickRowCount = 5;
const brickColumnCount = 3;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    const brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
    const brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
    bricks[c][r] = new Brick(brickX, brickY, 1);
  }
}

const paddle = new Paddle(canvas);

let rightPressed = false;
let leftPressed = false;

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// render/draw objects on canvas
function render() {
  // clear canvas every interval
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // render objects
  ball.drawBall(ctx);
  ball.move(canvas);

  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
        bricks[c][r].drawBricks(ctx);
        bricks[c][r].detectCollision(ball);
      }
    }
  }

  paddle.drawPaddle(canvas, ctx, leftPressed, rightPressed);

  ball.determineLoss(canvas, paddle);

  requestAnimationFrame(render);
}
render();
