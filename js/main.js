
const game = new Game();

function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("canvas");
  game.setup();
}

function draw() {
  game.draw();
  game.players.forEach(player => game.updateBoard(player));
  
}

function keyPressed() {
  game.keyPressed();
}

let min = Number(document.getElementById("min").value);
let max = Number(document.getElementById("max").value);
document.getElementById("find-all").onclick = game.board.findAllWords.bind(game.board)
// (min, max);



