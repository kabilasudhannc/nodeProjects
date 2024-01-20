let btns = document.querySelectorAll('.drum');
function playAudio (key){
    switch (key) {
        case "w":
            const tom1 = new Audio('./sounds/tom-1.mp3');
            tom1.play();
            break;
        
        case "a":
            const tom2 = new Audio('./sounds/tom-2.mp3');
            tom2.play();
            break;
        
        case "s":
            const tom3 = new Audio('./sounds/tom-3.mp3');
            tom3.play();
            break;
        
        case "d":
            const tom4 = new Audio('./sounds/tom-4.mp3');
            tom4.play();
            break;
        
        case "j":
            const kick = new Audio('./sounds/kick-bass.mp3');
            kick.play();
            break;
        
        case "k":
            const crash = new Audio('./sounds/crash.mp3');
            crash.play();
            break;
        
        case "l":
            const snare = new Audio('./sounds/snare.mp3');
            snare.play();
            break;
    
        default:
            console.log();
    }
}

for (let btn of btns){
    btn.addEventListener('click', function () {
        playAudio(this.textContent);
        buttonAnimation(this.textContent);
    });
}

document.addEventListener('keydown', function (event) {
    playAudio(event.key);
    buttonAnimation(event.key);
});


function buttonAnimation(key){
    const active = document.querySelector('.' + key);
    active.classList.add('pressed');
    setTimeout(function () {
        active.classList.remove('pressed');
    }, 100);
}