let game = null;

function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("canvas");
}

function draw() {
  if (game) game.draw();
}

function keyPressed() {
  game.keyPressed();
}

function newGame() {
  let players = [...document.getElementsByClassName("player")].map(elem => elem.value);
  let generous = document.getElementById("generous").checked;
  let speed = document.getElementById("speed").checked;
  let boardSize = [...document.getElementsByName("dimension")].find(elem => elem.checked).value;
  let language = [...document.getElementsByName("language")].find(elem => elem.checked).value;
  console.log(players, generous, speed, boardSize);
  game = new Game(boardSize, players, generous, speed, language);
  game.setup();
  game.players[0].setCurrentPlayer();
  document.getElementById("settings").style.display = "none";
  document.getElementById("game").style.visibility = "visible";

  let findEndButton = document.getElementById("find-all");
  findEndButton.style.display = "inline-block";
  findEndButton.onclick = (() => game.findAllWords(language)).bind(game)
  document.getElementById("enter-button").onclick = game.checkForWord.bind(game)
  
}

function addPlayerInput() {
  let playersList = document.getElementById("players-list");
  let index = [...document.getElementsByClassName("player-row")].length;
  let button = document.getElementById("add-player");
  let row = document.createElement("div");
  let label = document.createElement("label");
  label.innerHTML = "Player Name";
  let inputButtonWrapper = document.createElement("div");
  inputButtonWrapper.classList.add("new-player-input");
  let input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Player " + Number(index+1);
  input.classList.add("player");
  let remove = document.createElement("button");
  remove.classList.add("remove");
  remove.type = "button";
  remove.innerHTML = "&#x1F5D1;";
  remove.onclick = this.removePlayerInput;
  inputButtonWrapper.appendChild(input);
  inputButtonWrapper.appendChild(remove);
  row.appendChild(label);
  row.appendChild(inputButtonWrapper);
  row.classList.add("player-row");
  playersList.insertBefore(row, button);
}

function removePlayerInput(e) {
  document.getElementById("players-list").removeChild(e.currentTarget.parentNode.parentNode);
}



