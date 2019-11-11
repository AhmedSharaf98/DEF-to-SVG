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
        //Drawing the pins
        createLayer();
        for (i in defData.pins)
        {
            var pin_w= (defData.pins[i].x2-defData.pins[i].x1)*scale_x;
            var pin_h= (defData.pins[i].y2-defData.pins[i].y1)*scale_y;
            var pinx = scale_x*(defData.pins[i].x+drawingOffset_x);
            var piny = scale_y*Math.abs((defData.pins[i].y+drawingOffset_y)-Math.abs(defData.die.y2-defData.die.y1)) - pin_h;
            createCell(pinx, piny, pin_h, pin_w, 0, 0, 0);
        }
        //Drawing the nets
        for (i in defData.nets)
        {
            for (j in defData.nets[i].routes)
            {
                var coord = defData.nets[i].routes[j].coords;
                var x1 = scale_x*(coord[0].x+drawingOffset_x);;
                var y1 = scale_y*Math.abs((coord[0].y+drawingOffset_y)-Math.abs(defData.die.y2-defData.die.y1));
                var x2 = (coord.length>1)?scale_x*(coord[1].x+drawingOffset_x): undefined;
                var y2 = (coord.length>1)?scale_y*Math.abs((coord[1].y+drawingOffset_y)-Math.abs(defData.die.y2-defData.die.y1)): undefined;
                if(defData.nets[i].name.startsWith("clk"))
                    CreateClkNet(defData.nets[i].routes[j].layer[5], x1, y1, x2, y2);
                else
                    CreateNet(defData.nets[i].routes[j].layer[5], x1, y1, x2, y2);
            }
        }
});
});