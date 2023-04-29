/**
 * Jasmine Zhang
 * 4/28/2023
 * SECTION AG
 * TA: TARA WUEGER & ALLISON HO
 * This is the set.js page of HW2. It manages the UI and behavior of the game "Set".
 */

'use strict';
(function() {
  // Module global variables
  let timerId;
  let remainingSeconds;
  const STYLE = ['solid', 'outline', 'striped'];
  const SHAPE = ['diamond', 'oval', 'squiggle'];
  const COLOR = ['green', 'purple', 'red'];
  const COUNT = [1, 2, 3];
  window.addEventListener('load', init);

  /**
  * A series of event listeners that are attached to the start and back buttons
  * of the game. The start button ultimately showcases thw game board and starts the game.
  * The back button ultimately brings the user back to the menu and ends the game
  */
  function init() {
    id('back-btn').addEventListener('click', toggleViews);
    id('start-btn').addEventListener('click', startGame);
    id('back-btn').addEventListener('click', () => {
      id('refresh-btn').disabled = false
    });
    id('back-btn').addEventListener('click', () => {
      id('set-count').textContent = 0
    });
  }

  /**
  * This function aids with the functionality of starting a new game
  * by calling the necessary functions needed
  */
  function startGame() {
    toggleViews();
    startTimer();
    generateUniqueCard(checkDifficulty);
    createBoard();
  }

  /**
  * Switches between the menu view and game view of the game.
  * Allows for the start and back buttons to work properly.
  * When the user is on the menu view either, the board and timer from the game view will be
  * reset entirely using helper functions so the game will be ready to play again when the
  * user is ready.
  */
  function toggleViews()  {
    id('game-view').classList.toggle('hidden');
    id('menu-view').classList.toggle('hidden');
    id('refresh-btn').addEventListener('click', refreshBoard);

    if(!(id('menu-view').classList.contains('hidden'))) {
      clearBoard();
      resetTimer();
    }
  }

  /**
  * Generates an array containing a random style, shape, color and amount.
  * These contents represent the different attributes each card can generate.
  * @param {boolean} isEasy if true, difficulty level is easy and style of card will always be solid,
  *                    otherwise the style attribute should be randomly selected.
  * @return {array} a randomly generated array of attributes in the form [STYLE, SHAPE, COLOR, COUNT]
  */
  function generateRandomAttributes(isEasy) {
    let randomAttributes = [];
    if (isEasy === true) {
      randomAttributes[0] = STYLE[0];
      randomAttributes[1] = SHAPE[Math.floor(Math.random() * SHAPE.length)];
      randomAttributes[2] = COLOR[Math.floor(Math.random() * COLOR.length)];
      randomAttributes[3] = COUNT[Math.floor(Math.random() * COUNT.length)];
    } else {
      randomAttributes[0] = STYLE[Math.floor(Math.random() * STYLE.length)];
      randomAttributes[1] = SHAPE[Math.floor(Math.random() * SHAPE.length)];
      randomAttributes[2] = COLOR[Math.floor(Math.random() * COLOR.length)];
      randomAttributes[3] = COUNT[Math.floor(Math.random() * COUNT.length)];
    }
    return randomAttributes;
  }

  /**
  * Checks if easy is selected in the game view before the game starts
  * If easy is not selected, standard mode is.
  * @return {boolean} If true, easy mode has been selected. If false, standard mode
  *                   has been selected.
  */
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
  }

  /**
  * Creates a card and makes sure it has completely unique properties by utiizing the array
  * generated in generateRandomAttributes();
  * @param {boolean} isEasy if true, difficulty level is easy and style of card will always be solid,
  *                    otherwise the style attribute should be randomly selected.
  * @return {div} an element that represents a card that has COUNT number of SHAPES
  *               of one COLOR and STYLE. If isEasy is true, the div returned will
  *               always have a solid STYLE.
  */
  function generateUniqueCard(isEasy) {
    let cardName;
    let attributesGenerator = generateRandomAttributes(checkDifficulty());
    let card = gen('div');
    cardName = attributesGenerator[0] + '-' + attributesGenerator[1]
              + '-' + attributesGenerator[2] + '-' + attributesGenerator[3];
    while(id(cardName) !== null) {
      attributesGenerator = generateRandomAttributes(checkDifficulty());
      cardName = attributesGenerator[0] + '-' + attributesGenerator[1]
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

  /**
  * Starts the timer for a new game and grabs the timing option selected in the game menu
  * and displays the time the player has left starting with that value.
  */
  function startTimer() {
    let selectedTiming = qs('select').value;
    remainingSeconds = selectedTiming;
    timerDisplay();
    timerId = setInterval(advanceTimer, 1000);
  }

  /**
  * Updates the game timer by decrementing it with each passing second
  * When the timer reaches 0, the board is disabled and the game view is stuck,
  * all the cards that may have been selected are unselected, the user is unable
  * to select another card, and the refresh button is disabled.
  */
  function advanceTimer() {
  remainingSeconds--;
  timerDisplay();

  if (remainingSeconds === 0) {
    clearInterval(timerId);
    id('refresh-btn').disabled = true;
    let cardsToUnselect = qsa('.card');
    for (let i = 0; i < cardsToUnselect.length; i++) {
      cardsToUnselect[i].classList.remove('selected');
      cardsToUnselect[i].classList.remove('hide-imgs');
      cardsToUnselect[i].removeEventListener('click', cardSelected);
      }
    }
  }

  /**
  * Displays the timer in a MM:SS format, and is called as a helper function for
  * startTimer() and advanceTimer().
  */
  function timerDisplay() {
    let minutes = Math.floor(remainingSeconds / 60);
    let seconds = remainingSeconds % 60;
    let formattedSecs;

    if (seconds < 10) {
      formattedSecs = '0' + seconds;
      qs('#time').textContent = '0' + minutes + ':' + formattedSecs;
    } else {
      formattedSecs = seconds;
      qs('#time').textContent = '0' + minutes + ':' + formattedSecs;
    }
  }

  /**
  * This clears the interval at which timerId calls advancedTimer
  */
  function resetTimer() {
    clearInterval(timerId);
    remainingSeconds = qs('select').value;
    timerDisplay();
  }

  /**
  * Creates the game board by firstly taking the difficulty level selected into account
  * by utilizing the checkDifficulty() function. Based on the difficulty, the board will
  * generate 9 unique cards if easy is selected or 12 if standard is selected.
  */
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

  /**
  * This is called when the refresh board button is clicked. It utilizes the helper functions
  * clearBoard() to clear the existing cards on the board and createBoard() to generate
  * a new collection of unique cards on the board. Together, these two helper functions
  * make it possible for the user to generate a new board of cards while they are playing.
  */
  function refreshBoard() {
    clearBoard();
    createBoard();
  }

  /**
  * This is a helper function that removes all the existing cards on the board
  */
  function clearBoard() {
    let board = id('board');
    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }
  }
  /**
  * Called when a card is selected and checks how many are currently selected.
  * If 3 cards are selected, isASet() is called to handle the cases where the cards make up a set
  * or don't. Additionally, the drop shadow that appears when a card is selected is also removed
  * and a message is displayed alerting the player if they have formed a set or not.
  * If a set is formed, after the message, new cards will also be generated in place of the cards
  * that formed a set.
  */
  function cardSelected() {
    this.classList.toggle('selected');
    let selectedCards = qsa('.selected');
    let newCard;
    if (selectedCards.length === 3) {
      if (isASet(selectedCards)) {
        id('set-count').textContent = parseInt(id('set-count').textContent) + 1;
        for (let i = 0; i < selectedCards.length; i++) {
          selectedCards[i].classList.toggle('selected');
        }
        for (let i = 0; i < selectedCards.length; i++) {
          let setText = gen('p');
          setText.textContent = 'SET!'
          let newCard = generateUniqueCard(checkDifficulty());
          newCard.appendChild(setText);
          newCard.classList.add('hide-imgs');
          id('board').replaceChild(newCard, selectedCards[i]);

          setTimeout(() => {
            newCard.classList.remove('hide-imgs');
            newCard.removeChild(setText);
          }, 1000)
        }
      } else {
        for(let i = 0; i < selectedCards.length; i++) {
          let setText = gen('p');
          setText.textContent = 'Not a Set';
          selectedCards[i].classList.toggle('selected');
          let remove = selectedCards[i].id;
          let card = id(remove);
          card.appendChild(setText);
          card.classList.add('hide-imgs');

          setTimeout(() => {
            id(remove).classList.remove('hide-imgs');
            id(remove).removeChild(setText);
          }, 1000)
        }
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
      attributes.push(selected[i].id.split('-'));
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