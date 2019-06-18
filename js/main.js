
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

document.getElementById("find-all").onclick = game.findAllWords.bind(game)
document.getElementById("enter-button").onclick = game.checkForWord.bind(game)
// (min, max);



