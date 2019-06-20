class Game {
  constructor(boardSize, playerNames, generous, speed, language) {
    this.board = new Board(boardSize, language, generous);
    this.players = [];
    this.generous = generous;
    this.speed = speed;
    this.language = language;
    this.isOver = false;
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
        document.getElementById(this.players[newIndex].name + "-name").style.color = this.players[newIndex].color;
        document.getElementById(this.players[newIndex].name + "-timer").style.color = this.players[newIndex].color;
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

  findAllWords() {
    document.getElementById("waiting").style.visibility = "visible";
    document.getElementById("waiting").style.display = "inline";
    let min = Number(document.getElementById("min").value);
    let max = Number(document.getElementById("max").value);
    if (min == 0 || max == 0) {
      setTimeout(() => this.board.findAllWords(this.language), 100);
    } else {
      setTimeout(() => this.board.findAllWords(this.language), 100);
    }
  }

  getWinner() {
    this.players.map(player => {
      player.timer.stopTimer();
      player.finalScore = player.timer.currentTime == 0 ? 0 : (player.score/player.timer.currentTime)*100;
      return player;
    });
    console.log(this.players);
    this.players.sort((a, b) => b.finalScore - a.finalScore);
    console.log(this.players);
    return this.players[0];
  }

  endGame() {
    this.isOver = true;
    let winner = this.getWinner();
    let parent = document.getElementById("game-over");
    let wrapper = document.createElement("div");
    wrapper.classList.add("game-over");
    let html = `<h2>Congratuations, ${winner.name}!</h2><ol>`;
    this.players.forEach(player => {
      html += `<li>${player.name}: ${player.score}, ${player.timer.currentTime}. FINAL SCORE: ${player.finalScore.toFixed(2)}</li>`;
    });
    html += `</ol>`;
    wrapper.innerHTML = html;
    parent.appendChild(wrapper);
    let showSolns = document.createElement("button");
    showSolns.innerHTML = "Show all words";
    showSolns.onclick = () => this.showSolutions();
    parent.appendChild(showSolns);
    document.getElementById("game").style.display = "none";
  }

  showSolutions() {
    this.findAllWords();
    document.getElementById("game").style.display = "initial";
    this.board.createHighlightedList();
  }

}