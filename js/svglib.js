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
function createLayer(){
    var option = "<input type='checkbox'  class='opt_layer' data-num=" + ++num + " checked>Layer "+ num +"<br>";
    $(".sidenav").append(option);
    var html = makeSVGEl("g", {id: "group_" + num });
    $("#svg-container").append(html);
}

function createCell(x, y, h, w, color){

}

function createMetal(_x, _y, _h, _w){
    var html = makeSVGEl("rect", { x: _x, y: _y, height: _h, width: _w, fill:"url(#hashed_1)" });
    $("#group_" + num).append(html);
}

$(document).ready(function() {
    //set initial state.
    $('.opt_layer').change(function() {
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
createMetal(0,0,50,50);
createMetal(20,20,50,50);
createMetal(40,40,50,50);
createLayer();
createMetal(60,60,50,50);
createMetal(80,80,50,50);
createMetal(100,100,10,10);