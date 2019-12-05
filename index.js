/// <reference path="js/parsers.js" />
/// <reference path="js/svglib.js" />

draw_colors_once=0;
$(document).ready(function(){
var lefLoaded = false;
defInput = document.getElementById('defs');
lefInput = document.getElementById('lefs');
viewbtn = document.getElementById('viewbtn');

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
        //createCell(0,0,40,10,0,0,0);
        if(defInput.value==""||lefInput.value==""){
            alert("Make sure to select a .def and a .lef files!");
            return;
        }
        const scale_x = 500/Math.abs(defData.die.x2-defData.die.x1);
        const scale_y = 500/Math.abs(defData.die.y2-defData.die.y1);
        const drawingOffset_x = - defData.die.x1;
        const drawingOffset_y = - defData.die.y1;
        if(!lefLoaded)
        {
            //load default lef
        }
        //assign each new cell a color
        celltypeToColor = 
        {
            "clk" : {r: 255, b: 255, g: 255},
            "AND2X2": {r: 72, b: 12, g: 245},
            "AOI21X1": {r: 63, b: 2, g: 206},
            "AOI22X1": {r: 16, b: 128, g: 201},
            "BUFX2": {r: 106, b: 15, g: 138},
            "BUFX4": {r: 66, b: 159, g: 106},
            "DFFPOSX1": {r: 47, b: 79, g: 79},
            "DFFSR": {r: 112, b: 128, g: 144},
            "FILL": {r: 253, b: 77, g: 69},
            "INVX1": {r: 107, b: 27, g: 180},
            "INVX2": {r: 98, b: 149, g: 168},
            "INVX4": {r: 154, b: 171, g: 75},
            "MUX2X1": {r: 50, b: 139, g: 3},
            "NAND2X1": {r: 225, b: 80, g: 187},
            "NAND3X1": {r: 108, b: 246, g: 138},
            "NOR2X1": {r: 54, b: 177, g: 197},
            "NOR3X1": {r: 29, b: 85, g: 11},
            "OAI21X1": {r: 204, b: 245, g: 250},
            "OAI22X1": {r: 103, b: 91, g: 248},
            "OR2X2": {r: 139, b: 130, g: 194},
            "XNOR2X1": {r: 10, b: 127, g: 157},
            "XOR2X1": {r: 158, b: 180, g: 37},
            
        };
        
        const h = scale_y*lefData.cells[defData.cells[0][0].type].h *100;
        var cell_info = {}
        var dropdownCells = document.getElementById("dropdownCells");
        for (i in defData.cells)
        {
            for (j in defData.cells[i])
            {
                //Define Cell Dimentions and color
                var cell = defData.cells[i][j];
                cell_info.name = cell.name;
                cell_info.type = cell.type;
                if(celltypeToColor[cell.type]===undefined)
                    celltypeToColor[cell.type] = {'r':  getRandomInt(255), 'b':  getRandomInt(255), 'g':  getRandomInt(255)}
                var x = scale_x*(cell.x+drawingOffset_x);
                var y = scale_y*Math.abs((cell.y+drawingOffset_y)-Math.abs(defData.die.y2-defData.die.y1)) - h;
                var w = scale_x*lefData.cells[cell.type].w *100;
                var r = celltypeToColor[cell.type].r; 
                var b = celltypeToColor[cell.type].b;
                var g = celltypeToColor[cell.type].g;
                // Cell Creation
                // if(String(cell.type).startsWith("FF", 1))
                //     createFlipFlop(x, y, h, w, r, b, g, cell_info )
                // else
                createCell(x, y, h, w, r, b, g, cell_info);
                dropdownCells.innerHTML += '<li><a href="#" onClick="show(\''+ cell_info.name+'\')">'+cell_info.name+'</a></li>';
            }
        }
        //Drawing the pins
        var pin_w, pin_h, pinx, piny;
        var dropdownPins = document.getElementById("dropdownPins");
        for (i in defData.pins)
        {
            pin_w= (defData.pins[i].x2-defData.pins[i].x1)*scale_x*100;
            pin_h= (defData.pins[i].y2-defData.pins[i].y1)*scale_y*100;
            if(pin_w>20) //by-passing some parser errors
                {
                    // pinx = (450 - pin_w)/2;                    
                    // piny = (450 - pin_h)/2 -1.5; 
                    // createCell(pinx, piny, pin_h, pin_w, 0, 0, 0, cell.name);
                }
            else
            {
                pinx = scale_x*(defData.pins[i].x+drawingOffset_x);
                piny = scale_y*Math.abs((defData.pins[i].y+drawingOffset_y)-Math.abs(defData.die.y2-defData.die.y1)) - pin_h;
                
                createPin(pinx, piny, pin_h, pin_w, defData.pins[i].name);
            }
            dropdownPins.innerHTML += '<li><a href="#" onClick="show(\''+defData.pins[i].name+'\')">'+defData.pins[i].name+'</a></li>';
        }
        //Drawing the nets
        function getLayerWidth(n)
        {
            return 0.8 + n * 0.08;
        }
        var dropdownNets = document.getElementById("dropdownNets");
        for (i in defData.nets)
        {
            var name = defData.nets[i].name;
            for (j in defData.nets[i].routes)
            {
                var metal_layer = defData.nets[i].routes[j].layer[5];
                var coord = defData.nets[i].routes[j].coords;
                var x1 = scale_x*(coord[0].x+drawingOffset_x);;
                var y1 = scale_y*Math.abs((coord[0].y+drawingOffset_y)-Math.abs(defData.die.y2-defData.die.y1));
                var x2 = (coord.length>1)?scale_x*(coord[1].x+drawingOffset_x): undefined;
                var y2 = (coord.length>1)?scale_y*Math.abs((coord[1].y+drawingOffset_y)-Math.abs(defData.die.y2-defData.die.y1)): undefined;
                if(defData.nets[i].name.startsWith("clk"))
                    createClkNet(name, metal_layer, getLayerWidth(metal_layer), x1, y1, x2, y2);
                else
                    createNet(name, metal_layer, getLayerWidth(metal_layer), x1, y1, x2, y2);

                //DRC
                record(coord, metal_layer);
            }
            dropdownNets.innerHTML += '<li><a href="#" onClick="showNet(\''+defData.nets[i].name+'\')">'+defData.nets[i].name+'</a></li>';
        }
        sort_all_records();
        console.log(all_wires);
        console.log(all_vias);
        check_drc();
        console.log(all_violations);
        all_violations.forEach(element => {
            
        });
        if(!draw_colors_once)
        {
            var div = document.getElementById('sidnavRight');
            for (var key in celltypeToColor)
                div.innerHTML += "<h6 style=background-color:rgb("+celltypeToColor[key].r+','+celltypeToColor[key].g+','+celltypeToColor[key].b+")>"+key+"</h6>"; ;
            draw_colors_once = 1;
        }
        $('[data-toggle="popover"]').popover({
            container: "body",
            placement: "auto",
            html: true
        });
        $("#myInputCells").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $("#dropdownCells li").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
        $("#myInputPins").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $("#dropdownPins li").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
        $("#myInputNets").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $("#dropdownNets li").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
});
    
});
// var h=true;
// var clk= true;


var svg_element;
var net;
var original_color;
var prev_input;
function show(input){
    if(svg_element!=undefined)
    {
        svg_element.classList.remove("blink_me");
        $('#'+prev_input).css('fill', original_color);
    }
    input = correctName(input);
    svg_element = document.getElementById(input);
    if(svg_element==null)
        alert(input + "Element doesn't exist!");
    else{
        original_color = $('#'+input).css('fill');
        $('#'+input).css('fill', '#DC143C');
        $('#'+input).popover('show');
        svg_element.classList.add("blink_me");
        prev_input = input;
    }
}
function showNet(input){
    if(net!=undefined)
    {
        for (var i=0; i<net.length; i++)
            {                    
                net[i].classList.remove("blink_me");               
                
            }
    }
    input = correctName(input);
    net = document.getElementsByClassName(input);
            if(net.length==0)
                alert("NET doesn't exist");
            else
                for (var i=0; i<net.length; i++)
                {                    
                    net[i].classList.add("blink_me");                 
                }
}
