class Timer {
  constructor() {
    this.currentTime = 0;
  }

  draw(name) {
    document.getElementById(name + "-timer").innerHTML = this.getTime();
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