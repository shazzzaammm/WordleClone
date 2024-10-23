guessList = guessList.concat(wordList);
//total guess, length of word
var height = 6;
var width = 5;
//player curent position
var row;
var column;

var gameOver;
var word;
window.onload = function () {
  init();
};

function init() {
  //clear old baord
  document.getElementById("board").innerHTML = "";
  document.getElementById("keyboard").innerHTML = "";
  document.querySelector(".play-again").classList.add("hidden-button");
  document.querySelector(".play-again").blur();
  //create board
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      //span
      let tile = document.createElement("span");
      tile.id = r.toString() + "-" + c.toString();
      tile.classList.add("tile");
      document.getElementById("board").appendChild(tile);
    }
  }
  //create keyboard
  let keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    [
      "A",
      "S",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      // '<img src="spider_icon.png" alt="">',
      
    ],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ];
  for (let i = 0; i < keyboard.length; i++) {
    let currRow = keyboard[i];
    let keyboardRow = document.createElement("div");
    keyboardRow.classList.add("keyboard-row");

    for (let j = 0; j < currRow.length; j++) {
      let keyTile = document.createElement("div");
      let key = currRow[j];
      keyTile.innerHTML = key;
      if (key == "Enter") {
        keyTile.id = "Enter";
      } else if (key == "⌫") {
        keyTile.id = "Backspace";
      } else if ("A" <= key && key <= "Z") {
        keyTile.id = "Key" + key; //KeyA
      }

      keyTile.addEventListener("click", processKey);

      if (key == "Enter") {
        keyTile.classList.add("enter-tile");
      } else {
        keyTile.classList.add("key-tile");
        keyTile.classList.add("untouched");
      }

      keyboardRow.appendChild(keyTile);
    }
    document.getElementById("keyboard").appendChild(keyboardRow);
  }
  // Listen for keys
  document.addEventListener("keyup", processInput);
  //Set variables
  word = "GOOFY".toUpperCase();
  // word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
  gameOver = false;
  row = 0;
  column = 0;
}
function processKey(e) {
  e = { code: this.id };
  processInput(e);
}
function processInput(e) {
  if (gameOver) return;
  if ("KeyA" <= e.code && e.code <= "KeyZ") {
    if (column < width) {
      let currentTile = document.getElementById(
        row.toString() + "-" + column.toString()
      );
      if (currentTile.innerText == "") {
        currentTile.innerText = e.code[3];
        column++;
      }
    }
  } else if (e.code == "Backspace") {
    if (0 < column && column <= width) {
      column--;
    }
    let currentTile = document.getElementById(
      row.toString() + "-" + column.toString()
    );
    currentTile.innerText = "";
  } else if (e.code == "Enter") {
    Update();
  }

  if (!gameOver && row == height) {
    gameOver = true;
    document.getElementById("error").innerText = word;
    let playButton = document.querySelector(".play-again");
    playButton.classList.remove("hidden-button");
    playButton.addEventListener("click", init);
    playButton.focus()
  }
}

function Update() {
  let guess = "";
  document.getElementById("error").innerText = "";

  //get guess
  for (let c = 0; c < width; c++) {
    let currentTile = document.getElementById(
      row.toString() + "-" + c.toString()
    );
    let letter = currentTile.innerText;
    guess += letter;
  }

  //check if in game
  guess = guess.toLowerCase();
  if (!guessList.includes(guess) || guess.length < width) {
    document.getElementById("error").innerText = "invalid guess";
    return;
  }

  //process game
  let correct = 0;
  let letterCount = {}; //green => {G:1,R:1,E:2,N:1}
  for (let i = 0; i < word.length; i++) {
    let letter = word[i];
    if (letterCount[letter]) {
      letterCount[letter]++;
    } else {
      letterCount[letter] = 1;
    }
  }
  
  //check correct
  for (let c = 0; c < width; c++) {
    let currentTile = document.getElementById(
      row.toString() + "-" + c.toString()
    );
    let letter = currentTile.innerText;
    let keyTile = document.getElementById("Key" + letter);
    if (word[c].toUpperCase() == letter) {
      keyTile.classList.remove("present");
      keyTile.classList.remove("untouched");
      keyTile.classList.add("correct");
      currentTile.classList.add("correct");
      correct++;
      letterCount[letter]--;
    }
  }
  
  //check present in wrong place
  for (let c = 0; c < width; c++) {
    let currentTile = document.getElementById(
      row.toString() + "-" + c.toString()
    );
    let letter = currentTile.innerText;
    let keyTile = document.getElementById("Key" + letter);
    if (!currentTile.classList.contains("correct")) {
      if (word.includes(letter) && letterCount[letter] > 0) {
        currentTile.classList.add("present");
        keyTile.classList.remove("untouched");
        keyTile.classList.add("present");
        letterCount[letter]--;
      } else {
        currentTile.classList.add("absent");
        keyTile.classList.remove("untouched");
        keyTile.classList.add("absent");
      }
    }
  }
  if (correct == width) {
    let playButton = document.querySelector(".play-again");
    playButton.classList.remove("hidden-button");
    playButton.addEventListener("click", init);
    playButton.focus()
    gameOver = true;
  }
  row++;
  column = 0;
}
