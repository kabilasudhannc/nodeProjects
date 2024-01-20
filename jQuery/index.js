$(document).ready(function (){
    // $('h1').text('Bye.');
    // $('button').html('<em>Click me</em>');
    // $('h1').click(function(){
    //     $('h1').css('color', 'purple');
    // });
    // $('button').click(function(){
    //     $('h1').css('color', 'purple');
    // });

    // $(document).keypress(function(event) {
    //     console.log(event.key);
    //     $('h1').text(event.key);
    // });
    // $('h1').on('mouseover', function(){
    //     $('h1').css('color', 'purple');
    // });
    // $('input').keypress(function(event){
    //     console.log(event.key);
    //     $('h1').append(event.key);
    // });
    // $('h1').before('<button>Next</button>');
    $('button').on('click', function(){
        $('h1').slideUp().fadeOut().slideDown().fadeIn();
    });
});