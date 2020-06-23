var request = require('request');
function get_trustyou(callback) {
    var options = {
        uri : 'https://jsonplaceholder.typicode.com/todos/1',
        method : 'GET'
    }; 
    var res = '';
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res = body;
        }
        else {
            res = 'Not Found';
        }
        callback(res);
    });
}

get_trustyou( function(resp){
    console.log(resp);
});