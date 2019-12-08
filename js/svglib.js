var options = {
   panEnabled: true
  , controlIconsEnabled: false
  , zoomEnabled: true
  , dblClickZoomEnabled: true
  , mouseWheelZoomEnabled: true
  , preventMouseEventsDefault: true
  , zoomScaleSensitivity: 0.2
  , minZoom: 1
  , maxZoom: 10
  , fit: true
  , contain: true
  , center: true
  , refreshRate: 'auto'
  }
var svgElement = document.querySelector('#svg-container');
var panZoomTiger = svgPanZoom(svgElement,options);

var num = -3;
function makeSVGEl(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) {
      el.setAttribute(k, attrs[k]);
    }
    return el;
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function createLayer(){
    //RBGA Accepts values between 0 and 255
    var r = getRandomInt(256);
    var b = getRandomInt(256);
    var g = 0//;getRandomInt(256);
    opt_txt = "Metal " + ++num;
    if (num == -2) opt_txt = "DRC";
    else if(num == -1) opt_txt = "Pins";
    else if(num == 0) opt_txt = "Cells";
    var option = "<input type='checkbox' class='opt_layer' data-num=" + num + " checked>"+ opt_txt +"<br>";
    $(".sidenav").append(option);
    var html = makeSVGEl("g", {id: "group_" + num, "data-r":r,"data-b":b,"data-g":g });
    if(num == -2)
        $("#drc-container").append(html);
    else
        $("#not-drc-container").append(html);
}
function createText(_x, _y, txt, layer){
//     var _html = makeSVGEl("text",
//         { x: _x, y: _y, style:"writing-mode: tb;"});
//     _html.innerHTML  = txt;
//    $("#group_" + layer).append(_html);
}
function createCell(_x, _y, _h, _w, r, b, g, txt){
    var html = makeSVGEl("rect",
     { x: _x, y: _y, height: _h, width: _w , class: "cell",  fill:"transparent", stroke: "rgba(0,0,0,0.7)"});
     
    html.setAttribute("stroke-width", 1);
    html.setAttribute("data-toggle", "popover");
    html.setAttribute("data-trigger", "hover");
    html.setAttribute("data-content", "Name: " + txt.name + "<br/>Type: " + txt.type);
    console.log(correctName(txt.name));
    html.setAttribute("id", correctName(txt.name));
    $("#group_0").append(html);
    if(_w > 5) //TODO: Check the correct value
        createText(_x + _w/2, _y, txt, 0);
}
function createPin(_x, _y, _h, _w, name){
    var html = makeSVGEl("rect",
    { x: _x - _w/2, y: _y + _h/2, height: _h, width: _w});
    html.setAttribute("data-toggle", "popover");
    html.setAttribute("data-trigger", "hover");
    html.setAttribute("title", "PIN name");
    html.setAttribute("data-content", name);
    html.setAttribute("id", correctName(name));
   $("#group_-1").append(html);
   if(_x > 20 || _x < 430)
       createText(_x + _w/2, _y, name, -1);
   else
       createText(_x, _y + _h/2, name, -1);
}
function createDRC(violation){
    var wire1_x1 = violation[0][0].x;
    var wire1_y1 = violation[0][0].y;
    var wire1_x2 = violation[0][1].x;
    var wire1_y2 = violation[0][1].y;
    var wire2_x1 = violation[1][0].x;
    var wire2_y1 = violation[1][0].y;
    var wire2_x2 = violation[1][1].x;
    var wire2_y2 = violation[1][1].y;
    var offset = 5;
    var _x = Math.min(wire1_x1, wire1_x2, wire2_x1, wire2_x2) - offset;
    var _y = Math.min(wire1_y1, wire1_y2, wire2_y1, wire2_y2) - offset;
    var _width = Math.max(Math.abs(wire1_x1 - wire1_x2),Math.abs(wire2_x1 - wire2_x2)) + offset;
    var _height = Math.max(Math.abs(wire1_y1 - wire1_y2),Math.abs(wire2_y1 - wire2_y2)) + offset;

    var html = makeSVGEl("rect",
    { x: _x, y: _y , height: _height, width: _width, fill:"rgba(0,0,0, 0.9)", style:"stroke:rgba(0,0,0, 1);stroke-width:0.5"});
   $("#group_-2").append(html);
}

function createNet(netName, layerNum, width, p1x, p1y, p2x = undefined, p2y = undefined){
    if(layerNum > num){
        while(num <= layerNum){
            createLayer();
        }
    }
    var r = $("#group_" + layerNum).data('r');
    var g = $("#group_" + layerNum).data('g');
    var b = $("#group_" + layerNum).data('b');
    var html;
    if(p2x != undefined){
        html = makeSVGEl("line",
        { x1: p1x, y1: p1y, x2: p2x, y2: p2y,  stroke: "rgb("+r+"," + g +"," + b + ")"});
        html.setAttribute("data-layer", layerNum);
        html.setAttribute("stroke-width", width);
        html.setAttribute("stroke-opacity", 0.5);
    } else {
        html =  makeSVGEl("rect", 
        {x:p1x - 1.25, y:p1y - 1.25, height:"2.5", width:"2.5",fill:"red", style:"fill-opacity: .5"});
    }
    html.classList.add(correctName(netName));
    $("#group_" + layerNum).append(html);
}

function createClkNet(netName, layerNum, width, p1x, p1y, p2x = undefined, p2y = undefined){
    if(layerNum > num){
        while(num <= layerNum){
            createLayer();
        }
    }
    console.log(netName);
    var html;
    if(p2x != undefined){
        html = makeSVGEl("line",
        { x1: p1x, y1: p1y, x2: p2x, y2: p2y, style:"stroke:rgba(0,0,255,0.7);stroke-width:" + width, class:"clkHighlight"});
    } else {
        html =  makeSVGEl("rect", 
        {x:p1x - 1.25, y:p1y - 1.25, height:"2.5", width:"2.5",fill:"red",style:"fill-opacity: .5"});
    }
    html.classList.add("clk");
    //html.classList.add(netName);  
    $("#group_" + layerNum).append(html);
}


function exp(){
    var svg = document.getElementById("svg-container");

    //get svg source.
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svg);

    //add name spaces.
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    $('#link').show();
    //convert svg source to URI data scheme.
    var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

    //set url value to a element's href attribute.
    document.getElementById("link").href = url;
}
$(document).ready(function() {
    createLayer(); //For DRC
    createLayer(); //For PINS
    createLayer(); //FOR CELLS
    $('#link').hide();
    //set initial state.
       $(document).on('change', 'input[type="checkbox"]', function() {
        var n = $(this).data('num');
        if(this.checked) {
            $("#group_" + n).show();
        } else {
            $("#group_" + n).hide();
        }
        $('#textbox1').val(this.checked);        
    });
});
function correctName(input)
{
    if(input[input.length-1]=='>')
    {
        input = input.replace('<','_').replace('>','_');
    }
    return input;
}