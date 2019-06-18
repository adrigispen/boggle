class Game {
  constructor(boardSize, playerNames, generous, scrabble) {
    this.board = new Board(boardSize);
    this.players = [];
    playerNames.forEach(name => {
      let newPlayer = new Player(name);
      newPlayer.addToBoard(name);
      this.players.push(newPlayer);
    });
    this.generous = generous;
    this.scrabble = scrabble;
    //this.timer = new Timer();
  }

  setup() {
    this.background = loadImage("../images/layton-diament-18618-unsplash.jpg");
    this.board.setup();
  }
  
  draw() {
    //image(this.background, 0, 0, this.background.width/5, this.background.height/5);
    this.board.drawBoard();
    this.players.forEach(player => player.timer.draw(player.name));
    //this.timer.draw();

  }

  keyPressed() {
    if (keyCode == 13) {
      this.checkForWord();
      // clear();
      // document.getElementById("error").innerHTML = "";
      // let input = document.getElementById("word-entry");
      // this.board.highlightWord(input.value);
      // input.value = "";
    }
  }

  getCurrentPlayer() {
    return this.players.find(player => player.playingNow);
  }

  checkForWord() {
    clear();
    document.getElementById("error").innerHTML = "";
    let input = document.getElementById("word-entry");
    this.board.highlightWord(input.value, this.getCurrentPlayer());
    input.value = "";
    if (this.scrabble) this.changePlayer();
  }

  changePlayer() {
    for (var i=0; i<this.players.length; i++) {
      if (this.players[i].playingNow) {
        let newIndex = (i+1) % this.players.length;
        this.players[i].playingNow = false;
        document.getElementById(this.players[i].name + "-name").style.color = "#000";
        this.players[i].timer.stopTimer();
        this.players[newIndex].playingNow = true;
        document.getElementById(this.players[newIndex].name + "-name").style.color = "#4D0DF9";
        this.players[newIndex].timer.startTimer();
        break;
      }
    }
  }

  findAllWords() {
    document.getElementById("waiting").style.visibility = "visible";
    document.getElementById("waiting").style.display = "inline";
    let min = Number(document.getElementById("min").value);
    let max = Number(document.getElementById("max").value);
    if (min == 0 || max == 0) {
      setTimeout(() => this.board.findAllWords(3, 8), 100);
    } else {
      setTimeout(() => this.board.findAllWords(min, max), 100);
    }
  }

}