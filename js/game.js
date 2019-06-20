class Game {
  constructor(boardSize, playerNames, generous, speed, language) {
    this.board = new Board(boardSize, language, generous);
    this.players = [];
    this.generous = generous;
    this.speed = speed;
    this.language = language;
    this.isOver = false;
    playerNames.forEach((name, index) => {
      let pn = name == "" ? "Player " + Number(index+1) : name;
      let newPlayer = new Player(pn);
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
    if (this.isOver) {
      let winner = this.getWinner();
      this.players.forEach(player => {
        document.getElementById(player.name + "-name").style.color = player.color;
      });
      document.getElementById("word-entry").disabled = true;
      document.getElementById("enter-button").disabled = true;
      let button = document.getElementById("find-all");
      button.onclick = () => location.reload();
      button.style.backgroundColor = winner.color;
      button.innerHTML = "Play Again";
      this.board.drawBoard();
      var overlayColor = color("white");
      overlayColor.setAlpha(220);
      fill(overlayColor);
      strokeWeight(.1);
      rect(0, 0, WIDTH, HEIGHT);
      fill(color(winner.color));
      push();
      textStyle(BOLD);
      text(`${winner.name} WINS!`, WIDTH/2, HEIGHT/4);
      pop();
      push();
      textFont("Avenir");
      textSize(20);
      textAlign(CENTER, BOTTOM);
      let scoresList = this.getTopScoresList();
      text(scoresList, WIDTH/2, HEIGHT-100);
      pop();
    }
  }

  getTopScoresList() {
    let text = "";
    this.players.forEach(player => {
      text += `${player.name}: ${player.score} points, ${player.timer.currentTime} seconds! SCORE: ${player.finalScore.toFixed(2)}\n\n`;
    });
    return text;
  }
  
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
    input.disabled = true;
    if (this.speed) setTimeout(() => this.changePlayer(), 2000);
    setTimeout(clear, 2000);
  }

  changePlayer() {
    for (var i=0; i<this.players.length; i++) {
      if (this.players[i].playingNow) {
        let newIndex = (i+1) % this.players.length;
        this.players[i].playingNow = false;
        document.getElementById(this.players[i].name + "-name").style.color = "#000";
        document.getElementById(this.players[i].name + "-timer").style.color = "#000";
        document.getElementById("error").innerHTML = "";
        this.players[i].timer.stopTimer();
        this.players[newIndex].playingNow = true;
        document.getElementById(this.players[newIndex].name + "-name").style.color = this.players[newIndex].color;
        document.getElementById(this.players[newIndex].name + "-timer").style.color = this.players[newIndex].color;
        this.players[newIndex].timer.startTimer();
        break;
      }
    }
    let input = document.getElementById("word-entry");
    input.disabled = false;
    input.focus();
    
  }

  findAllWords() {
    document.getElementById("waiting").style.visibility = "visible";
    document.getElementById("waiting").style.display = "inline";
    setTimeout(() => this.board.findAllWords(this.language), 100);
    this.isOver = true;
  }

  getWinner() {
    this.players.map(player => {
      player.timer.stopTimer();
      player.finalScore = player.timer.currentTime == 0 ? 0 : (player.score/player.timer.currentTime)*100;
      return player;
    });
    this.players.sort((a, b) => b.finalScore - a.finalScore);
    return this.players[0].finalScore == 0 ? new Player("Boggle Bot") : this.players[0];
  }

  showSolutions() {
    this.findAllWords();
    document.getElementById("game").style.display = "initial";
    this.board.createHighlightedList();
  }

}