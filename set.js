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
  generateUniqueCard(checkDifficulty);
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
    id('refresh-btn').addEventListener('click', refreshBoard);

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

  //function checkDifficulty() {
  //  let difficultySetting = qsa('input[name="diff"].checked');
  //  for (let i = 0; i < difficultySetting.length; i++) {
  //    if (difficultySetting[i].value === 'easy') {
  //        return true;
  //      } else {
  //        return false;
  //      }
  //    }
  //  }

  function checkDifficulty() {
    let difficultySetting = qsa('input');
    for (let i = 0; i < difficultySetting.length; i++) {
      if (difficultySetting[i].checked) {
        if (difficultySetting[i].value == 'easy') {
          return true;
        } else {
          return false
        }
      }
    }
    return true;
  }

  function generateUniqueCard(isEasy) {
    let cardName;
    let attributesGenerator = generateRandomAttributes(isEasy);
    let card = gen('div');
    cardName  = attributesGenerator[0] + '-' + attributesGenerator[1] + '-' + attributesGenerator[0]
                 + '-' + attributesGenerator[2] + '-' + attributesGenerator[3];

    while(id(cardName) !== null) {
      attributesGenerator = generateRandomAttributes(isEasy);
      cardName = attributesGenerator[0] + '-' + attributesGenerator[1] + '-' + attributesGenerator[0]
      + '-' + attributesGenerator[2] + '-' + attributesGenerator[3];
      }

    card.addEventListener('click', cardSelected);
    card.id = cardName;
    card.setAttribute('id', cardName);
    card.classList.add('card');

    for (let i = 0; i < attributesGenerator[3]; i++) {
      let image = gen('img');
      image.src = 'img/' + attributesGenerator[0] + '-' + attributesGenerator[1] + '-' + attributesGenerator[2] + '.png';
      image.alt = card.id;
      card.appendChild(image);
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
      id('refresh-btn').disabled = true;
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
    let basedOnDifficulty = checkDifficulty();
    let numberOfCards;

    if (basedOnDifficulty === true) {
      numberOfCards = 9;
    } else {
      numberOfCards = 12;
    }

    for (let i = 0; i < numberOfCards; i++) {
      let board = id('board');
      let cardBoard = generateUniqueCard(basedOnDifficulty);
      if (!board.contains(cardBoard)) {
        board.appendChild(cardBoard);
      }
    }
  }

  function refreshBoard() {
    resetBoard();
    createBoard();
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
    this.classList.toggle('selected');
    let selected = qsa('.selected');
    let result;
    if (selected.length === 3) {
      result = isASet(selected);
      for(let i = 0; i < 3; i++) {
        let remove = selected[i].id;
        let card = id(remove);
        card.classList.remove('selected');
        let setText = gen('p');

        if (result === false) {
          setText.textContent = "Not a Set";
          card.appendChild(setText);
          card.classList.add('hide-imgs');

          setTimeout( () => {
            id(remove).classList.remove('hide-imgs');
            id(remove).removeChild(setText);
          }, 1000)

        } else {
          setText.textContent = "SET!";
          let difficultySetting = checkDifficulty();
          let newCard = generateUniqueCard(difficultySetting);
          createBoard(newCard);
          newCard.appendChild(setText);
          newCard.addList.add('hide-imgs');
          let parent = card.parentNode;
          parent.replaceChild(newCard, card);

          setTimeout( () => {
            newCard.classList.remove('hide-imgs');
            newCard.removeChild(setText);
          }, 1000)
        }
      }
      if(result === true) {
        id('set-count').textContent = id('set-count').textContent + 1;
      }
    }
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