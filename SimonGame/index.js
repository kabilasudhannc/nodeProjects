let choices = ['green', 'red', 'yellow', 'blue'];
let gamePattern = [];
let userClickedPattern = [];
let userChosenColor;
let started = false;
let level = 0;

function nextSequence() {
    var randomNumber = Math.floor(Math.random() * 4);
    userClickedPattern = [];

    let randomChoseColor = choices[randomNumber];
    gamePattern.push(randomChoseColor);

    $('#' + randomChoseColor).fadeOut().fadeIn();
    level++;
    $('#level-title').text('Level ' + level);
}

function playSound(name) {
    let audio = new Audio(`./audio/${name}.mp3`);
    audio.play();
}

$('.btn').on('click', function() {
    userChosenColor = $(this).attr('id');
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);

    checkAnswer(userClickedPattern.length - 1);
});

function animatePress(currentColor){
    $(`#` + currentColor).addClass('pressed');
    setTimeout(function() {
        $(`#` + currentColor).removeClass('pressed');
    }, 100);
}

function checkAnswer(currentLevel){
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]){
        console.log('success');

        if (gamePattern.length === userClickedPattern.length){
            setTimeout(function() {
                nextSequence();
            }, 1000);
        }
    } else {
        $('#level-title').text('Game Over, Press Any Key To Restart')
        $('body').addClass('game-over');
        let audio = new Audio('./audio/wrong.mp3');
        audio.play();
        setTimeout(function() {
            $('body').removeClass('game-over');
        }, 200);
    }
}

$(document).on('keypress', function(event) {
    if (!started){
        nextSequence();
        started = true;
    } else {
        startOver();
    }
});

function startOver(){
    started = false;
    gamePattern = [];
    level = 0;
}