var copy = function (obj) {
  var newObject = jQuery.extend(true, {}, obj);
  return newObject;
};
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}
var Cursor = function (jQueryString) {
  // private fields
  var element = jQuery(jQueryString);
  var cursor = "default";
  // public methods
  this.getCursor = function () {
    return cursor;
  };
  this.setCursor = function (cur) {
    cursor = cur;
    if (cursor == undefined) cursor = "default";
    element.css({
      cursor: cur,
    });
  };
};
var CanvasTextItem = function (text, sx, sy, ctx) {
  // private fields
  var fontSize = 30;
  var fontFamily = "sans-serif";
  // public fields
  this.text = text;
  this.textAlign = "start";
  this.color = "black";
  this.location = {
    sx: sx,
    sy: sy,
    ex: sx + ctx.measureText(this.text).width,
    ey: sy + this.fontSize,
  };
  // public methods
  this.setFontSize = function (fSize) {
    fontSize = fSize;
    ctx.font = this.getFont();
    this.location["ex"] =
      this.location["sx"] + ctx.measureText(this.text).width;
    this.location["ey"] = this.location["sy"] + fontSize;
  };
  this.setFontFamily = function (fFamily) {
    fontFamily = fFamily;
  };
  this.getFont = function () {
    var font = "";
    font += fontSize + "px ";
    font += fontFamily;
    return font;
  };
  this.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.textAlign = this.textAlign;
    ctx.font = this.getFont();
    ctx.fillText(
      this.text,
      this.location["sx"],
      this.location["sy"] + fontSize
    );
  };
};
var Painter = function (canvas) {
  // private fields
  var ctx = canvas.getContext("2d");
  var height = canvas.height;
  var width = canvas.width;
  var FPS = 60;
  var backgrounds = {
    menu: "#EEE",
    game: "#EEE",
  };
  var currentLocation;
  //menu
  var items = {
    menu: {
      H: new CanvasTextItem("Choice for Player-1", 20, 20, ctx),
      X: new CanvasTextItem("X", 70, 90, ctx),
      O: new CanvasTextItem("O", 180, 90, ctx),
    },
    game: {},
  };
  var doNotDraw = false;
  // private methods
  var drawLine = function (
    sx,
    sy,
    ex,
    ey,
    duration = 0,
    strokeStyle = "#000000",
    lineWidth = null
  ) {
    if (doNotDraw) {
      return;
    }
    ctx.strokeStyle = strokeStyle;
    if (lineWidth !== null) {
      ctx.lineWidth = lineWidth;
    } else {
      ctx.lineWidth = 2;
    }
    if (duration == 0) {
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    } else {
      var totalFrames = (FPS * duration) / 1000;
      var frame = 0;

      function frameAction() {
        if (frame >= totalFrames) {
          return;
        }
        if (doNotDraw) {
          return;
        }
        var linePart =
          frame > 0
            ? (1 / totalFrames) * (frame - 1)
            : (1 / totalFrames) * frame;
        var nextLinePart = (1 / totalFrames) * (frame + 1);
        var fsx = sx + (ex - sx) * linePart;
        var fsy = sy + (ey - sy) * linePart;
        var fex = sx + (ex - sx) * nextLinePart;
        var fey = sy + (ey - sy) * nextLinePart;
        if (frame >= totalFrames - 2) {
          fex = ex;
          fey = ey;
        }
        drawLine(fsx, fsy, fex, fey, 0, strokeStyle, lineWidth);
        frame++;
        setTimeout(frameAction, 1000 / FPS);
      }
      frameAction();
    }
  };
  var drawCircle = function (
    x,
    y,
    r,
    sAngle,
    eAngle,
    duration = 0,
    strokeStyle = "#000000",
    lineWidth = null
  ) {
    if (doNotDraw) {
      return;
    }
    ctx.strokeStyle = strokeStyle;
    if (lineWidth !== null) {
      ctx.lineWidth = lineWidth;
    } else {
      ctx.lineWidth = 2;
    }
    if (duration == 0) {
      ctx.beginPath();
      ctx.arc(x, y, r, sAngle, eAngle);
      ctx.stroke();
    } else {
      var totalFrames = (FPS * duration) / 1000;
      var frame = 0;

      function frameAction() {
        if (frame >= totalFrames) {
          return;
        }
        if (doNotDraw) {
          return;
        }
        var linePart =
          frame > 0
            ? (1 / totalFrames) * (frame - 1)
            : (1 / totalFrames) * frame;
        var nextLinePart = (1 / totalFrames) * (frame + 1);
        var fsAngle = sAngle + (eAngle - sAngle) * linePart;
        var feAngle = sAngle + (eAngle - sAngle) * nextLinePart;
        /*if(frame == totalFrames - 1){
				  fex = ex;
				  fey = ey;
				}*/
        drawCircle(x, y, r, fsAngle, feAngle, 0, strokeStyle, lineWidth);
        frame++;
        setTimeout(frameAction, 1000 / FPS);
      }
      frameAction();
    }
  };
  var drawX = function (
    x,
    y,
    w,
    duration = 0,
    strokeStyle = "#000000",
    lineWidth = null
  ) {
    if (doNotDraw) {
      return;
    }
    var dur1 = duration * 0.4;
    var dur2 = duration * 0.2;
    var dur3 = duration * 0.4;
    drawLine(x + w, y, x, y + w, dur1, strokeStyle, lineWidth);
    setTimeout(function () {
      drawLine(x, y, x + w, y + w, dur3, strokeStyle, lineWidth);
    }, dur1 + dur2);
  };
  var clear = function (timeOut) {
    doNotDraw = true;
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = backgrounds[currentLocation];
    ctx.fill();
    setTimeout(function () {
      doNotDraw = false;
    }, timeOut);
  };
  var configureItems = function () {
    var color = "black";
    var fSize = 80;
    switch (currentLocation) {
      case "menu":
        items["menu"]["X"].color = color;
        items["menu"]["X"].setFontSize(fSize);
        items["menu"]["O"].color = color;
        items["menu"]["O"].setFontSize(fSize);
        break;
      case "game":
        break;
    }
  };
  // public methods
  this.buildMap = function (duration = 0) {
    currentLocation = "game";
    var timeOut = 50;
    clear(timeOut);
    var indent = 10;
    var strokeStyle = "#121212";
    var lineWidth = 2;
    setTimeout(function () {
      drawLine(
        width / 3,
        indent,
        width / 3,
        height - indent,
        duration,
        strokeStyle,
        lineWidth
      );
      drawLine(
        (width * 2) / 3,
        height - indent,
        (width * 2) / 3,
        indent,
        duration,
        strokeStyle,
        lineWidth
      );
      drawLine(
        indent,
        height / 3,
        width - indent,
        height / 3,
        duration,
        strokeStyle,
        lineWidth
      );
      drawLine(
        width - indent,
        (height * 2) / 3,
        indent,
        (height * 2) / 3,
        duration,
        strokeStyle,
        lineWidth
      );
    }, timeOut + 10);
  };
  this.buildMenu = function () {
    currentLocation = "menu";
    var timeOut = 50;
    clear(timeOut);
    // configure and draw items
    configureItems();
    setTimeout(function () {
      for (var key in items["menu"]) {
        items["menu"][key].draw();
      }
    }, timeOut + 10);
  };
  this.getItemNameByPos = function (pos) {
    for (var key in items[currentLocation]) {
      if (
        items[currentLocation][key].location["sx"] < pos.x &&
        items[currentLocation][key].location["sy"] < pos.y &&
        items[currentLocation][key].location["ex"] > pos.x &&
        items[currentLocation][key].location["ey"] > pos.y
      ) {
        return key;
      }
    }
    return "background";
  };
  this.hover = function (itemName) {};
  this.click = function (itemName) {};
  this.drawChar = function (char, i, j, duration = 0) {
    var boxWidth = 100;
    var x = i * boxWidth + 20;
    var y = j * boxWidth + 20;
    var w = 60;
    var style = "black";
    var fSize = 5;
    switch (char) {
      case "O":
        var cx = (x + x + w) / 2;
        var cy = (y + y + w) / 2;
        drawCircle(cx, cy, w / 2, -Math.PI, Math.PI, duration, style, fSize);
        break;
      case "X":
        drawX(x, y, w, duration, style, fSize);
        break;
    }
  };
  this.makeLineOver = function (
    si,
    sj,
    ei,
    ej,
    duration = 0,
    strokeStyle = "#000000",
    lineWidth = null
  ) {
    sx = si * 100 + 50;
    sy = sj * 100 + 50;
    ex = ei * 100 + 50;
    ey = ej * 100 + 50;
    var plus = 40;
    var xDir = ex - sx == 0 ? 0 : ex - sx > 0 ? 1 : -1;
    var yDir = ey - sy == 0 ? 0 : ey - sy > 0 ? 1 : -1;
    sx -= xDir * plus;
    sy -= yDir * plus;
    ex += xDir * plus;
    ey += yDir * plus;
    drawLine(sx, sy, ex, ey, duration, strokeStyle, lineWidth);
  };
};
var Game = function () {
  // class decloration
  var Player = function (char, depth /*0-player/(1+)-EI*/) {
    // private fields
    var myTurn = false;
    var myChar = char;
    var myType = depth == 0 ? 0 : 1; /*0-player/1-EI*/
    var AIDelay = 500;
    var AIDepth = depth;
    // private methods
    var click0 = function (pos) {
      if (myTurn) {
        myTurn = false;
        turn(myChar, pos);
      }
    };
    var click1 = function (pos) {};
    var AIAction = function () {
      var gameBoardIsEmpty = true;
      for (var i in gameBoard)
        for (var j in gameBoard[i])
          if (gameBoard[i][j] != "-") {
            gameBoardIsEmpty = false;
          }
      var values = [];
      if (gameBoardIsEmpty) {
        for (var i in gameBoard)
          for (var j in gameBoard[i]) {
            values.push({
              value: 0,
              i: i,
              j: j,
            });
          }
      } else {
        values = getMovesValue(gameBoard, myChar, myChar, AIDepth);
      }
      var value = values[0];
      for (var i in values) {
        if (values[i].value > value.value) {
          value = values[i];
        }
      }
      var bestValues = [];
      for (var i in values) {
        if (values[i].value == value.value) {
          bestValues.push(values[i]);
        }
      }
      var randIndex = Math.floor(Math.random() * bestValues.length);
      value = bestValues[randIndex];
      setTimeout(function () {
        myTurn = false;
        turn(myChar, {
          i: value.i,
          j: value.j,
        });
      }, AIDelay);
    };
    var getMovesValue = function (board, char, charTurn, depth) {
      var values = [];
      var nextCharTurn;
      if (charTurn == "X") {
        nextCharTurn = "O";
      } else {
        nextCharTurn = "X";
      }
      var opponentChar;
      if (char == "X") {
        opponentChar = "O";
      } else {
        opponentChar = "X";
      }
      for (var i in board) {
        for (var j in board) {
          if (board[i][j] != "-") {
            continue;
          }
          var tempBoard = copy(board);
          tempBoard[i][j] = charTurn;
          var check = winCheck(tempBoard)[0];
          var val;
          if (check == "-") {
            if (depth <= 1) {
              val = 0;
            } else {
              var vals = getMovesValue(
                tempBoard,
                char,
                nextCharTurn,
                depth - 1
              );
              if (char == charTurn) {
                val = vals[0].value;
                for (var k in vals) {
                  if (vals[k].value < val) {
                    val = vals[k].value;
                  }
                }
              } else {
                val = vals[0].value;
                for (var k in vals) {
                  if (vals[k].value > val) {
                    val = vals[k].value;
                  }
                }
              }
            }
          } else {
            switch (check) {
              case char:
                val = 1;
                break;
              case opponentChar:
                val = -1;
                break;
              case "XO":
              case "OX":
                val = 0;
                break;
            }
          }
          values.push({
            value: val / 10,
            i: i,
            j: j,
          });
        }
      }
      return values;
    };
    // public methods
    this.click = function (pos) {
      switch (myType) {
        case 0:
          click0(pos);
          break;
        case 1:
          click1(pos);
          break;
      }
    };
    this.yourTurn = function () {
      myTurn = true;
      switch (myType) {
        case 0:
          break;
        case 1:
          AIAction();
          break;
      }
    };
    this.getChar = function () {
      return myChar;
    };
  };
  // private fields
  var canvas = document.getElementById("screen-canvas");
  var painter = new Painter(canvas);
  var cursor = new Cursor("#screen-canvas");
  // elemets
  var menuButton = jQuery(".menu-button");
  var replay = jQuery(".replay");
  var scoreBlock = jQuery(".score-block");
  var scoreX = jQuery(".player-block-1 .score");
  var scoreO = jQuery(".player-block-2 .score");
  var playerNameX = jQuery(".player-block-1 .player-name");
  var playerNameO = jQuery(".player-block-2 .player-name");
  var dropDowns = jQuery(".drop-downs");
  var dropDown1 = jQuery(".drop-down #player-1");
  var dropDown2 = jQuery(".drop-down #player-2");
  var gameBoard = [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ];
  var score = {
    X: 0,
    O: 0,
  };
  var players = [];
  var playerTurn;
  // menu/chooseChar/game
  var currentLocation;
  var possiblyWin = [
    {
      sx: 0,
      sy: 0,
      ex: 0,
      ey: 2,
    },
    {
      sx: 1,
      sy: 0,
      ex: 1,
      ey: 2,
    },
    {
      sx: 2,
      sy: 0,
      ex: 2,
      ey: 2,
    },
    {
      sx: 0,
      sy: 0,
      ex: 2,
      ey: 0,
    },
    {
      sx: 0,
      sy: 1,
      ex: 2,
      ey: 1,
    },
    {
      sx: 0,
      sy: 2,
      ex: 2,
      ey: 2,
    },
    {
      sx: 0,
      sy: 0,
      ex: 2,
      ey: 2,
    },
    {
      sx: 0,
      sy: 2,
      ex: 2,
      ey: 0,
    },
  ];
  var newGameTimeOut;
  // private methods
  var initialize = function () {
    currentLocation = "menu";
    addEvents();
  };
  var openMenu = function () {
    painter.buildMenu();
    currentLocation = "menu";
    menuButton.hide();
    scoreBlock.hide();
    clearTimeout(newGameTimeOut);
    reset();
    replay.hide();
    dropDowns.fadeIn();
  };
  var replayagain = function () {
    clearGameBoard();
    resetScore();

    resetGameBoard();
    window.setTimeout(function () {
      document.getElementById("new-game").style.display = "none";
    }, 2000);
  };
  var openGame = function () {
    dropDowns.hide();
    painter.buildMap(400);
    currentLocation = "game";
    updateScore();
    menuButton.fadeIn();
    scoreBlock.fadeIn();
    replay.fadeIn();
  };
  var resetScore = function () {
    score.X = 0;
    score.O = 0;
  };
  var resetGameBoard = function () {
    gameBoard = [
      ["-", "-", "-"],
      ["-", "-", "-"],
      ["-", "-", "-"],
    ];
  };
  var clearGameBoard = function () {
    painter.buildMap();
  };
  var reset = function () {
    resetScore();
    resetGameBoard();
  };
  var updateScore = function () {
    scoreX.html(score.X);
    scoreO.html(score.O);
  };
  var addEvents = function () {
    canvas.addEventListener("mousemove", function (event) {
      mouseMove(getMousePosition(event));
    });
    canvas.addEventListener("click", function (event) {
      mouseClick(getMousePosition(event));
    });
    menuButton.click(function () {
      openMenu();
    });
    replay.click(function () {
      window.setTimeout(function () {
        document.getElementById("new-game").style.display = "block";
      }, 0);

      replayagain();
    });
  };
  var getMousePosition = function (event) {
    var pos = {
      x: event.layerX,
      y: event.layerY,
    };
    return pos;
  };
  var mouseMove = function (pos) {
    var itemName = painter.getItemNameByPos(pos);
    painter.hover(itemName);
    switch (itemName) {
      case "background":
        cursor.setCursor("default");
        break;
      case "X":
        cursor.setCursor("pointer");
        break;
      case "O":
        cursor.setCursor("pointer");
        break;
      default:
        cursor.setCursor("default");
    }
  };
  var mouseClick = function (pos) {
    if (currentLocation == "game") {
      gameBoardClick(pos);
      return;
    }
    var itemName = painter.getItemNameByPos(pos);
    painter.click(itemName);
    switch (itemName) {
      case "background":
        break;
      case "X":
        initializePlayers("X", "O");
        toss();
        openGame();
        break;
      case "O":
        initializePlayers("O", "X");
        toss();
        openGame();
        break;
    }
  };
  var initializePlayers = function (char1, char2) {
    var depth1 = parseInt(dropDown1.val());
    var depth2 = parseInt(dropDown2.val());
    players[0] = new Player(char1, depth1);
    players[1] = new Player(char2, depth2);
  };
  var gameBoardClick = function (pos) {
    var i = Math.floor(pos.x / 100);
    var j = Math.floor(pos.y / 100);
    for (var key in players) {
      players[key].click({
        i: i,
        j: j,
      });
    }
  };
  var turn = function (char, pos) {
    if (currentLocation != "game") {
      return;
    }
    if (gameBoard[pos.i][pos.j] == "-") {
      painter.drawChar(char, pos.i, pos.j, 300);
      gameBoard[pos.i][pos.j] = char;
      var check = winCheck(gameBoard);
      winCheckAction(check);
    } else {
      players[playerTurn].yourTurn();
    }
    setScoreShowClass();
  };
  var setScoreShowClass = function () {
    var char = players[playerTurn].getChar();
    var className = "his-turn";
    if (char == "X") {
      playerNameO.removeClass(className);
      playerNameX.addClass(className);
    } else {
      playerNameX.removeClass(className);
      playerNameO.addClass(className);
    }
  };
  var changePlayerTurn = function () {
    if (playerTurn == 0) {
      playerTurn = 1;
    } else {
      playerTurn = 0;
    }
    players[playerTurn].yourTurn();
  };
  var toss = function () {
    if (Math.random() < 0.5) {
      playerTurn = 0;
    } else {
      playerTurn = 1;
    }
    players[playerTurn].yourTurn();
    setScoreShowClass();
  };
  var winCheck = function (board) {
    for (var i in possiblyWin) {
      var charLine = getCharLine(
        possiblyWin[i].sx,
        possiblyWin[i].sy,
        possiblyWin[i].ex,
        possiblyWin[i].ey,
        board
      );
      if (charLine == "XXX") {
        return ["X", possiblyWin[i]];
      }
      if (charLine == "OOO") {
        return ["O", possiblyWin[i]];
      }
    }
    for (var i in board) {
      for (var j in board[i]) {
        if (board[i][j] == "-") {
          return ["-"];
        }
      }
    }
    return ["XO"];
  };
  var mySound;
  mySound = new sound("music/sound.mp3");
  var error;
  error = new sound("music/error.mp3");
  var winCheckAction = function (check) {
    switch (check[0]) {
      case "X":
        score.X++;
        makeLineOver(check[1], 500);
        window.setTimeout(function () {
          document.getElementById("won-popup").style.display = "block";
          document.getElementById("confeti").style.display = "block";
        }, 0);
        window.setTimeout(function () {
          document.getElementById("won-popup").style.display = "none";
          document.getElementById("confeti").style.display = "none";
        }, 2500);
        mySound.play();
        break;
      case "O":
        score.O++;
        makeLineOver(check[1], 500);
        window.setTimeout(function () {
          document.getElementById("won-popup2").style.display = "block";
          document.getElementById("confeti").style.display = "block";
        }, 0);
        window.setTimeout(function () {
          document.getElementById("won-popup2").style.display = "none";
          document.getElementById("confeti").style.display = "none";
        }, 2500);
        mySound.play();
        break;
      case "XO":
        window.setTimeout(function () {
          document.getElementById("won-popup3").style.display = "block";
        }, 0);
        window.setTimeout(function () {
          document.getElementById("won-popup3").style.display = "none";
        }, 2000);
        error.play();
      case "OX":
        window.setTimeout(function () {
          document.getElementById("won-popup3").style.display = "block";
        }, 0);
        window.setTimeout(function () {
          document.getElementById("won-popup3").style.display = "none";
        }, 2000);
        error.play();
        break;
      default:
        changePlayerTurn();
        return;
    }
    newGameTimeOut = setTimeout(function () {
      if (currentLocation == "game") {
        updateScore();
        clearGameBoard();
        resetGameBoard();
        toss();
      }
    }, 3000);
  };
  var makeLineOver = function (points, timeOut) {
    if (Math.random() < 0.5) {
      // swap
      var tx = points.sx;
      var ty = points.sy;
      points.sx = points.ex;
      points.sy = points.ey;
      points.ex = tx;
      points.ey = ty;
    }
    setTimeout(function () {
      if (currentLocation == "game") {
        painter.makeLineOver(
          points.sx,
          points.sy,
          points.ex,
          points.ey,
          500,
          "black",
          4
        );
      }
    }, timeOut);
  };
  var getCharLine = function (sx, sy, ex, ey, board) {
    if (sx - ex == 1 || sx - ex == -1 || sy - ey == 1 || sy - ey == -1) {
      return "-";
    }
    charLine =
      board[sx][sy] + board[(sx + ex) / 2][(sy + ey) / 2] + board[ex][ey];
    return charLine;
  };
  // public methods
  this.start = function () {
    initialize();
    openMenu();
  };
};
jQuery(document).ready(function ($) {
  var game = new Game();
  game.start();
});

