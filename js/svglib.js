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

var num = 1;
function layer(num) {
    this.index = num;
    this.add = function(){
        console.log(this.index);
    };
  }
function createLayer(){
    var l = new layer();
    l.add();
    return l;
}
function getIndex(){
    num = num + 1;
    alert(num);
    return num;
}

var l1 = createLayer(getIndex());
var l2 = createLayer(getIndex());