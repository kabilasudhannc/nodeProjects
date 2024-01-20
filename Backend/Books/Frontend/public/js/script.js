$(() => {
    const dateElements = $('.read_on');
    
    dateElements.each(function() {
        const dateString = $(this).text();
        const date = new Date(dateString);

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
      
        const humanReadableDate = date.toLocaleString('en-US', options);

        $(this).text(humanReadableDate);
    });
});