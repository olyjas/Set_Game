/*
  Jasmine Zhang
  4/27/2023
  SECTION AG
  TA: TARA WUEGER & ALLISON HO

  This is the set.js page of HW2. It manages game UI and behavior.
*/

'use strict';
(function () {

  window.addEventListener('load', init);

function init() {
  id('back-btn').addEventListener('click', toggleViews);
  id('start-btn').addEventListener('click', startGame);
  }

function startGame() {
  toggleViews();
  startTimer();
  generateUniqueCard(true);
  createBoard();

}

  // Required module globals
  let timerId;
  let remainingSeconds;
  const STYLE = ['solid', 'outline', 'striped'];
  const SHAPE = ['diamond', 'oval', 'squiggle'];
  const COLOR = ['green', 'purple', 'red'];
  const COUNT = [1, 2, 3];

  // Required functions to implement are below
  function toggleViews()  {
    // code for function goes here
    id('game-view').classList.toggle('hidden');
    id('menu-view').classList.toggle('hidden');

    if(!(id('menu-view').classList.contains('hidden'))) {
      resetBoard();
      resetTimer();
    }
  }

  function generateRandomAttributes(isEasy) {
    // code for function goes heres
    let randomAttributes = [];
      if (isEasy === true) {
          randomAttributes[0] = STYLE[0];
          randomAttributes[1] = SHAPE[Math.floor(Math.random() * SHAPE.length)];
          randomAttributes[2] = COLOR[Math.floor(Math.random() * COLOR.length)];
          randomAttributes[3] = COUNT[Math.floor(Math.random() * COUNT.length)];
      }
      else {
        randomAttributes[0] = STYLE[Math.floor(Math.random() * STYLE.length)];
        randomAttributes[1] = SHAPE[Math.floor(Math.random() * SHAPE.length)];
        randomAttributes[2] = COLOR[Math.floor(Math.random() * COLOR.length)];
        randomAttributes[3] = COUNT[Math.floor(Math.random() * COUNT.length)];
      }
        return randomAttributes;
  }

  function generateUniqueCard(isEasy) {
    let randomGenerator = generateRandomAttributes(isEasy);
    // set the src
    const card = gen('div');
    for (let i = 0; i < randomGenerator[3]; i++) {
      let image = gen('img');
      image.src = 'img/' + randomGenerator[0] + '-' + randomGenerator[1] + '-' + randomGenerator[2] + '.png';
      console.log(image.src);
      let cardName = randomGenerator[0] + '-' + randomGenerator[1] + '-' + randomGenerator[2] + '-' + i + 1;
      image.alt = cardName;

      card.appendChild(image);
      card.setAttribute('id', cardName);
      card.classList.add('card');
      card.addEventListener('click', cardSelected);
    }
    return card;
  }

  function startTimer() {
    // code for function goes here
    let selectedTiming = qs('select').value;
    remainingSeconds = selectedTiming;
    timerDisplay();
    timerId = setInterval(advanceTimer, 1000);
  }

  function advanceTimer() {
    remainingSeconds--;
    timerDisplay();

    if (remainingSeconds === 0) {
      clearInterval(timerId);
      qsa('.card').disabled = true;
    }
  }

  function timerDisplay() {
    let minutes = Math.floor(remainingSeconds / 60);
    let seconds = remainingSeconds % 60;
    let formattedSecs;

   if (seconds < 10) {
      formattedSecs = '0' + seconds;
      qs('#time').textContent = '0' + minutes + ':' + formattedSecs;
    }
    else {
      formattedSecs = seconds;
      qs('#time').textContent = '0' + minutes + ':' + formattedSecs;
    }
  }

  function createBoard() {
    for (let i = 0; i < 12; i++) {
      const board = id('board');
      const cardBoard = generateUniqueCard(true);
      board.appendChild(cardBoard);
    }
  }

  function refreshBoard() {
    resetBoard();
    resetTimer();
    createBoard();
    startTimer();
  }

  function resetTimer() {
    clearInterval(timerId);
    remainingSeconds = qs('select').value;
    timerDisplay();
  }

  function resetBoard() {
    let board = id('board');
    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }
  }

  function cardSelected() {
    // code for function goes here
    qs('.card').classList.toggle('selected');
  }


      /**
   * Checks to see if the three selected cards make up a valid set. This is done by comparing each
   * of the type of attribute against the other two cards. If each four attributes for each card are
   * either all the same or all different, then the cards make a set. If not, they do not make a set
   * @param {DOMList} selected - list of all selected cards to check if a set.
   * @return {boolean} true if valid set false otherwise.
   */
      function isASet(selected) {
        let attributes = [];
        for (let i = 0; i < selected.length; i++) {
          attributes.push(selected[i].id.split("-"));
        }
        for (let i = 0; i < attributes[0].length; i++) {
          let diff = attributes[0][i] !== attributes[1][i] &&
                    attributes[1][i] !== attributes[2][i] &&
                    attributes[0][i] !== attributes[2][i];
          let same = attributes[0][i] === attributes[1][i] &&
                        attributes[1][i] === attributes[2][i];
          if (!(same || diff)) {
            return false;
          }
        }
        return true;
      }
  // shortcut functions

  function gen(tagName) {
    return document.createElement(tagName);
  }

  function id(id) {
    return document.getElementById(id);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

}
)();