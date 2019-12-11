spacing = {1:200, 2:160, 3:200, 4:320}  // from the lef file
all_wires = {};
all_vias = {};
all_violations = [];
function record(coord, metal_layer){ //record violations
    if (coord.length == 1){
        if (all_vias[metal_layer] == null)
            all_vias[metal_layer] = []
        all_vias[metal_layer].push(coord);
    }
    else if (coord.length == 2){
        if (all_wires[metal_layer] == null)
            all_wires[metal_layer] = {h:[], v:[]};
        if(coord[0].y == coord[1].y)    //horizontal    
            all_wires[metal_layer].h.push(coord); //check horizontal 
        else if (coord[0].x == coord[1].x)    //vertical    
            all_wires[metal_layer].v.push(coord); //check vertical
        else
            console.log("invalid wire!!"); 
    }
}
function sort_all_records(){
    for (key in Object.keys(all_wires)){
        if (all_wires.hasOwnProperty(key)){
            all_wires[key].h.sort(function (a,b){
                return (a[0].y < b[0].y)? -1 : 1; 
            });
            all_wires[key].v.sort(function (a,b){
                return (a[0].x < b[0].x)? -1 : 1; 
            });
        }
    }
}
function intersect_vertically(a, b){
    return !((Math.min(a[0].x, a[1].x) >= Math.max(b[0].x, b[1].x)) || (Math.min(b[0].x, b[1].x) >= Math.max(a[0].x, a[1].x)));
}
function intersect_horizontally(a, b){
    return !((Math.min(a[0].y, a[1].y) >= Math.max(b[0].y, b[1].y)) || (Math.min(b[0].y, b[1].y) >= Math.max(a[0].y, a[1].y)));
}
function vertical_spacing_violation(a, b, metal_layer){
    return (Math.abs(a[0].y - b[0].y) < spacing[metal_layer]);
}
function horizontal_spacing_violation(a, b, metal_layer){
    return (Math.abs(a[0].x - b[0].x) < spacing[metal_layer]);
}
function check_drc(){
    for (key in Object.keys(all_wires)){
        if (all_wires.hasOwnProperty(key)){
            m = all_wires[key];
            for (i=0;i<m.h.length-1; i++){
                for (j=i+1;j<m.h.length;j++){
                    if (!vertical_spacing_violation(m.h[i], m.h[j], key))
                        break;
                    if (intersect_vertically(m.h[i], m.h[j])){
                        console.log("violation!");
                        all_violations.push([m.h[i], m.h[j]]);
                    }
                }
            }
            for (i=0;i<m.v.length-1; i++){
                for (j=i+1;j<m.v.length;j++){
                    if (!horizontal_spacing_violation(m.v[i], m.v[j], key)) //horizontal violations
                        break;
                    if (intersect_horizontally(m.v[i], m.v[j])){
                        console.log("violation!");
                        all_violations.push([m.v[i], m.v[j]]);
                    }
                }
            }
        }
    }
}