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
        if (player.name == winner.name) {
          document.getElementById(winner.name + "-name").style.color = winner.color;
          document.getElementById(winner.name + "-timer").style.color = winner.color;
        } else {
          document.getElementById(player.name + "-name").style.color = "#000";
          document.getElementById(player.name + "-timer").style.color = "#000";
        }
      });
      document.getElementById("word-entry").disabled = true;
      document.getElementById("enter-button").disabled = true;
      document.getElementById("find-all").disabled = true;
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
      text(scoresList, WIDTH/2, HEIGHT);
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

  // endGame() {
  //   this.isOver = true;
  //   let winner = this.getWinner();
  //   let parent = document.getElementById("game-over");
  //   let wrapper = document.createElement("div");
  //   wrapper.classList.add("game-over");
  //   let html = `<h2>Congratuations, ${winner.name}!</h2><ol>`;
  //   this.players.forEach(player => {
  //     html += `<li>${player.name}: ${player.score}, ${player.timer.currentTime}. FINAL SCORE: ${player.finalScore.toFixed(2)}</li>`;
  //   });
  //   html += `</ol>`;
  //   wrapper.innerHTML = html;
  //   parent.appendChild(wrapper);
  //   let showSolns = document.createElement("button");
  //   showSolns.innerHTML = "Show all words";
  //   showSolns.onclick = () => this.showSolutions();
  //   parent.appendChild(showSolns);
  //   document.getElementById("game").style.display = "none";
  // }

  showSolutions() {
    this.findAllWords();
    document.getElementById("game").style.display = "initial";
    this.board.createHighlightedList();
  }

}