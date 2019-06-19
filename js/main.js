let game = null;

function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("canvas");
}

function draw() {
  if (game) game.draw();
  //game.players.forEach(player => game.updateBoard(player));
  
}

function keyPressed() {
  game.keyPressed();
}

function newGame() {
  let players = [...document.getElementsByClassName("player")].map(elem => elem.value);
  let generous = document.getElementById("generous").checked;
  let scrabble = document.getElementById("scrabble").checked;
  let boardSize = [...document.getElementsByName("dimension")].find(elem => elem.checked).value;
  let language = [...document.getElementsByName("language")].find(elem => elem.checked).value;
  console.log(players, generous, scrabble, boardSize);
  game = new Game(boardSize, players, generous, scrabble, language);
  game.setup();
  game.players[0].setCurrentPlayer();
  document.getElementById("settings").style.display = "none";
  document.getElementById("game").style.visibility = "visible";

  document.getElementById("find-all").onclick = (() => game.findAllWords(language)).bind(game)
  document.getElementById("enter-button").onclick = game.checkForWord.bind(game)
}

function addPlayerInput() {
  let playersList = document.getElementById("players-list");
  let row = document.createElement("div");
  let label = document.createElement("label");
  label.innerHTML = "Player Name";
  let input = document.createElement("input");
  input.type = "text";
  input.classList.add("player");
  row.appendChild(label);
  row.appendChild(input);
  row.classList.add("player-row");
  playersList.appendChild(row);
}


// (min, max);



