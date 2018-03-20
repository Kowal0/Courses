var game = (function() {

  var settings = {
    cellsize: 25,
    width: 15,
    height: 15,
    canvas: null,
    ctx: null
  };

  var init = function() {
    //draw grid
    drawGrid();
    snake.draw(snake.pieces[snake.pieces.length - 1]);
    food.draw(food.pos);
    snake.move();
  };

  var drawGrid = function() {
    settings.canvas = document.getElementById('canvas');
    settings.canvas.width = settings.cellsize * settings.width;
    settings.canvas.height = settings.cellsize * settings.height;
    settings.ctx = settings.canvas.getContext("2d");

    for (var i = 0; i < settings.height; i++) {
      for (var j = 0; j < settings.width; j++) {
        settings.ctx.moveTo(i*settings.cellsize, j*settings.cellsize);
        settings.ctx.beginPath();
        settings.ctx.lineTo(i*settings.cellsize, j*settings.cellsize + settings.cellsize);
        settings.ctx.lineTo(i*settings.cellsize + settings.cellsize, j*settings.cellsize + settings.cellsize);
        settings.ctx.lineTo(i*settings.cellsize + settings.cellsize, j*settings.cellsize);
        settings.ctx.lineTo(i*settings.cellsize, j*settings.cellsize);
        settings.ctx.closePath();
        settings.ctx.stroke();
      };
    };
  };

  var snake = {
    pieces: [[Math.floor(settings.width/2), Math.floor(settings.height/2)]],
    color: "#990000",
    direction: "down",
    speed: 200,
    move: function() {
      switch (snake.direction) {
        case "left":
          if (snake.pieces[snake.pieces.length-1][0] > 0 && !snake.checkCollision([snake.pieces[snake.pieces.length-1][0]-1, snake.pieces[snake.pieces.length-1][1]])) {
            snake.pieces.push([snake.pieces[snake.pieces.length-1][0]-1, snake.pieces[snake.pieces.length-1][1]]);
            snake.draw(snake.pieces[snake.pieces.length-1]);
            if (!snake.eat()) {
              snake.erase(snake.pieces.shift());
              }
            } else {
              console.log("Game Over!");
          }
          break;
        case "right":
          if (snake.pieces[snake.pieces.length-1][0]*settings.cellsize < settings.width*settings.cellsize - settings.cellsize && !snake.checkCollision([snake.pieces[snake.pieces.length-1][0]+1, snake.pieces[snake.pieces.length-1][1]])) {
            snake.pieces.push([snake.pieces[snake.pieces.length-1][0]+1, snake.pieces[snake.pieces.length-1][1]]);
            snake.draw(snake.pieces[snake.pieces.length-1]);
            if (!snake.eat()) {
              snake.erase(snake.pieces.shift());
            }
          } else {
            console.log("Game Over!");
          }
          break;
        case "up":
            if (snake.pieces[snake.pieces.length-1][1] > 0 && !snake.checkCollision([snake.pieces[snake.pieces.length-1][0], snake.pieces[snake.pieces.length-1][1]-1])) {
            snake.pieces.push([snake.pieces[snake.pieces.length-1][0], snake.pieces[snake.pieces.length-1][1]-1]);
            snake.draw(snake.pieces[snake.pieces.length-1]);
            if (!snake.eat()) {
              snake.erase(snake.pieces.shift());
              }
            } else {
              console.log("Game Over!");
          }
          break;
        case "down":
            if (snake.pieces[snake.pieces.length-1][1]*settings.cellsize < settings.height*settings.cellsize - settings.cellsize && !snake.checkCollision([snake.pieces[snake.pieces.length-1][0], snake.pieces[snake.pieces.length-1][1]+1])) {
            snake.pieces.push([snake.pieces[snake.pieces.length-1][0], snake.pieces[snake.pieces.length-1][1]+1]);
            snake.draw(snake.pieces[snake.pieces.length-1]);
            if (!snake.eat()) {
              snake.erase(snake.pieces.shift());
            }
          } else {
            console.log("Game Over!");
          }
          break;
      }
      setTimeout(snake.move, snake.speed);
    },
    eat: function() {
      if (snake.pieces[snake.pieces.length-1][0] === food.pos[0] && snake.pieces[snake.pieces.length-1][1] === food.pos[1]) {
        food.pos = getCoords();
        food.draw(food.pos);
        return true;
      } else {
        return false;
      }
    },
    draw: function(coords) {
      settings.ctx.fillStyle = this.color;
      settings.ctx.fillRect(settings.cellsize*coords[0]+2, settings.cellsize*coords[1]+2, settings.cellsize-4, settings.cellsize-4);
    },
    erase: function(coords) {
      settings.ctx.fillStyle = "#FFFFFF";
      settings.ctx.fillRect(settings.cellsize*coords[0]+2, settings.cellsize*coords[1]+2, settings.cellsize-4, settings.cellsize-4);
    },
    setDirection: function(dir) {
      snake.direction = dir;
    },
    checkCollision: function(coords) {
      for (var i = 0; i < snake.pieces.length; i++) {
        if (snake.pieces[i][0] === coords[0] && snake.pieces[i][1] === coords[1]) {
          return true;
        } else {
          return false;
        }
      }
    }
  };

  var getCoords = function() {
    var xPos = Math.floor(Math.random()*settings.width);
    var yPos = Math.floor(Math.random()*settings.height);
    for (var i = 0; i < snake.pieces.length; i++) {
      if (snake.pieces[i][0] === xPos || snake.pieces[i][1] === yPos) {
        return getCoords();
      }
    }
    return [xPos, yPos];
  };

  var food = {
    pos: getCoords(),
    color: "#009900",
    draw: function(coords) {
      settings.ctx.beginPath();
      settings.ctx.fillStyle = this.color;
      settings.ctx.arc(coords[0]*settings.cellsize+settings.cellsize/2, coords[1]*settings.cellsize+settings.cellsize/2, 9.5, 0, 2 * Math.PI);
      settings.ctx.fill();
    }
  };

  return {
    init: init,
    setSnakeDir: snake.setDirection
  };

})();

document.onkeyup = function(e) {
  switch(e.keyCode) {
    case 37:
        game.setSnakeDir("left");
        break;
    case 38:
        game.setSnakeDir("up");
        break;
    case 39:
        game.setSnakeDir("right");
        break;
    case 40:
        game.setSnakeDir("down");
        break;
  }
}

window.onload = function() {
  game.init();
};
