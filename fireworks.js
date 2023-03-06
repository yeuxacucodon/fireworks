var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext("2d");
var createRect = function (x, y, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
};

var gravity = -0.06;
var fireworkDelete;
var fireworks = [];
var subFireworks = [];
var countMultiplier = 10;
var fps = 60;

class Firework {
  constructor(x, y, radius, velocityX, velocityY, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
    this.opacity = 1;
  }

  update() {
    this.draw();
    this.velocityY -= gravity;
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.opacity -= 0.006;
    if (this.opacity < 0) this.opacity = 0;
  }

  draw() {
    canvasContext.save();
    canvasContext.globalAlpha = this.opacity;
    canvasContext.beginPath();
    canvasContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    canvasContext.fillStyle = this.color;
    canvasContext.fill();
    canvasContext.closePath();
    canvasContext.restore();
  }
}

function animate() {
  requestAnimationFrame(animate);
  update();
  draw();
}

var colors = ["#FFFFFF", "#FF0000", "#FFF300", "#51FF00", "#2300FF", "#FF00C1"];

var initializeCount = 0;
var maximumInitialize = 1;
var initDelay = 500; // ms
var fireworkRadius = 3;
var particleCount = 10;
var speedMultiplier = 10;

function update() {
  canvasContext.fillStyle = "rgba(0,0,0,0.1)";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  if (initializeCount < maximumInitialize) {
    var firework = new Firework(
      Math.random() * canvas.width,
      canvas.height + Math.random() * 70,
      fireworkRadius,
      3 * (Math.random() - 0.5),
      -12,
      colors[Math.floor(Math.random() * colors.length)]
    );
    fireworks.push(firework);
    setTimeout(function () {
      initializeCount--;
    }, initDelay);
    initializeCount++;
  }

  fireworks.forEach(function (firework, i) {
    if (firework.opacity <= 0.6) {
      fireworkDelete = fireworks.splice(i, 1);
      createSubFireworks(
        firework.x,
        firework.y,
        particleCount,
        firework.color,
        speedMultiplier
      );
      i--;
    } else {
      firework.update();
    }
  });

  subFireworks.forEach(function (firework, i) {
    if (firework.opacity < 0) {
      fireworkDelete = subFireworks.splice(i, 1);
      i--;
    } else {
      firework.update();
    }
  });
}

function createSubFireworks(x, y, count, color, speedMultiplier) {
  var created = 0;
  var radians = (Math.PI * 2) / count;

  while (created < count) {
    var firework = new Firework(
      x,
      y,
      fireworkRadius,
      Math.cos(radians * created) * Math.random() * speedMultiplier,
      Math.sin(radians * created) * Math.random() * speedMultiplier,
      color
    );
    subFireworks.push(firework);
    created++;
  }
}

function draw() {
  fireworks.forEach(function (firework) {
    firework.draw();
  });
  subFireworks.forEach(function (firework) {
    firework.draw();
  });
}

animate();

var setCanvasSizeAndVariables = function () {
  canvas.width = window.visualViewport.width;
  canvas.height = window.visualViewport.height;
};

window.addEventListener("resize", setCanvasSizeAndVariables);
setCanvasSizeAndVariables();
