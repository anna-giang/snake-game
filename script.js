let canvas;
let context;
let framerate = 1000/15;
let gamePlay;

// GAME VARIABLES
let posX = posY = 10; // Initial position of the snake head.
let blocksize = 20; // The size of each block in the snake.
let boardsize = 20; // The size of the playing field.
let appleX = appleY = 15; // Initial position of the apple.
// How much the snake is moving in the X and Y direction. 
// Initially the snake is not moving.
let movementX = movementY = 0; 
let trail = []; // The X and Y positions of each block of the snake.
let tail = 5; // The initial length of the tail.
let bestScore = tail; // The best score in the session so far, initially starting length of tail

// When the window loads, call startGame();
window.onload = function () {
  setupGame();
  startGame();
};

/**
 * Sets the 'canvas' and 'context' variables, and
 * adds a 'keydown' event listener to the document.
 */
function setupGame() {
  canvas = document.getElementById('game-canvas');
  context = canvas.getContext('2d');
  // Whenever the user presses a key, call keyPush()
  document.addEventListener("keydown", keyPush);
  // Set up the scoreboard.
  // Add the current scores to the innerText of the <p> elements.
  document.getElementById('current-score').innerText = tail;
  document.getElementById('best-score').innerText = bestScore;
}

/**
 * Sets an interval to call game() function every framerate
 * number of seconds.
 */
function startGame() {
  gamePlay = setInterval(game, framerate);
  setupPauseStartButton(false);
}

function game() {
  // Update the scoreboard to reflect current game status
  // The current score is the length of the tail now.
  document.getElementById('current-score').innerText = tail;
  // If we have a new best score, update the best score
  if (tail > bestScore) {
    bestScore = tail;
    document.getElementById('best-score').innerText = bestScore;
  }

  // Move the head of the snake in the current direction indicated 
  // by movementX and movementY
  posX += movementX;
  posY += movementY;
  
  // Wrap the snake around the edges
  if (posX < 0) {
    // If the snake head runs off the LEFT of the board,
    // wrap around 
    posX = boardsize - 1;
  }
  if (posX > boardsize - 1) {
    // If the snake head runs off the RIGHT of the board,
    // wrap around 
    posX = 0;
  }
  if (posY < 0) {
    // If the snake head runs off the TOP of the board,
    // wrap around
    posY = boardsize - 1;
  }
  if (posY > boardsize - 1) {
    // If the snake head runs off the BOTTOM of the board,
    // wrap around
    posY = 0;
  }

  // Colour the whole canvas in black.
  context.fillStyle = "black"; 
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Rendering the snake.
  context.fillStyle = "lime";
  for (var i = 0; i < trail.length; i++) {
    // For every block in the snake body, draw a square
    // Note: 'blocksize - 2' to leave a space between blocks.
    context.fillRect(
      trail[i].x * blocksize, // x-coord of upper-left
      trail[i].y * blocksize, // y-coord of upper-left 
      blocksize - 2, // Width
      blocksize - 2  // Height
    );
    // If the the snake bites itself anywhere, reset the tail length
    if (trail[i].x == posX && trail[i].y == posY) {
      tail = 5;
    }
  }
  
  // Push the current head of the snake as an object to the trail
  trail.push({
    x: posX, 
    y: posY 
  }); 

  // For every extra block in the trail that is longer than 
  // the snake, remove it.
  // This makes it look like the snake is moving as a whole, 
  // but the code is actually just repeatedly adding a green 
  // blocks at the head of the snake everytime game() is called, 
  // and then removing the blocks first-in-first-out style.
  // Change the frame-rate to see this in action. 
  while (trail.length > tail) {
    trail.shift(); 
  }
  
  // If the snake eats the apple, extend the tail length by 1 
  // and randomly place the apple to a new position.
  if (appleX == posX && appleY == posY) {
    tail++;
    appleX = Math.floor(Math.random() * boardsize);
    appleY = Math.floor(Math.random() * boardsize);
  }
  // Render the apple.
  context.fillStyle = "red";
  context.fillRect(
    appleX * blocksize, 
    appleY * blocksize, 
    blocksize - 2, 
    blocksize - 2
  );
}

/**
 * Function called when a keyboard key is pressed.
 * Currently changes the direction of the snake accordingly
 * to the arrow keys.
 * @param {DOM Event} evt The 'keydown' event
 */
function keyPush(evt) {
  switch (evt.keyCode) {
    case 37: // Left arrow key
      movementX = -1;
      movementY = 0;
      break;
    case 38: // Up arrow key
      movementX = 0;
      movementY = -1;
      break;
    case 39: // Right arrow key
      movementX = 1;
      movementY = 0;
      break;
    case 40: // Down arrow key
      movementX = 0;
      movementY = 1;
      break;
  }
}

/** 
 * Pauses the gameplay by clearing the setInterval
 * as held in variable 'gamePlay'.
 */
function pauseGame() {
  clearInterval(gamePlay);
  setupPauseStartButton(true);
}

/** 
 * Changes the 'pause-start-button' button into a 
 * pause button or start button depending on the value
 * of the pauseState parameter
 * @param {boolean} paused True or false whether the game 
 * is currently paused.
 */
function setupPauseStartButton(paused) {
  let button = document.getElementById('pause-start-button');
  if (paused) {
    // Make into a start button
    button.innerText = 'Start';
    button.onclick = function(){startGame()};
  } else {
    button.innerText = 'Pause';
    button.onclick = function(){pauseGame()};
  }
}
