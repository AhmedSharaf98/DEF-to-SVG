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

var num = -2;
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
    if(num == -1) opt_txt = "Pins";
    else if(num == 0) opt_txt = "Cells";
    var option = "<input type='checkbox' class='opt_layer' data-num=" + num + " checked>"+ opt_txt +"<br>";
    $(".sidenav").append(option);
    var html = makeSVGEl("g", {id: "group_" + num, "data-r":r,"data-b":b,"data-g":g });
    $(".svg-pan-zoom_viewport").append(html);
}
function createText(_x, _y, txt, layer){
//     var _html = makeSVGEl("text",
//         { x: _x, y: _y, style:"writing-mode: tb;"});
//     _html.innerHTML  = txt;
//    $("#group_" + layer).append(_html);
}
function createCell(_x, _y, _h, _w, r, b, g, txt){
    var html = makeSVGEl("rect",
     { x: _x, y: _y, height: _h, width: _w , fill:"rgba("+r+","+g+","+b+", 0.5)", style:"stroke:rgba("+r+","+g+","+b+", 1);stroke-width:0.5"});
    html.setAttribute("data-toggle", "popover");
    html.setAttribute("data-trigger", "hover");
    html.setAttribute("data-content", "Name: " + txt.name + "<br/>Type: " + txt.type);
    html.setAttribute("id", txt.name);
    $("#group_0").append(html);
    if(_w > 5) //TODO: Check the correct value
        createText(_x + _w/2, _y, txt, 0);
}
function createFlipFlop(_x, _y, _h, _w, r, b, g, txt){
    var html = makeSVGEl("rect",
     { x: _x, y: _y, height: _h, width: _w, class:"highlighted", fill:"rgba(0,0,0, 0.9)", style:"stroke:rgba(0,0,0, 1);stroke-width:0.5"});
    html.setAttribute("data-toggle", "popover");
    html.setAttribute("data-trigger", "hover");
    html.setAttribute("data-content", "Name: " + txt.name + "<br/>Type: " + txt.type);
    html.setAttribute("id", txt.name);
    $("#group_0").append(html);
    if(_w > 5) //TODO: Check the correct value
        createText(_x + _w/2, _y, txt);
}
function createPin(_x, _y, _h, _w, name){
    var html = makeSVGEl("rect",
    { x: _x - _w/2, y: _y + _h/2, height: _h, width: _w});
    html.setAttribute("id", name);
   $("#group_-1").append(html);
   if(_x > 20 || _x < 430)
       createText(_x + _w/2, _y, name, -1);
   else
       createText(_x, _y + _h/2, name, -1);
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
        { x1: p1x, y1: p1y, x2: p2x, y2: p2y,  style:"stroke:rgb("+r+","+g+","+b+");stroke-width:" + width + ";stroke-opacity: 0.5"});
    } else {
        html =  makeSVGEl("rect", 
        {x:p1x - 1.25, y:p1y - 1.25, height:"2.5", width:"2.5",fill:"red", style:"fill-opacity: .5"});
    }
    html.classList.add(netName);
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
        { x1: p1x, y1: p1y, x2: p2x, y2: p2y, style:"stroke:rgb(255,255,255);stroke-width:" + width, class:"clkHighlight"});
    } else {
        html =  makeSVGEl("rect", 
        {x:p1x - 1.25, y:p1y - 1.25, height:"2.5", width:"2.5",fill:"red",style:"fill-opacity: .5"});
    }
    html.classList.add(netName);  
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