/// <reference path="js/parsers.js" />
/// <reference path="js/svglib.js" />

$(document).ready(function(){
var lefLoaded = false;
defInput = document.getElementById('defs');
lefInput = document.getElementById('lefs');
viewbtn = document.getElementById('viewbtn')
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
        lefLoaded = true;
        console.log(lefData)
    });
});
}
viewbtn.addEventListener("click", function(Event){
        createLayer();
        //createCell(0,0,40,10,0,0,0);
        const scale_x = 450/Math.abs(defData.die.x2-defData.die.x1);
        const scale_y = 450/Math.abs(defData.die.y2-defData.die.y1);
        const drawingOffset_x = - defData.die.x1;
        const drawingOffset_y = - defData.die.y1;
        if(!lefLoaded)
        {
            //load default lef
        }
        //assign each new cell a color
        celltypeToColor = {};
        const h = scale_y*lefData.cells[defData.cells[0][0].type].h *100;
        for (i in defData.cells)
        {
            for (j in defData.cells[i])
            {
                //Define Cell Dimentions and color
                var cell = defData.cells[i][j];
                if(celltypeToColor[cell.type]===undefined)
                    celltypeToColor[cell.type] = {'r':  getRandomInt(256), 'b':  getRandomInt(256), 'g':  getRandomInt(256)}
                var x = scale_x*(cell.x+drawingOffset_x);
                var y = scale_y*Math.abs((cell.y+drawingOffset_y)-Math.abs(defData.die.y2-defData.die.y1)) - h;
                var w = scale_x*lefData.cells[cell.type].w *100;
                var r = celltypeToColor[cell.type].r; 
                var b = celltypeToColor[cell.type].b;
                var g = celltypeToColor[cell.type].g;
                // Cell Creation
                if(String(cell.type).startsWith("FF", 1))
                    createAndHighlightFF(x, y, h, w, r, b, g)
                else
                    createCell(x, y, h, w, r, b, g);
            }
        }
        
});
});