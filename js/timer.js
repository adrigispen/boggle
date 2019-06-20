class Timer {
  constructor() {
    this.currentTime = 0;
    // this.intervalId = setInterval(() => {
    //   this.currentTime += 1;
    // }, 1000);
  }

  draw(name) {
    document.getElementById(name + "-timer").innerHTML = this.getTime();
    // if (game.speed == false && this.currentTime >= 30) {
    //   this.stopTimer();
    //   game.interruptPlayer();
    // }
  }

  getTime() {
    return `${Math.floor(this.currentTime/60)} mins, ${Math.floor(this.currentTime % 60)} secs`; 
  }

  stopTimer() {
    clearInterval(this.intervalId);
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      this.currentTime += 1;
    }, 1000);
  }

  resetTimer() {
    this.currentTime = 0;
  }

}