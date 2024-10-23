class Board {
  constructor(size) {
    this.cells = document.getElementsByClassName("cell");
    this.size = this.getSize(size);
    this.emptyCells = this.cells.length;
    this.slot = document.getElementById("player-slot");
    this.currentPlayer = 0;
    this.rows = new Array(size).fill(0);
    this.cols = new Array(size).fill(0);
    this.tbDiagonal = 0
    this.btDiagonal = 0;

    this.registerListener(this.cells);
    this.displayCurrentPlayer();
  }

  getSize() {
    const size = Math.sqrt(this.cells.length);

    if (!Number.isInteger(size)) {
      throw new Error("Grid must be square");
    }

    return size
  }

  move(cell) {
    const pos = this.extractRowCol(cell);

    try {
      this.fillCell(pos.row, pos.col);
    } catch (e) {
      console.info(e.toString());
      return
    }

    const delta = this.currentPlayer === 0 ? 1 : -1;

    this.rows[pos.row] += delta
    this.cols[pos.col] += delta;

    if (pos.row === pos.col) this.tbDiagonal += delta;
    if (pos.row + pos.col === this.size - 1) this.btDiagonal += delta;

    this.captureWin();
    this.togglePlayer();
    this.displayCurrentPlayer();
    this.captureGameEnd();
  }

  captureWin() {
    for (let i = 0; i < this.rows.length; i++) {
      if (Math.abs(this.rows[i]) === this.size) {
        this.crossHorizontal(i);
      }
    }

    for (let i = 0; i < this.cols.length; i++) {
      if (Math.abs(this.cols[i]) === this.size) {
        this.crossVertical(i);
      }
    }

    if (Math.abs(this.tbDiagonal) === this.size) {
      this.crossTBDiagonal();
    }

    if (Math.abs(this.btDiagonal) === this.size) {
      this.crossBTDiagonal();
    }
  }

  captureGameEnd() {
    this.emptyCells--

    if (this.emptyCells <= 0) {
      alert("Game over")
    }
  }

  fillCell(row, col) {
    const cell = this.cells[row * this.size + col];
    if (cell.classList.length >= 2) {
      throw Error(`cell already filled`);
    }

    cell.classList.add(this.playerSymbol());
  }

  playerSymbol() {
    return this.currentPlayer === 0 ? 'X' : 'O';
  }

  togglePlayer() {
    this.currentPlayer = this.currentPlayer ^ 1;
  }

  registerListener(cells) {
    for (let cell of cells) {
      cell.addEventListener("click", () => this.move(cell))
    }
  }

  extractRowCol(cell) {
    const col = cell.getAttribute("col");
    const row = cell.getAttribute("row");

    return {col: Number(col), row: Number(row)};
  }

  cross(className, ...cells) {
    cells.map(cell => cell.classList.add(className));
  }

  crossHorizontal(row) {
    const cells = [];

    for (let i = 0; i < this.size; i++) {
      cells.push(this.cells[row * this.size + i])
    }

    this.cross("horizontal-line", ...cells)
  }

  crossVertical(col) {
    const cells = [];
    for (let i = 0; i < this.size; i++) {
      cells.push(this.cells[i * this.size + col])
    }

    this.cross("vertical-line", ...cells)
  }

  crossTBDiagonal() {
    const cells = [];

    for (let i = 0; i < this.size; i++) {
      cells.push(this.cells[i * this.size + i])
    }

    this.cross("tb-diagonal", ...cells)
  }

  crossBTDiagonal() {
    const cells = [];

    for (let i = 1; i <= this.size; i++) {
      cells.push(this.cells[(this.size - 1) * i])
    }

    this.cross("bt-diagonal", ...cells)
  }

  displayCurrentPlayer() {
    this.slot.innerText = this.playerSymbol();
  }
}

const board = new Board();
