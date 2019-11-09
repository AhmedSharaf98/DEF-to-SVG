/// <reference path="js/parsers.js" />


var defViewer = {
    lefData: {
        "cells": {
            "FILL": { "w": 1.600, "h": 20.000 },
            "AND2X1": { "w": 6.400, "h": 20.000 },
            "AND2X2": { "w": 6.400, "h": 20.000 },
            "AOI21X1": { "w": 6.400, "h": 20.000 },
            "AOI22X1": { "w": 8.000, "h": 20.000 },
            "BUFX2": { "w": 4.800, "h": 20.000 },
            "BUFX4": { "w": 6.400, "h": 20.000 },
            "DFFNEGX1": { "w": 19.200, "h": 20.000 },
            "NOR3X1": { "w": 12.800, "h": 20.000 },
            "DFFPOSX1": { "w": 19.200, "h": 20.000 },
            "FAX1": { "w": 24.000, "h": 20.000 },
            "HAX1": { "w": 16.000, "h": 20.000 },
            "INVX1": { "w": 3.200, "h": 20.000 },
            "INVX2": { "w": 3.200, "h": 20.000 },
            "INVX4": { "w": 4.800, "h": 20.000 },
            "INVX8": { "w": 8.000, "h": 20.000 },
            "NAND2X1": { "w": 4.800, "h": 20.000 },
            "NAND3X1": { "w": 6.400, "h": 20.000 },
            "NOR2X1": { "w": 4.800, "h": 20.000 },
            "OAI21X1": { "w": 6.400, "h": 20.000 },
            "OAI22X1": { "w": 8.000, "h": 20.000 },
            "OR2X1": { "w": 6.400, "h": 20.000 },
            "OR2X2": { "w": 6.400, "h": 20.000 },
            "TBUFX1": { "w": 8.000, "h": 20.000 },
            "TBUFX2": { "w": 11.200, "h": 20.000 },
            "XOR2X1": { "w": 11.200, "h": 20.000 },
            "MUX2X1": { "w": 9.600, "h": 20.000 },
            "XNOR2X1": { "w": 11.200, "h": 20.000 },
            "LATCH": { "w": 11.200, "h": 20.000 },
            "DFFSR": { "w": 35.200, "h": 20.000 },
            "CLKBUF1": { "w": 14.400, "h": 20.000 },
            "CLKBUF2": { "w": 20.800, "h": 20.000 },
            "CLKBUF3": { "w": 27.200, "h": 20.000 },
            "PADFC": { "w": 300.000, "h": 300.000 },
            "PADGND": { "w": 90.000, "h": 300.000 },
            "PADVDD": { "w": 90.000, "h": 300.000 },
            "PADINC": { "w": 90.000, "h": 300.000 },
            "PADINOUT": { "w": 90.000, "h": 300.000 },
            "PADNC": { "w": 90.000, "h": 300.000 },
            "PADOUT": { "w": 90.000, "h": 300.000 }
        }
    }
};

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