var COLORS,
  Confetti,
  NUM_CONFETTI,
  PI_2,
  canvas,
  confetti,
  context,
  drawCircle,
  drawCircle2,
  drawCircle3,
  i,
  range,
  xpos;
NUM_CONFETTI = 40;
COLORS = [
  [235, 90, 70],
  [97, 189, 79],
  [242, 214, 0],
  [0, 121, 191],
  [195, 119, 224],
];
PI_2 = 2 * Math.PI;
canvas = document.getElementById("confeti");
context = canvas.getContext("2d");
window.w = 0;
window.h = 0;
window.resizeWindow = function () {
  window.w = canvas.width = window.innerWidth;
  return (window.h = canvas.height = window.innerHeight);
};
window.addEventListener("resize", resizeWindow, !1);
window.onload = function () {
  return setTimeout(resizeWindow, 0);
};
range = function (a, b) {
  return (b - a) * Math.random() + a;
};
drawCircle = function (a, b, c, d) {
  context.beginPath();
  context.moveTo(a, b);
  context.bezierCurveTo(a - 17, b + 14, a + 13, b + 5, a - 5, b + 22);
  context.lineWidth = 2;
  context.strokeStyle = d;
  return context.stroke();
};
drawCircle2 = function (a, b, c, d) {
  context.beginPath();
  context.moveTo(a, b);
  context.lineTo(a + 6, b + 9);
  context.lineTo(a + 12, b);
  context.lineTo(a + 6, b - 9);
  context.closePath();
  context.fillStyle = d;
  return context.fill();
};
drawCircle3 = function (a, b, c, d) {
  context.beginPath();
  context.moveTo(a, b);
  context.lineTo(a + 5, b + 5);
  context.lineTo(a + 10, b);
  context.lineTo(a + 5, b - 5);
  context.closePath();
  context.fillStyle = d;
  return context.fill();
};
xpos = 0.9;
document.onmousemove = function (a) {
  return (xpos = a.pageX / w);
};
window.requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (a) {
      return window.setTimeout(a, 5);
    }
  );
})();
Confetti = (function () {
  function a() {
    this.style = COLORS[~~range(0, 5)];
    this.rgb =
      "rgba(" + this.style[0] + "," + this.style[1] + "," + this.style[2];
    this.r = ~~range(2, 6);
    this.r2 = 2 * this.r;
    this.replace();
  }
  a.prototype.replace = function () {
    this.opacity = 0;
    this.dop = 0.03 * range(1, 4);
    this.x = range(-this.r2, w - this.r2);
    this.y = range(-20, h - this.r2);
    this.xmax = w - this.r;
    this.ymax = h - this.r;
    this.vx = range(0, 2) + 8 * xpos - 5;
    return (this.vy = 0.7 * this.r + range(-1, 1));
  };
  a.prototype.draw = function () {
    var a;
    this.x += this.vx;
    this.y += this.vy;
    this.opacity += this.dop;
    1 < this.opacity && ((this.opacity = 1), (this.dop *= -1));
    (0 > this.opacity || this.y > this.ymax) && this.replace();
    if (!(0 < (a = this.x) && a < this.xmax))
      this.x = (this.x + this.xmax) % this.xmax;
    drawCircle(~~this.x, ~~this.y, this.r, this.rgb + "," + this.opacity + ")");
    drawCircle3(
      0.5 * ~~this.x,
      ~~this.y,
      this.r,
      this.rgb + "," + this.opacity + ")"
    );
    return drawCircle2(
      1.5 * ~~this.x,
      1.5 * ~~this.y,
      this.r,
      this.rgb + "," + this.opacity + ")"
    );
  };
  return a;
})();
confetti = (function () {
  var a, b, c;
  c = [];
  i = a = 1;
  for (b = NUM_CONFETTI; 1 <= b ? a <= b : a >= b; i = 1 <= b ? ++a : --a)
    c.push(new Confetti());
  return c;
})();
window.step = function () {
  var a, b, c, d;
  requestAnimationFrame(step);
  context.clearRect(0, 0, w, h);
  d = [];
  b = 0;
  for (c = confetti.length; b < c; b++) (a = confetti[b]), d.push(a.draw());
  return d;
};
step();
