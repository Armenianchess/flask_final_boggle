class BoggleGame {

  constructor(myBoard, seconds = 60) {
    this.seconds = seconds; // game length
    this.displayTimer();

    this.record = 0;
    this.words = new Set();
    this.board = $("#" + myBoard);

    this.timer = setInterval(this.tick.bind(this), 1000);

    $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
  }


  showWord(word) {
    $(".words", this.board).append($("<li>", { text: word }));
  }


  showScore() {
    $(".record", this.board).text(this.record);
  }


  showMessage(msg, cls) {
    $(".msg", this.board)
      .text(msg)
      .removeClass()
      .addClass(`msg ${cls}`);
  }


  async handleSubmit(evt) {
    evt.preventDefault();
    const $word = $(".word", this.board);

    let word = $word.val();
    if (!word) return;

    if (this.words.has(word)) {
      this.showMessage(`Already found ${word}`, "err");
      return;
    }

    const resp = await axios.get("/check-word", { params: { word: word } });
    if (resp.data.result === "not-word") {
      this.showMessage(`${word} is not a valid English word`, "err");
    } else if (resp.data.result === "not-on-board") {
      this.showMessage(`${word} is not a valid word on this board`, "err");
    } else {
      this.showWord(word);
      this.record += word.length;
      this.showScore();
      this.words.add(word);
      this.showMessage(`Added: ${word}`, "ok");
    }

    $word.val("").focus();
  }


  displayTimer() {
    $(".timer", this.board).text(this.seconds);
  }


  async tick() {
    this.seconds -= 1;
    this.displayTimer();

    if (this.seconds === 0) {
      clearInterval(this.timer);
      await this.scoreGame();
    }
  }


  async scoreGame() {
    $(".add-word", this.board).hide();
    const resp = await axios.post("/post-score", { record: this.record });
    if (resp.data.brokeRecord) {
      this.showMessage(`New record: ${this.record}`, "ok");
    } else {
      this.showMessage(`Final score: ${this.record}`, "ok");
    }
  }
}
