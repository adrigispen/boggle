class Player {
  constructor(name) {
    this.name = name;
    this.timer = new Timer();
    this.words = [];
    this.score = 0;
    this.color = getRandomColor();
    this.playingNow = false;
  }

  setCurrentPlayer() {
    this.playingNow = true;
    document.getElementById(this.name + "-name").style.color = this.color;
    document.getElementById(this.name + "-timer").style.color = this.color;
    this.timer.startTimer();
  }

  addToBoard() {
    let parent = document.getElementById("player-display-list");
    let wrapper = document.createElement("div");
    wrapper.classList.add("player-display");
    let name = document.createElement("span");
    name.id = this.name + "-name";
    name.innerHTML = this.name;
    let timer = document.createElement("div");
    timer.id = this.name + "-timer";
    timer.classList.add("timer");
    let heading = document.createElement("h3");
    heading.classList.add("list-header");
    heading.innerHTML = "Words Found:";
    let score = document.createElement("div");
    score.id = this.name + "-score";
    score.classList.add("score");
    score.innerHTML = "pts: 0";
    let scoreTimeWrapper = document.createElement("div");
    scoreTimeWrapper.classList.add("score-time-wrapper");
    scoreTimeWrapper.appendChild(timer);
    scoreTimeWrapper.appendChild(score);
    let orderedList = document.createElement("ol");
    let listItems = document.createElement("div");
    listItems.id = this.name + "-player-list";
    let hr = document.createElement("hr");

    orderedList.appendChild(listItems);
    wrapper.appendChild(name);
    wrapper.appendChild(scoreTimeWrapper);
    //wrapper.appendChild(heading);
    wrapper.appendChild(orderedList);
    wrapper.appendChild(hr);

    parent.appendChild(wrapper);
    this.timer.draw(this.name);
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}