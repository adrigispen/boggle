class Player {
  constructor(name) {
    this.name = name;
    this.timer = new Timer();
    this.words = [];
    this.score = 0;
  }

  addToBoard() {
    let parent = document.getElementById("player-display-list");
    let wrapper = document.createElement("div");
    wrapper.classList.add("player-display");
    let name = document.createElement("span");
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
    score.innerHTML = "Score: 0";
    let orderedList = document.createElement("ol");
    let listItems = document.createElement("div");
    listItems.id = this.name + "-player-list";

    orderedList.appendChild(listItems);
    wrapper.appendChild(name);
    wrapper.appendChild(timer);
    wrapper.appendChild(heading);
    wrapper.appendChild(score);
    wrapper.appendChild(orderedList);

    parent.appendChild(wrapper);
    this.timer.draw(this.name);
  }
}