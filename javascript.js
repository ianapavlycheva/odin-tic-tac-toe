const gameboard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  function getBoard() {
    return board;
  }

  function markCell(index, marker) {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  }

  function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
  }

  function isFull() {
    return board.every((cell) => cell !== "");
  }

  return {
    getBoard,
    markCell,
    resetBoard,
    isFull,
  };
})();

function createPlayer(name, marker) {
  return { name, marker };
}

const Game = (function () {
  let player1;
  let player2;
  let currentPlayer;
  let gameOver = false;

  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function start(name1, name2) {
    player1 = createPlayer(name1 || "Player 1", "X");
    player2 = createPlayer(name2 || "Player 2", "O");
    currentPlayer = player1;
    gameOver = false;
    gameboard.resetBoard();
    UI.updateBoard();
    UI.updateStatus(`${currentPlayer.name}'s turn`);
  }

  function playTurn(index) {
    if (gameOver) return;

    if (gameboard.markCell(index, currentPlayer.marker)) {
      UI.updateBoard();

      const winningCombo = checkWin(currentPlayer.marker);
      if (winningCombo) {
        gameOver = true;
        UI.showWinner(winningCombo);
        UI.updateStatus(`${currentPlayer.name} wins!`);
      } else if (gameboard.isFull()) {
        gameOver = true;
        UI.updateStatus("It's a tie!");
      } else {
        switchTurn();
        UI.updateStatus(`${currentPlayer.name}'s turn`);
      }
    }
  }

  function switchTurn() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  }

  function checkWin(marker) {
    const board = gameboard.getBoard();
    for (let combo of winCombos) {
      if (combo.every((index) => board[index] === marker)) {
        return combo;
      }
    }
    return null;
  }

  return {
    start,
    playTurn,
  };
})();

const UI = (function () {
  const boardElement = document.querySelector(".board");
  const statusElement = document.querySelector(".status");
  const startButton = document.getElementById("startBtn");
  const restartButton = document.getElementById("restartBtn");

  function showWinner(winningIndices) {
    const cells = document.querySelectorAll(".cell");

    cells.forEach((cell) => {
      cell.classList.add("disabled");
    });

    winningIndices.forEach((index) => {
      cells[index].classList.remove("disabled");
      cells[index].classList.add("win");
    });
  }

  function updateBoard() {
    const board = gameboard.getBoard();
    boardElement.innerHTML = "";

    board.forEach((cell, index) => {
      const div = document.createElement("div");
      div.classList.add("cell");
      div.textContent = cell;

      if (
        !document.querySelector(".status").textContent.includes("wins") &&
        !document.querySelector(".status").textContent.includes("tie")
      ) {
        div.addEventListener("click", () => Game.playTurn(index));
      }

      boardElement.appendChild(div);
    });
  }

  function updateStatus(message) {
    statusElement.textContent = message;
  }

  startButton.addEventListener("click", () => {
    const name1 = document.getElementById("player1").value;
    const name2 = document.getElementById("player2").value;
    Game.start(name1, name2);
  });

  restartButton.addEventListener("click", () => {
    const name1 = document.getElementById("player1").value;
    const name2 = document.getElementById("player2").value;
    Game.start(name1 || "Player 1", name2 || "Player 2");
  });

  return {
    updateBoard,
    updateStatus,
    showWinner,
  };
})();
