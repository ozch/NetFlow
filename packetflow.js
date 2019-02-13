function slopFind(x1,y1,x2,y2){
    m = (y1 - y2)/(x1 - x2);
    return m;
}
function findCoordinate(x){
    y = mx;
    return y;
}
function removePacket(object) {
    var selectedObject = scene.getObjectByName(object.name);
    scene.remove( selectedObject );
    animate();
}