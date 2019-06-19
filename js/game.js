class Game {
  constructor(boardSize, playerNames, generous, speed, language) {
    this.board = new Board(boardSize, language, generous);
    this.players = [];
    this.generous = generous;
    this.speed = speed;
    this.language = language;
    playerNames.forEach(name => {
      let newPlayer = new Player(name);
      this.players.push(newPlayer);
    });
  }

  setup() {
    this.board.setup();
    this.players.forEach(player => player.addToBoard(player.name));
  }
  
  draw() {
    this.board.drawBoard();
    this.players.forEach(player => player.timer.draw(player.name));

  }

  // MAKE THIS HAPPEN IN A FORM
  keyPressed() {
    if (keyCode == 13) {
      this.checkForWord();
    }
  }

  getCurrentPlayer() {
    return this.players.find(player => player.playingNow);
  }

  checkForWord() {
    clear();
    document.getElementById("error").innerHTML = "";
    let input = document.getElementById("word-entry");
    if (input.value == "") return;
    this.board.highlightWord(input.value, this.getCurrentPlayer(), this.language);
    input.value = "";
    if (this.speed) this.changePlayer();
  }

  changePlayer() {
    for (var i=0; i<this.players.length; i++) {
      if (this.players[i].playingNow) {
        let newIndex = (i+1) % this.players.length;
        this.players[i].playingNow = false;
        document.getElementById(this.players[i].name + "-name").style.color = "#000";
        document.getElementById(this.players[i].name + "-timer").style.color = "#000";
        this.players[i].timer.stopTimer();
        this.players[newIndex].playingNow = true;
        document.getElementById(this.players[newIndex].name + "-name").style.color = PLAYING_COLOR;
        document.getElementById(this.players[newIndex].name + "-timer").style.color = PLAYING_COLOR;
        this.players[newIndex].timer.startTimer();
        break;
      }
    }
  }

/* 
  interruptPlayer() {
    let message = document.getElementById("error");
    if (this.getCurrentPlayer().name == this.players[this.players.length -1].name) {
      console.log("here");
      message.innerHTML = "TIME'S UP!"
    } else {
      message.innerHTML = "TIME'S UP! Next player's turn starts soon...";
      this.changePlayer();
    }
  } */

  findAllWords(language) {
    document.getElementById("waiting").style.visibility = "visible";
    document.getElementById("waiting").style.display = "inline";
    let min = Number(document.getElementById("min").value);
    let max = Number(document.getElementById("max").value);
    if (min == 0 || max == 0) {
      setTimeout(() => this.board.findAllWords(3, 8, language), 100);
    } else {
      setTimeout(() => this.board.findAllWords(min, max, language), 100);
    }
  }

}