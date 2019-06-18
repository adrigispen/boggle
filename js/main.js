
const game = new Game();

function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("canvas");
  game.setup();
}

function draw() {
  game.draw();
  //game.players.forEach(player => game.updateBoard(player));
  
}

function keyPressed() {
  game.keyPressed();
}

function newGame() {
  let players = [...document.getElementsByClassName("player")];
  let generous = document.getElementById("generous").checked;
  let scrabble = document.getElementById("scrabble").checked;
  let boardSize = [...document.getElementsByName("dimension")].find(elem => elem.checked).value;
  console.log(players, generous, scrabble, boardSize);
  game = new Variant(boardSize, players, generous, scrabble);
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

document.getElementById("find-all").onclick = game.findAllWords.bind(game)
document.getElementById("enter-button").onclick = game.checkForWord.bind(game)
// (min, max);



