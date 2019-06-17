class Timer {
  constructor() {
    this.currentTime = 0;
    this.intervalId = setInterval(() => {
      this.currentTime += 1;
    }, 1000);
  }

  draw() {
    document.getElementById("timer").innerHTML = this.getTime();
  }

  getTime() {
    return `${Math.floor(this.currentTime/60)} minutes, ${Math.floor(this.currentTime % 60)} seconds`; 
  }

  stopTimer() {
    clearInterval(this.intervalId);
  }

  resetTimer() {
    this.currentTime = 0;
  }
}