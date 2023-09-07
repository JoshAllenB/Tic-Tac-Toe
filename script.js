// Handles the Game Message
const display = (() => {
  const renderMessage = (message) => {
    document.querySelector("#display").innerHTML = message;
  }
  return {
    renderMessage,
  }
})();

// renders the gameboard into HTML and also added class and id for each boxes
const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const render = () => {
    let boardHTML = "";
    board.forEach((box, index) => {
      boardHTML += `<div class="box" id="box-${index}">${box}</div>`;
    });
    document.querySelector("#gameBoard").innerHTML = boardHTML;

    const boxes = document.querySelectorAll(".box");
    boxes.forEach((box) => {
      box.addEventListener("click", game.handleClick);
    });
  };

  // Updates the board and renders it again
  const update = (index, value) => {
    board[index] = value;
    render();
  };

  // Copies the original board, prevents from other user to manipulate the original board
  const getBoard = () => board;

  return {
    render,
    update,
    getBoard,
  };
})(); 

  // Creates the players name and assign the marks ("X", "O")
const createPlayer = (name, mark) => {
  return {
    name,
    mark,
  };
};

  // Handles the game logic, players mark and gameOver
const game = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false; // Initialize gameOver to false

  const start = () => {
    players = [
      createPlayer(document.querySelector("#player1").value, "X"),
      createPlayer(document.querySelector("#player2").value, "O"),
    ];
    currentPlayerIndex = 0;
    gameOver = false; // Reset gameOver when the game starts
    gameBoard.render();
  };

  // Handles the Click function of the game that includes clicking on the board game, 
  // checks if a specific box is already played, 
  // handles the restart and start function
  // players turn logic.
  const handleClick = (e) => {

    if (gameOver) {
      return;
    }

    let index = parseInt(e.target.id.split("-")[1]); // Extract the index

    if (gameOver || gameBoard.getBoard()[index] !== "") {
      return; // Exit if the game is over or the box is already filled
    }

    gameBoard.update(index, players[currentPlayerIndex].mark);

    if (checkWin(gameBoard.getBoard(), players[currentPlayerIndex].mark)) {
      gameOver = true;
      display.renderMessage(`${players[currentPlayerIndex].name} wins!`)
    } else if (checkTie(gameBoard.getBoard())) {
      gameOver = true;
      display.renderMessage("IT'S A TIE!");
    }

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  };

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      gameBoard.update(i, "");
    }
    gameBoard.render();
    gameOver = false;
    document.querySelector("#display").innerHTML = "";
  }

  return {
    start,
    restart,
    handleClick,
  };
})();

  // Winning combination logic just check if one of the combinations is met and push to checkWin function
function checkWin(board) {
  const winningCombinations = [
    // Horizontal wins:
    [0,1,2],
    [3,4,5],
    [6,7,8],
    // Vertical wins:
    [0,3,6],
    [1,4,7],
    [2,5,8],
    // Diagonal wins:
    [0,4,8],
    [2,4,6]
  ]
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a ,b ,c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

function checkTie(board) {
  return board.every(cell => cell !== "")
}

const restartBtn = document.querySelector("#restartButton");
restartBtn.addEventListener("click", () => {
  game.restart();
})

const startBtn = document.querySelector("#startButton");
startBtn.addEventListener("click", () => {
  game.start();
});
