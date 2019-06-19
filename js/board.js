

class Board {
  constructor(dimension, language) {
    this.dimension = dimension;
    this.dictionary = new Typo(language, false, false, { dictionaryPath: "Typo.js-master/typo/dictionaries" });
    this.letterMatrix = [];
    for (var i=0; i<this.dimension; i++) {
      this.letterMatrix[i] = [];
      for (var j=0; j<this.dimension; j++) {
        this.letterMatrix[i].push(this.getRandomLetter(language).toUpperCase());
      }
    }
  }

  getRandomLetter(language) {
    if (language == "en_US") return en_US[Math.floor(Math.random()*en_US.length)];
    if (language == "de") return de[Math.floor(Math.random()*de.length)]
  }

  setup() {
    textFont("Avenir");
    textSize(60);
    textAlign(CENTER, CENTER);
  }

  drawBoard() {
    //draw letters
    for (var i=0; i<this.dimension; i++) {
      for (var j=0; j<this.dimension; j++) {
        fill(0);
        text(this.letterMatrix[i][j], j*SQUARE_SIDE + SQUARE_SIDE/2, i*SQUARE_SIDE + SQUARE_SIDE/2);
      }
      //draw lines
      line(0, i*SQUARE_SIDE, SQUARE_SIDE*this.dimension, i*SQUARE_SIDE);
      line(i*SQUARE_SIDE, 0, i*SQUARE_SIDE, SQUARE_SIDE*this.dimension);
    }
    //draw final lines
    line(0, this.dimension*SQUARE_SIDE, SQUARE_SIDE*this.dimension, this.dimension*SQUARE_SIDE);
    line(this.dimension*SQUARE_SIDE, 0, SQUARE_SIDE*this.dimension, this.dimension*SQUARE_SIDE);
  }

  highlightWord(word, player, language) {
    let error = document.getElementById("error");
    if (language == "de") word = word.toUpperCase();
    if (this.dictionary.check(word)) {
      let squares = this.findWord(word);
      if (Array.isArray(squares)) {
        squares.forEach(position => {
          console.log(position.row, position.col);
          fill(color("#E7FEDF"));
          rect(SQUARE_SIDE*position.col, SQUARE_SIDE*position.row, SQUARE_SIDE, SQUARE_SIDE);
        }); 
        if (!game.players.map(player => player.words).reduce((acc, cv) => acc.concat(cv), []).includes(word)) {
          document.getElementById(player.name + "-player-list").innerHTML += `<li>${word}</li>`;
          player.score += word.length*10;
          player.words.push(word);
          document.getElementById(player.name + "-score").innerHTML = `Score: ${player.score}`;
        } else {
          error.innerHTML = `<h2>${word[0].toUpperCase() + word.slice(1)} already found!</h2>`;
        }
        
      } else {
        error.innerHTML = `<h2>I'm sorry, ${word} isn't on the board!</h2>`;
      }
    } else {
      let lang = language == "de" ? "German" : "English";
      error.innerHTML = `<h2>I'm sorry, ${word} is not a valid word in ${lang}.</h2>`;
    }
  }

  
// checks if words are on the board

  findWord(word) {
    let paths = [];
    let letter = word[0].toUpperCase();
    for (var i=0; i<this.dimension; i++) {
      for (var j=0; j<this.dimension; j++) {
        if (this.letterMatrix[i][j] == letter) {
          let path = [{row: i, col: j, letter: letter}];
          paths.push(path);
        }
      }
    }
    return this.checkNeighbors(paths, word.toUpperCase());
  }

  checkNeighbors(paths, fullWord) {
    if (paths.length == 0) return "nothing found";
    let path = paths.pop();
    if (path.length == fullWord.length) return path;
    let next = fullWord[path.length];
    let position = path[path.length-1];
    
    let rowStart = position.row - 1 < 0 ? 0 : position.row - 1;
    let colStart = position.col - 1 < 0 ? 0 : position.col - 1;
    let rowEnd = position.row + 2 > this.dimension ? this.dimension : position.row + 2;
    let colEnd = position.col + 2 > this.dimension ? this.dimension : position.col + 2;
    for (var i=rowStart; i< rowEnd; i++) {
      for (var j=colStart; j< colEnd; j++) {
        if (this.letterMatrix[i][j] == next && !(position.row == i && position.col == j) && !this.alreadyUsed(path, {row: i, col: j})) {
          if (path.length + 1 == fullWord.length) {
            paths = [];
            path.push({row: i, col: j, letter: next});
            return path;         
          } 
          let pathCopy = Array.from(path);
          pathCopy.push({row: i, col: j, letter: next});
          paths.push(pathCopy);
        }
      }
    }
    if (paths.length != 0) {
      console.log(paths);
      return this.checkNeighbors(paths, fullWord);
    }
    return ("nothing found");
  }

  alreadyUsed(path, position) {
    return path.find(elem => elem.row == position.row && elem.col == position.col);
  }




  // Print generated solutions

  findAllWords(min, max, language) {
    this.words = [];
    let paths = [];
    for (var i=0; i<this.dimension; i++) {
      for (var j=0; j<this.dimension; j++) {
        paths.push([{row: i, col: j, letter: this.letterMatrix[i][j]}]);
      }
    }
    let n=2;
    while (n<=max) {
      this.generateNextHopPaths(paths, n);
      n++;
    }
    paths.forEach(path => {
      if (path.length < min) {
        // do nothing
      } else {
        let word = this.getWordFromPath(path);
        let checkDictionary = language == "de" ? this.dictionary.check(word) : this.dictionary.check(word.toLowerCase());
        if (!this.words.includes(word) && checkDictionary) {
          this.words.push(word);
        }
      }
    });
    this.printAllWords();
    document.getElementById("waiting").style.visibility = "hidden";
    document.getElementById("waiting").style.display = "none";
  }

  getWordFromPath(path) {
    return path.reduce((acc, val) => acc.concat(val.letter), "");
  }

  generateNextHopPaths(paths, n) {
    paths.forEach(path => {
      if (path.length < n) {
        let position = path[path.length-1];
        let rowStart = position.row - 1 < 0 ? 0 : position.row - 1;
        let colStart = position.col - 1 < 0 ? 0 : position.col - 1;
        let rowEnd = position.row + 2 > this.dimension ? this.dimension : position.row + 2;
        let colEnd = position.col + 2 > this.dimension ? this.dimension : position.col + 2;
        for (var i=rowStart; i< rowEnd; i++) {
          for (var j=colStart; j< colEnd; j++) {
            if (!(position.row == i && position.col == j) && !this.alreadyUsed(path, {row: i, col: j})) {
              let pathCopy = Array.from(path);
              pathCopy.push({row: i, col: j, letter: this.letterMatrix[i][j]});
              paths.push(pathCopy);
            }
          }
        }
      }
    });
  }

  printAllWords() {
    let html = "";
    if (this.words.length == 0) {
      html += "No words found.";
    }
    this.words.forEach(word => html += `<li>${word}</li>`);
    document.getElementById("full-list").innerHTML = html;
  }

}


