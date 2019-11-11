var options = {
   panEnabled: true
  , controlIconsEnabled: true
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

var num = 0;
function layer(num) {
    this.index = num;
    this.add = function(){
        console.log(this.index);
    };
}
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
    var g = getRandomInt(256);
    var option = "<input type='checkbox' class='opt_layer' data-num=" + ++num + " checked>Layer "+ num +"<br>";
    $(".sidenav").append(option);
    var html = makeSVGEl("g", {id: "group_" + num, "data-r":r,"data-b":b,"data-g":g });
    $(".svg-pan-zoom_viewport").append(html);
}

function createCell(_x, _y, _h, _w, r, b, g){
    var html = makeSVGEl("rect",
     { x: _x, y: _y, height: _h, width: _w, fill:"rgba("+r+","+g+","+b+", 0.5)", style:"stroke:rgba("+r+","+g+","+b+", 1);stroke-width:0.5"});
    $("#group_" + num).append(html);
}

function createWire(p1x, p1y, p2x, p2y){
    var r = $("#group_" + num).data('r');
    var g = $("#group_" + num).data('g');
    var b = $("#group_" + num).data('b');
    var html = makeSVGEl("line",
     { x1: p1x, y1: p1y, x2: p2x, y2: p2y,  style:"stroke:rgb("+r+","+g+","+b+");stroke-width:2"});
    $("#group_" + num).append(html);
}

function createText(_x, _y, txt, rotated){
    // <text x="10" y="20" style="writing-mode: tb;">
    //                     Vertical
    //                 </text>
    var _html;
    if(rotated){
        _html = makeSVGEl("text",
        { x: _x, y: _y, style:"writing-mode: tb;"});
    } else {
        _html = makeSVGEl("text",
        { x: _x, y: _y,});
    }
    _html.innerHTML  = txt;
   $("#group_" + num).append(_html);
}
function createAndHighlightFF(_x, _y, _h, _w, r, b, g){
    var html = makeSVGEl("rect",
     { x: _x, y: _y, height: _h, width: _w, fill:"rgba("+r+","+g+","+b+", 0.5)", style:"stroke:rgba("+r+","+g+","+b+", 1);stroke-width:0.5"});
    $("#group_" + num).append(html);
}

$(document).ready(function() {
    
    //set initial state.
    $('#x').on(
        'change', 
         'select', 
          function () { 
            alert('helo'); 
          }
       );
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

createLayer();
createCell(10,20,30,40,0,255,0);
createWire(10,20,30,40);
createText(50,50,"ahmed",true);
createText(50,50,"ahmed",false);