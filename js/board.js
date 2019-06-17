var dictionary = new Typo("en_US", false, false, { dictionaryPath: "../typo/dictionaries" });

class Board {
  constructor(dimension) {
    this.dimension = dimension;
    this.letterMatrix = [];
    for (var i=0; i<this.dimension; i++) {
      this.letterMatrix[i] = [];
      for (var j=0; j<this.dimension; j++) {
        this.letterMatrix[i].push(this.getRandomLetter().toUpperCase());
      }
    }
  }

  getRandomLetter() {
    return letters[Math.floor(Math.random()*letters.length)];
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

  highlightWord(word) {
    if (dictionary.check(word)) {
      let squares = this.findWord(word);
      if (Array.isArray(squares)) {
        squares.forEach(position => {
          console.log(position.row, position.col);
          fill(color("#E7FEDF"));
          rect(SQUARE_SIDE*position.col, SQUARE_SIDE*position.row, SQUARE_SIDE, SQUARE_SIDE);
        }); 
        document.getElementById("found").innerHTML += `<br>${word}`;
      } else {
        document.getElementById("error").innerHTML = `<h2>I'm sorry, ${word} isn't on the board!</h2>`;
      }
    } else {
      document.getElementById("error").innerHTML = `<h2>I'm sorry, ${word} is not a valid word in English.</h2>`;
    }
  }

  // put all indices where 1st letter matches into the paths array. 
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

// should use breadth-first search to check all words of X length, currently a huge mess
  generateAllPaths(paths, length) {
    let path = paths.shift();
    if (dictionary.check(this.getWordFromPath(path)) && this.getWordFromPath(path).length > 4) console.log(this.getWordFromPath(path));
    if (path.length < length) {
      let position = path[path.length-1];
      //console.log(path, position);
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
      //this.generateAllPaths(paths, length);
    } else {
      paths.forEach(path => {
        let word = this.getWordFromPath(path);
        if (word.length > 3 && dictionary.check(word)) {
          this.highlightWord(word);
          console.log(word);
        }
        if (path.length > length) paths.remove(path);
      });
    }
  }


  findAllWords(length) {
    let paths = [];
    for (var i=0; i<this.dimension; i++) {
      for (var j=0; j<this.dimension; j++) {
        paths.push([{row: i, col: j, letter: this.letterMatrix[i][j]}]);
      }
    }
    this.generateAllPaths(paths, length);
    //console.log(paths);
  }

  getWordFromPath(path) {
    return path.reduce((acc, val) => acc.concat(val.letter), "");
  }



}


