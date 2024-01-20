$(() => {
    $('.nav').on('mouseover', function(e) {
        console.log(this);
        $(this).addClass('active');
    });

    $('.nav').on('mouseout', function(e) {
        $(this).removeClass('active');
    });

    $('.form-container .primary').on('click', function() {
        console.log(this);
        if (this.id === 'any') {
            $('.secondary input').attr('disabled', 'true');
        } else if (this.id === 'custom') {
            $('.secondary input').removeAttr('disabled');
        }
    });
});