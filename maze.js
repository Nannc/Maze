var canvas;
var ctx; // the context allows us to draw
var output;

// width abd height of the canvas's bottom right corner
var width = 1200;
var height = 800;

// to draw the grid
tile_width = 20;
tile_hight = 20;

// rows and columns
rows_count = 25;
columns_count = 40;

dragok = false; // ???????????????

boundX = 0;
boundY = 0;

// a double array of tiles
var tiles = [];
for (c = 0; c < columns_count; c++) {
  tiles[c] = []; // for the columns' creation
  for (r = 0; r < rows_count; r++) {
    tiles[c][r] = {
      x: c * (tile_width + 3),
      y: r * (tile_hight + 3),
      state: "e"
    }; // the information about the tile
  }
}
tiles[0][0].state = "s";
tiles[columns_count - 1][rows_count - 1].state = "f";

function rect(x, y, w, h, state) {
  if (state === "s") {
    ctx.fillStyle = 'green';
  } else if (state === "f") {
    ctx.fillStyle = 'red';
  } else if (state === "e") {
    ctx.fillStyle = 'gray';
  } else if (state === "w") {
    ctx.fillStyle = 'black';
  } else if (state === "x") {
    ctx.fillStyle = 'orange';
  }else {
    ctx.fillStyle = 'gray';
  }

  ctx.beginPath();
  ctx.fillRect(x, y, w, h);
  ctx.closePath();
  ctx.fill();
}

// to clear the canvas from top left to bottom right
function clear() {
  ctx.clearRect(0, 0, width, height);
}


function draw() {
  clear();

  for (c = 0; c < columns_count; c++) {
    for (r = 0; r < rows_count; r++) {
      rect(tiles[c][r].x, tiles[c][r].y, tile_width, tile_hight, tiles[c][r].state);
    }
  }
}

function solveMaze() {
  // Breadth first search algorithm as it uses queue
  // this can be done with one queue
  var Xqueue = [0]; //  the Xqueue keeps track of the x coordinates
  var Yqueue = [0]; //  the Yqueue keeps track of the y coordinates

  var pathFound = false;

  var Xlocation;
  var Ylocation;

  while (Xqueue.length > 0 && !pathFound) {
    Xlocation = Xqueue.shift();
    Ylocation = Yqueue.shift();

    if (Xlocation > 0) {
      if (tiles[Xlocation - 1][Ylocation].state === "f") {
        pathFound = true;
      }
    }
    if (Xlocation < columns_count - 1) {
      if (tiles[Xlocation + 1][Ylocation].state === "f") {
        pathFound = true;
      }
    }
    if (Ylocation > 0) {
      if (tiles[Xlocation][Ylocation - 1].state === "f") {
        pathFound = true;
      }
    }
    if (Ylocation < rows_count - 1) {
      if (tiles[Xlocation][Ylocation + 1].state === "f") {
        pathFound = true;
      }
    }
    ////////
    if (Xlocation > 0) {
      if (tiles[Xlocation - 1][Ylocation].state === "e") {
        Xqueue.push(Xlocation - 1);
        Yqueue.push(Ylocation);
        tiles[Xlocation - 1][Ylocation].state = tiles[Xlocation][Ylocation].state + 'l';
      }
    }
    if (Xlocation < columns_count - 1) {
      if (tiles[Xlocation + 1][Ylocation].state === "e") {
        Xqueue.push(Xlocation + 1);
        Yqueue.push(Ylocation);
        tiles[Xlocation + 1][Ylocation].state = tiles[Xlocation][Ylocation].state + 'r';
      }
    }
    if (Ylocation > 0) {
      if (tiles[Xlocation][Ylocation - 1].state === "e") {
        Xqueue.push(Xlocation);
        Yqueue.push(Ylocation-1);
        tiles[Xlocation][Ylocation - 1].state = tiles[Xlocation][Ylocation].state + 'u';
      }
    }
    if (Ylocation < rows_count - 1) {
      if (tiles[Xlocation][Ylocation + 1].state === "e") {
        Xqueue.push(Xlocation);
        Yqueue.push(Ylocation+1);
        tiles[Xlocation][Ylocation + 1].state = tiles[Xlocation][Ylocation].state + 'd';
      }
    }
  } // end of loop

  if (!pathFound) {
    output.innerHTML = "There is no solution!";
  } else {
    output.innerHTML = "Solved!";

    var path = tiles[Xlocation][Ylocation].state;
    var pathLength = path.length;
    var currentX = 0;
    var currentY = 0;
    for (var i = 0; i < pathLength - 1; i++) {
      if (path.charAt(i + 1) === 'u') {
        currentY -= 1;
      }
      if (path.charAt(i + 1) === 'd') {
        currentY += 1;
      }
      if (path.charAt(i + 1) === 'r') {
        currentX += 1;
      }
      if (path.charAt(i + 1) === 'l') {
        currentX -= 1;
      }
      tiles[currentX][currentY].state = 'x';
    }

  }
} // end of method

function reset() {
  for (c = 0; c < columns_count; c++) {
    tiles[c] = []; // for the columns' creation
    for (r = 0; r < rows_count; r++) {
      tiles[c][r] = {
        x: c * (tile_width + 3),
        y: r * (tile_hight + 3),
        state: "e"
      };
    }
  }
  tiles[0][0].state = "s";
  tiles[columns_count - 1][rows_count - 1].state = "f";

  output.innerHTML = ''; // reset the parahraph
}

function init() {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d"); // a flat maze
  output = document.getElementById("outcome"); // target the parahraph
  return setInterval(draw, 10);
  // draw();
}

function mouseMove(e) {

  x = e.pageX - canvas.offsetLeft; // ?????????
  y = e.pageY - canvas.offsetTop; // ?????????

  for (c = 0; c < columns_count; c++) {
    for (r = 0; r < rows_count; r++) {
      if (c * (tile_width + 3) < x && x < c * (tile_width + 3) + tile_width && r * (tile_hight + 3) < y && y < r * (tile_hight + 3) + tile_hight) {
        if (tiles[c][r].state === "e" && (c != boundX || r != boundY)) { // to stop changing when the mouse is still moving at the same tile
          tiles[c][r].state = "w";
          boundX = c; //keep track of tiles
          boundY = r;
        } else if (tiles[c][r].state === "w" && (c != boundX || r != boundY)) {
          tiles[c][r].state = "e";
          boundX = c;
          boundY = r;
        }
      }
    }
  }

}

function mouseDown(e) {
  // call mouseMove whenever the user click the mouse down and drag
  canvas.onmousemove = mouseMove;

  x = e.pageX - canvas.offsetLeft; // ?????????
  y = e.pageY - canvas.offsetTop; // ?????????

  for (c = 0; c < columns_count; c++) {
    for (r = 0; r < rows_count; r++) {
      if (c * (tile_width + 3) < x && x < c * (tile_width + 3) + tile_width && r * (tile_hight + 3) < y && y < r * (tile_hight + 3) + tile_hight) {
        if (tiles[c][r].state === "e") {
          tiles[c][r].state = "w";
          boundX = c;
          boundY = r;
        } else if (tiles[c][r].state === "w") {
          tiles[c][r].state = "e";
          boundX = c;
          boundY = r;
        }
      }
    }
  }
}

function mouseUp() {
  // to stop dragging when user leaves the mouse
  canvas.onmousemove = null;
}


init();
// call mouseDown if the user click the mouse down
canvas.onmousedown = mouseDown;

canvas.onmouseup = mouseUp;
