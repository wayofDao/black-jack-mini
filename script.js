let game;
const deckElement = document.querySelector('.deck');
const dealerHand = document.querySelector('.dealer-cards');
const playerHand = document.querySelector('.player-cards');
const actionsElement = document.querySelector('.actions');
const result = document.querySelector('.result');
const restart = document.createElement('button');
restart.textContent = 'restart';

class BlackJackSession {

    constructor() {
        this.hiddenCard = null;
        this.gameDeck = this.shuffleDeck(this.createCardDeck());
    }

    createCardDeck() {
        let deck = [];
        // clubs (♣), diamonds (♦), hearts (♥) and spades (♠)

        const cardSuits = ['C','D','H','S'];
        const cardRanks = [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
        cardSuits.forEach(suit => {
            cardRanks.forEach(rank => {
                deck.push(`${rank}${suit}`)
            })
        })
        return deck;
    }

    shuffleDeck(deck) {
        let currentIndex = deck.length;
        let randomIndex;
        let temp;
    
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a random element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          temp = deck[currentIndex];
          deck[currentIndex] = deck[randomIndex];
          deck[randomIndex] = temp;
        }
    
        return deck;
      
    }

    takeCard() {
        let card = document.createElement('div');
        card.classList.add('card')
        card.textContent = this.gameDeck.pop();
        deckElement.textContent = this.gameDeck.length;
        return card;
    }
}

function calculateCards(selector) {
    let listOfCards = [];
    let aceChanges = [];
    document.querySelector(selector).childNodes.forEach(cardElement => listOfCards.push(cardElement.textContent));
    return listOfCards.reduce((accumulator, cardString) => {
        let convertedCard = cardString.slice(0,-1) 
        if(convertedCard === 'A') {
            // todo handle use of 11 or 1 in case bust 
            if(accumulator > 10) {
                convertedCard = 1;    
            }else {
                convertedCard = 11;
                aceChanges.push(10)
            }
        }
        if(['J','Q','K'].includes(convertedCard)) {
            convertedCard = 10;
        }
        let accumulation = accumulator + parseInt(convertedCard,10)
        // in case sum of cards are over 21 but exist aces that we counted as 11 we can convert ace value to 1
        if(accumulation > 21 && aceChanges.length > 0) {
            accumulation = accumulation - aceChanges.pop()
        }
        return accumulation
    }, 0)
}

function dealerAction() {
   let dealerHand = calculateCards('.dealer-cards');
   game.dealerHand = dealerHand;
   checkScore();
}


function calculatePlayerCards() {
   let playerHand = calculateCards('.player-cards');
   game.playerHand = playerHand;
   if(playerHand >= 21) {
       stay()
   }

}
function checkScore() {
  
    if(game.dealerHand < 16) {
        dealerDrawCard();
    } else {
        let messageElement = document.createElement('div');
        messageElement.classList.add('result-message');
        let message;
        if(game.dealerHand > 21|| (game.dealerHand < game.playerHand && game.playerHand <= 21) ) {
            message = `Player Wins with:${game.playerHand} against dealer: ${game.dealerHand}`;
        } else if(game.playerHand > 21 || (game.playerHand < game.dealerHand && game.dealerHand <= 21)) {
            message = `Player Loses with:${game.playerHand} against dealer: ${game.dealerHand}`;
        }
        if(game.dealerHand === game.playerHand) {
            message = `Player draws with:${game.playerHand} against dealer: ${game.dealerHand}`;
        }
        messageElement.textContent = message;
        result.style.display = 'flex';
        result.appendChild(messageElement)
        result.appendChild(restart)
    }
}

function hitMe() {
    playerHand.appendChild(game.takeCard());
    calculatePlayerCards();
}

function dealerDrawCard() {
    dealerHand.appendChild(game.takeCard());
    dealerAction();
}

function stay() {
    document.querySelector('.hidden-card').textContent = game.hiddenCardValue;
    dealerAction();
}

function startGame() {
    if(game) {
        let hiddenCard = game.takeCard()
        hiddenCard.classList.add('hidden-card');
        game.hiddenCardValue = hiddenCard.textContent;
        hiddenCard.textContent = 'hidden';
        dealerHand.appendChild(hiddenCard);
        dealerHand.appendChild(game.takeCard());
        hitMe();
        hitMe();

        actionsElement.style.visibility = 'visible';
    }
    deckElement.removeEventListener('click', startGame);
}

function reinit() {
    result.style.display = 'none';
    result.innerHTML = '';

    playerHand.innerHTML = '';
    dealerHand.innerHTML = '';
    deckElement.textContent = 'start';
    document.querySelector('#hit').removeEventListener('click', hitMe);
    document.querySelector('#stay').removeEventListener('click', stay);
    game = new BlackJackSession();
    document.querySelector('#hit').addEventListener('click', hitMe);
    document.querySelector('#stay').addEventListener('click', stay);

    deckElement.addEventListener('click', startGame);
}

function init() {
    game = new BlackJackSession();
    document.querySelector('#hit').addEventListener('click', hitMe);
    document.querySelector('#stay').addEventListener('click', stay);

    deckElement.addEventListener('click', startGame);
    restart.addEventListener('click', reinit);

}


init();





