"use strict";

let randomNumberPlayer1 = Math.floor(Math.random() * 6) + 1;
let randomNumberPlayer2 = Math.floor(Math.random() * 6) + 1;

let diceUrl = './assests/images/dice'

document.querySelector('.dice-1 img').setAttribute('src', diceUrl + randomNumberPlayer1 + '.png');
document.querySelector('.dice-2 img').setAttribute('src', diceUrl + randomNumberPlayer2 + '.png');

if (randomNumberPlayer1 === randomNumberPlayer2){
    document.querySelector('.message').textContent = 'Draw!';
} else if(randomNumberPlayer1 > randomNumberPlayer2) {
    document.querySelector('.message').textContent = '🚩 Player 1 Wins!';
} else {
    document.querySelector('.message').textContent = 'Player 2 Wins! 🚩';
}
