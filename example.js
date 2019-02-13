function getPointInBetweenByLen(pointA, pointB, length) {
    
    var dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
    return pointA.clone().add(dir);
       
}

function getPointInBetweenByPerc(pointA, pointB, percentage) {
    
    var dir = pointB.clone().sub(pointA);
    var len = dir.length();
    dir = dir.normalize().multiplyScalar(len*percentage);
    return pointA.clone().add(dir);
       
}

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene = new THREE.Scene();
    
    var material = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });
    
    var geometry = new THREE.Geometry();
    var pointA = new THREE.Vector3(-10,0,0);
    var pointB = new THREE.Vector3(10,30,0);
    
    geometry.vertices.push(pointA);
    geometry.vertices.push(pointB);
    
    var line = new THREE.Line(geometry, material);
    scene.add(line);
    
    
    // Paint by absolute 
    var geometry = new THREE.SphereGeometry( 1, 16, 16 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry, material );
    var newPointAbs = getPointInBetweenByLen(pointA, pointB, 12);
    sphere.position.set(newPointAbs.x, newPointAbs.y, newPointAbs.z);
    scene.add( sphere );
    
    // Paint by percentage
    var geometry2 = new THREE.SphereGeometry( 1, 16, 16 );
    var material2 = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    var sphere2 = new THREE.Mesh( geometry2, material2 );
    var newPointPerc = getPointInBetweenByPerc(pointA, pointB, 0.75);
    sphere2.position.set(newPointPerc.x, newPointPerc.y, newPointPerc.z);
    scene.add( sphere2 );
    
    
    renderer.render(scene, camera);
}

init();