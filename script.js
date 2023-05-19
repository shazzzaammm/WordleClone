let array = [];
const container = document.querySelector(".container");
const initButton = document.querySelector(".init");
const playButton = document.querySelector(".play-button");
const methodSelector = document.querySelector(".method-selector");
const speedSlider = document.querySelector(".speed-slider");
const volumeSlider = document.querySelector(".volume-slider");
const lengthSlider = document.querySelector(".length-slider");
let length = 10;
let speed = speedSlider.value;
let audioCtx = null;
let moves;
let width = 1320 / length;
let isAnimating = false;
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function playNote(frequency) {
  if (audioCtx == null) {
    audioCtx = new (AudioContext ||
      window.AudioContext ||
      webkitAudioContext)();
  }
  const dur = 0.05;
  const oscillator = audioCtx.createOscillator();
  oscillator.frequency.value = frequency;
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + dur);
  const node = audioCtx.createGain();
  node.gain.value = volumeSlider.value;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  oscillator.connect(node);
  node.connect(audioCtx.destination);
}
function init() {
  if (isAnimating) return;
  array = [];
  for (let i = 0; i < length; i++) {
    array[i] = Math.random();
  }
  moves = [];
  drawBars();
}
function drawBars(move) {
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.className = "bar";
    if (move && move.indexes.includes(i)) {
      bar.style.backgroundColor = move.type == "swap" ? "red" : "cyan";
    }
    bar.style.width = width + "px";
    container.appendChild(bar);
  }
}
function drawBarsBogo(array) {
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.className = "bar";
    bar.style.width = width + "px";
    bar.style.backgroundColor = "red";
    container.appendChild(bar);
  }
  playNote(Math.floor(Math.random() * 1200));
}
function animate(moves) {
  isAnimating = true;
  if (moves.length == 0) {
    drawBars();
    finishedSorting();
    return;
  }
  const move = moves.shift();
  const [i, j] = move.indexes;
  if (move.type == "swap") {
    [array[i], array[j]] = [array[j], array[i]];
  }
  playNote(300 + array[i] * 500);
  playNote(300 + array[i] * 500);

  drawBars(move);
  setTimeout(function () {
    animate(moves);
  }, speed);
}
async function finishedSorting() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < bars.length; i++) {
    bars[i].style.backgroundColor = "#66FF22";
    playNote(300 + array[i] * 500);
    await sleep(0);
  }
  await sleep(750);
  isAnimating = false;
  if (document.querySelector(".repeat-checkbox").checked) {
    play();
  }
}
function bubbleSort(array) {
  do {
    var swapped = false;
    for (let i = 1; i < array.length; i++) {
      if (array[i] < array[i - 1]) {
        swap(array, i, i - 1);
        swapped = true;
      }
    }
  } while (swapped);
}
function insertionsort(array) {
  let n = array.length;
  for (let i = 1; i < n; i++) {
    let current = array[i];
    let j = i - 1;
    while (j > -1 && current < array[j]) {
      swap(array, j, j + 1);
      j--;
    }
    array[j + 1] = current;
  }
}
function selectionSort(array) {
  for (let i = 0; i < array.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < array.length; j++) {
      pushCompare(min, j);
      if (array[j] < array[min]) {
        min = j;
      }
    }
    if (min !== i) {
      swap(array, i, min);
    }
  }
}
function shellSort(arr) {
  const len = arr.length;
  let gap = Math.floor(len * 0.5);

  while (gap > 0) {
    for (let i = gap; i < len; i++) {
      let j = i;
      let current = arr[i];
      pushCompare(j - gap, j);
      while (j - gap >= 0 && current < arr[j - gap]) {
        swap(arr, j, j - gap);
        j = j - gap;
      }
      arr[j] = current;
    }
    gap = Math.floor(gap * 0.5);
  }
}
function gnomeSort(arr) {
  let i = 1;
  let j = 2;
  while (i < arr.length) {
    if (arr[i - 1] <= arr[i]) {
      i = j;
      j++;
    } else {
      swap(arr, i - 1, i);
      i--;
      if (i === 0) {
        i = j;
        j++;
      }
    }
  }
}
function cocktailShakerSort(arr) {
  let isSorted = true;
  while (isSorted) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        swap(arr, i, i + 1);
        isSorted = true;
      }
    }

    if (!isSorted) break;

    isSorted = false;

    for (let j = arr.length - 1; j > 0; j--) {
      if (arr[j - 1] > arr[j]) {
        swap(arr, j, j - 1);
        isSorted = true;
      }
    }
  }
}
function oddEvenSort(arr, n) {
  let isSorted = false;

  while (!isSorted) {
    isSorted = true;
    let temp = 0;

    // Perform Bubble sort on odd indexed element
    for (let i = 1; i <= n - 2; i = i + 2) {
      if (arr[i] > arr[i + 1]) {
        temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        isSorted = false;
        pushSwap(i, i + 1);
      } else {
        pushCompare(i, i + 1);
      }
    }

    // Perform Bubble sort on even indexed element
    for (let i = 0; i <= n - 2; i = i + 2) {
      if (arr[i] > arr[i + 1]) {
        temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        isSorted = false;
        pushSwap(i, i + 1);
      }
    }
  }
}
function getNextGap(gap) {
  // Shrink gap by Shrink factor
  gap = parseInt((gap * 10) / 13, 10);
  if (gap < 1) return 1;
  return gap;
}
function combSort(arr) {
  let n = arr.length;

  let gap = n;

  let swapped = true;

  while (gap != 1 || swapped == true) {
    gap = getNextGap(gap);

    swapped = false;

    for (let i = 0; i < n - gap; i++) {
      if (arr[i] > arr[i + gap]) {
        swap(arr, i, i + gap);
        swapped = true;
      } else {
        pushCompare(i, i + gap);
      }
    }
  }
}
function partition(items, left, right) {
  var pivot = items[Math.floor((right + left) / 2)], //middle element
    i = left, //left pointer
    j = right; //right pointer
  while (i <= j) {
    while (items[i] < pivot) {
      i++;
    }
    while (items[j] > pivot) {
      j--;
    }
    if (i <= j) {
      swap(items, i, j); //sawpping two elements
      i++;
      j--;
    }
  }
  return i;
}
function quickSort(items, left, right) {
  var index;
  if (items.length > 1) {
    index = partition(items, left, right); //index returned from partition
    if (left < index - 1) {
      //more elements on the left side of the pivot
      quickSort(items, left, index - 1);
    }
    if (index < right) {
      //more elements on the right side of the pivot
      quickSort(items, index, right);
    }
  }
  return items;
}
async function bogo(arr) {
  var shuffleCount = 0;
  function shuffle(arr) {
    var shuffled = [];
    var rand;
    while (arr.length !== 0) {
      rand = Math.floor(Math.random() * arr.length);
      shuffled.push(arr.splice(rand, 1)[0]);
    }
    return shuffled;
  }

  function sorted(shuffle) {
    for (var i = 0; i < shuffle.length - 1; i++) {
      if (shuffle[i] <= shuffle[i + 1]) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }

  do {
    shuffleCount++;
    arr = shuffle(arr);
    drawBarsBogo(arr);
    await sleep(speed);
  } while (!sorted(arr));
  finishedSorting();
  return shuffleCount;
}

function pushSwap(i, j) {
  moves.push({ indexes: [i, j], type: "swap" });
}
function pushCompare(i, j) {
  moves.push({ indexes: [i, j], type: "comp" });
}
function swap(items, leftIndex, rightIndex) {
  var temp = items[leftIndex];
  items[leftIndex] = items[rightIndex];
  items[rightIndex] = temp;
  pushSwap(leftIndex, rightIndex);
}
function play() {
  if (isAnimating) return;
  init();
  const copy = [...array];
  switch (methodSelector.value) {
    case "bubble":
      bubbleSort(copy);
      break;
    case "insertion":
      insertionsort(copy);
      break;
    case "selection":
      selectionSort(copy);
      break;
    case "shell":
      shellSort(copy);
      break;
    case "cocktailShaker":
      cocktailShakerSort(copy);
      break;
    case "gnome":
      gnomeSort(copy);
      break;
    case "brick":
      oddEvenSort(copy, copy.length);
      break;
    case "quick":
      quickSort(copy, 0, copy.length - 1);
      break;
    case "comb":
      combSort(copy);
      break;
    case "bogo":
      bogo(copy);
      break;
  }
  animate(moves);
  // drawBars();
}

init();
initButton.addEventListener("click", init);
playButton.addEventListener("click", play);
speedSlider.addEventListener("input", function () {
  speed = speedSlider.value;
});
lengthSlider.addEventListener("input", function () {
  length = lengthSlider.value;
  width = 1320 / length;
  if (!isAnimating) init();
});
