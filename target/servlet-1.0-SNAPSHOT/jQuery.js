$(document).ready(function() {
    // Bind click event to button
    $('#myB').click(function() {
        // AJAX call
        $.ajax({
            url: 'HelloServlet',
            type: 'GET',
            dataType: 'text', // change the data type based on your response type
            success: function(response) {
                // handle successful response
                console.log(response);
            },
            error: function(xhr, status, error) {
                // handle error response
                console.log("Error: " + error);
            }
        });
    });
});
