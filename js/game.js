class Game {
  constructor() {
    this.board = new Board(3);
    this.players = [];
    this.timer = new Timer();
  }

  setup() {
    this.background = loadImage("../images/layton-diament-18618-unsplash.jpg");
    this.board.setup();
  }
  
  draw() {
    //image(this.background, 0, 0, this.background.width/5, this.background.height/5);
    this.board.drawBoard();
    this.timer.draw();

  }

  keyPressed() {
    if (keyCode == 13) {
      clear();
      document.getElementById("error").innerHTML = "";
      let input = document.getElementById("wordEntry");
      this.board.highlightWord(input.value);
      input.value = "";
    }
  }

}