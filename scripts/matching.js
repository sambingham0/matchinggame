const cardsArray = [
    'A', 'A', 'W', 'W', 'H', 'H', 'M', 'M',
    'O', 'O', 'T', 'T', 'X', 'X', 'U', 'U'
];

const gameBoard = document.getElementById('game-board');
const cardElements = [];
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let matchedCards = 0;
let timer;
let seconds = 0;
let attempts = 0;

// Function to shuffle the array using ES6
function shuffle(array) {
    return array.map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
}

// Recursive function to create board and display output
function createBoard(index = 0) {
    if (index >= cardsArray.length) return; // Base case

    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.cardValue = cardsArray[index];

    cardElement.addEventListener('click', flipCard);
    gameBoard.appendChild(cardElement);
    cardElements.push(cardElement);

    createBoard(index + 1); // Recursive call
}

function flipCard() {
    if (lockBoard) return; // Prevent flipping if the board is locked
    if (this === firstCard) return; // Prevent flipping the same card

    this.classList.add('flipped');
    this.innerHTML = this.dataset.cardValue;

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.cardValue === secondCard.dataset.cardValue;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    try {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedCards += 2;
        attempts++;
        document.getElementById('score').innerText = `Attempts: ${attempts}`;

        if (matchedCards === cardsArray.length) {
            setTimeout(() => {
                clearInterval(timer);
                alert(`You win! Time: ${seconds}s, Attempts: ${attempts}`);
            }, 500);
        }
        resetBoard();
    } catch (error) {
        console.error("Error disabling cards:", error);
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.innerHTML = '';
        secondCard.innerHTML = '';
        attempts++;
        document.getElementById('score').innerText = `Attempts: ${attempts}`;
        resetBoard();
    }, 1500);
}

function resetBoard() {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

// Start timer function
function startTimer() {
    timer = setInterval(() => {
        seconds++;
        document.getElementById('timer').innerText = `Time: ${seconds}s`;
    }, 1000);
}

// Reset Game
document.getElementById('reset').addEventListener('click', resetGame);

function resetGame() {
    gameBoard.innerHTML = '';
    matchedCards = 0;
    seconds = 0;
    attempts = 0;
    clearInterval(timer);
    document.getElementById('timer').innerText = `Time: 0s`;
    document.getElementById('score').innerText = `Attempts: 0`;
    
    // Using ES6 filter to remove duplicates and create a new board
    createBoard(); // Create a new game board
    startTimer(); // Restart the timer
}

// Start the game
const shuffledCardsArray = shuffle(cardsArray); // Shuffle cards
createBoard(); // Create board with shuffled cards
startTimer(); // Start timer
