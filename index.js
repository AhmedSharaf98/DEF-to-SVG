/// <reference path="js/parsers.js" />

$(document).ready(function(){
defInput = document.getElementById('defs');
lefInput = document.getElementById('lefs');
if(defInput){
defInput.addEventListener("change", function(Event){
    var files = event.target.files;
    parsers.readFileFromInput(files, function (data) {
        defData = parsers.parseDEF(data);
        console.log(defData)
    });
});
}
if(lefInput){
lefInput.addEventListener("change", function(Event){
    var files = event.target.files;
    parsers.readFileFromInput(files, function (data) {
        lefData = parsers.parseLEF(data);
        console.log(lefData)
    });
});
}
});