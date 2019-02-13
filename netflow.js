//main components
var camera, scene, renderer;
//system clock
var clock = new THREE.Clock();
var nameConvec = 0;
//radiou of device base
const s_radious=2;
//height of device base
const s_height=1.2;
//for setting flow speed of packets
const flow_speed =0.02;
var timer;
var json_resp ={
    "1":{
        "type":"router",
        "mac" : "BA03ADEAE2A0",
        "speed":"1000",
        "ip" : ["192.168.1.1","192.168.2.1","192.168.3.1"],
        "child":[
            {
                "type":"switch",
                "mac" : "EBA6D7E41A34",
                "speed":"1000",
                "ip" : "192.168.1.2",
                "child":
                [
                    {
                        "type":"device",
                        "mac" : "EBA6D7E41A35",
                        "speed":"60",
                        "ip" : "192.168.1.3"
                    },
                    {
                        "type":"device",
                        "mac" : "EBA6D7E41A6",
                        "speed":"60",
                        "ip" : "192.168.1.4"
                    }
                ]
            },
            {
                "type":"switch",
                "mac" : "484AD7233FE7",
                "speed":"1000",
                "ip" : "192.168.2.2",
                "child":
                [
                    {
                        "type":"device",
                        "mac" : "DBA6D7E41A35",
                        "speed":"60",
                        "ip" : "192.168.2.3"
                    },
                    {
                        "type":"device",
                        "mac" : "DBA6D7E41A6",
                        "speed":"60",
                        "ip" : "192.168.2.4"
                    }
                ]
            }
        ]
    },
    "2":{
        "type":"router",
        "mac" : "A1AACA4E3149",
        "ip" : ["192.168.3.1","192.168.4.1"],
        "child":[
            {
            "type":"server",
            "mac" : "8FA2765053F9",
            "speed": "100",
            "ip" : "192.168.4.2"
            }
        ]
    }
};
//holds all the packet flow information which is underway
var json_flow = {};

init();
animate();

function init() {
    //renderer init
    renderer = new THREE.WebGLRenderer({antialias: true} );
    renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(172, 170, 170)');
    document.getElementById('webgl').appendChild(renderer.domElement);
    //camera init
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 20;
    camera.position.z = 20;
    //Scene init
    scene = new THREE.Scene();
    //light init
    var light_amb = new THREE.AmbientLight(0xffffff, 0.5);
    var light_point = new THREE.PointLight(0xffffff, 0.5);
    scene.add(light_amb);
    scene.add(light_point);
    
   
    addRouter(0,0);
        addSwitch(10,0,0,0); 
            addDevice(15,-10,10,0);
            addDevice(20,0,10,0);
            addDevice(15,10,10,0);
        addSwitch(-10,0,0,0);
            addDevice(-15,10,-10,0);
            addDevice(-20,0,-10,0);
            addDevice(-15,-10,-10,0);
    addRouter(0,-10);
        drawRouterPipe(0,0,0,-10);
           addServer(0,-20,0,-10);
   
    timer = new Date().getTime();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    animateFlow(-15,10,-10,0,60,134);
    animateFlow(-15,-10,-10,0,60,134);
    animateFlow(0,0,10,0,60,134);
    animateFlow(10,0,15,-10,60,134);
    animateFlow(10,0,20,0,60,134); 
    animateFlow(0,-10,0,-20,60,134);   

	//update(renderer, scene, camera, controls, clock)
    

}
function animate() {
    var timeElapsed = clock.getElapsedTime();
    for (var i=1; i <= nameConvec;i++){
        movePipe('pipe-'+i, timeElapsed);
    }
    //console.log(json_flow.toString());
    for (var key in json_flow) {
        //console.log(key);
        if (json_flow.hasOwnProperty(key)) {
            movePackets(key,timeElapsed);
        }
    }
    if ((new Date().getTime() - timer) > 1000){
        timer = new Date().getTime();
        animateFlow(-15,10,-10,0,60,134);
        animateFlow(-15,-10,-10,0,60,134);
        animateFlow(0,0,10,0,60,134);
        animateFlow(10,0,15,-10,60,134);
        animateFlow(10,0,20,0,60,134); 
        animateFlow(0,-10,0,-20,60,134);   

    }
    requestAnimationFrame( animate );
    //animateFlow(10,0,0,0);
    renderer.render( scene, camera );
}
function movePackets(packets, timeElapsed){
    console.log("packet_move_key-"+packets);
    var packet = scene.getObjectByName(packets);  
    var list = findCoordinate([packet.position.x,packet.position.z],[json_flow[packets]["x"],json_flow[packets]["y"]])

    if(packet.position.x == json_flow[packets]["x"] && packet.position.z == json_flow[packets]["y"] ){
        removePacket(packet);
        delete json_flow[packets];
    }
    else{
        try {        
            packet.position.x = list[1][0];
            packet.position.z = list[1][1]; 
            packet.rotation.x += 0.01;
            packet.rotation.y += 0.01;
            packet.rotation.z += 0.01;
            }
            catch(err) {
                removePacket(packet);
                delete json_flow[packets];
            }
    }
}

//add color option
function animateFlow(position_x,position_y,parent_x,parent_y,pipe,num_packets){
   // var pmesh;
   // if(num_packets > 10 ){
     /*   var geometry = new THREE.BoxBufferGeometry( 0.2,0.2, 0.2 );
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var cubeA = new THREE.Mesh( geometry, material );
        cubeA.position.set( position_x-0.4, -0.1, position_y );
        var cubeB = new THREE.Mesh( geometry, material );
        cubeB.position.set( position_x+0.4, +0.1, position_y-0.6 );
        var cubeC = new THREE.Mesh( geometry, material );
        cubeC.position.set( position_x+0.6, +0.3, position_y+0.6 );
        var cubeD = new THREE.Mesh( geometry, material );
        cubeD.position.set( position_x+0.7, -0.2, position_y-0.9 );
        var pmesh = new THREE.Group();
        pmesh.add( cubeA );
        pmesh.add( cubeB );
        pmesh.add( cubeC );
        pmesh.add( cubeD );
        scene.add( pmesh );
   }*/
  //  else{
        var pgeometry = new THREE.BoxGeometry( 0.3, 0.3, 0.3 );
        var pmaterial = new THREE.MeshNormalMaterial();
        var pmesh = new THREE.Mesh( pgeometry, pmaterial );
        pmesh.position.x = position_x;
        pmesh.position.y = 0;
        pmesh.position.z = position_y;
        scene.add(pmesh);
   // }
    
    pmesh.name = generateUUID();
    json_flow[pmesh.name]={};
    json_flow[pmesh.name]["x"]=parent_x;
    json_flow[pmesh.name]["y"]=parent_y;
    json_flow[pmesh.name]["color"]="blue";
    json_flow[pmesh.name]["packets"]=num_packets; 
}
function addRouter(position_x,position_y){
    //creating base 
    var temp_geometry =new THREE.CylinderGeometry( s_radious, s_radious, s_height, 64 );
    var texture = new THREE.TextureLoader().load( '/assets/textures/concrete.JPG' );
    var temp_material  = new THREE.MeshBasicMaterial( { map: texture } );
    temp_mesh = new THREE.Mesh( temp_geometry, temp_material );
    temp_mesh.position.x = position_x;
    temp_mesh.position.y = 0;
    temp_mesh.position.z = position_y;
    scene.add( temp_mesh );
    //adding model switch
    modelRouter(position_x,position_y);
    //#28292D
}
/*
    leftSide,        // Left side
    rightSide,       // Right side
    topSide,         // Top side
    bottomSide,      // Bottom side
    frontSide,       // Front side
    backSide         // Back side
*/

function addSwitch(position_x,position_y,parent_x,parent_y){
    //creating base 
    temp_geometry =new THREE.CylinderGeometry( s_radious, s_radious, s_height, 64 );
    var texture = new THREE.TextureLoader().load( '/assets/textures/concrete.JPG' );
    temp_material  = new THREE.MeshBasicMaterial( { map: texture } );
    temp_mesh = new THREE.Mesh( temp_geometry, temp_material );
    temp_mesh.position.x = position_x;
    temp_mesh.position.y = 0;
    temp_mesh.position.z = position_y;
    scene.add( temp_mesh );
    //adding model switch
    modelSwitch(position_x,position_y);
    //drawing pipe between parent and child
    nameConvec ++;
    drawPipe(new THREE.Vector3(position_x,0,position_y),new THREE.Vector3(parent_x,0,parent_y),scene,1000, 'pipe-'+nameConvec);
    //renderer.render( scene, camera );
}
function addDevice(position_x,position_y,parent_x,parent_y){
    //creating base 
    temp_geometry =new THREE.CylinderGeometry( s_radious, s_radious, s_height, 64 );
    var texture = new THREE.TextureLoader().load( '/assets/textures/concrete.JPG' );
    temp_material  = new THREE.MeshBasicMaterial( { map: texture } );
    temp_mesh = new THREE.Mesh( temp_geometry, temp_material );
    temp_mesh.position.x = position_x;
    temp_mesh.position.y = 0;
    temp_mesh.position.z = position_y;
    scene.add( temp_mesh );
    //adding model computer 
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setBaseUrl( '/assets/models/' );
    mtlLoader.setPath( '/assets/models/' );
    var url = "PCX.mtl";
    mtlLoader.load( url, function( materials ) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );
    objLoader.setPath( '/assets/models/' );
    objLoader.load( 'PCX.obj', function ( object ) {

        object.position.x = position_x;
        object.position.y = -0.85;
        object.position.z = position_y-1;
        scene.add( object );

    } );
    }); 
    //creating texture
    //drawing pipe between parent and child
    nameConvec ++;
    drawPipe(new THREE.Vector3(position_x,0,position_y),new THREE.Vector3(parent_x,0,parent_y),scene,100,'pipe-'+nameConvec);
    //renderer.render( scene, camera );
}
function addServer(position_x,position_y,parent_x,parent_y){
    //creating base 
    temp_geometry =new THREE.CylinderGeometry( s_radious, s_radious, s_height, 64 );
    var texture = new THREE.TextureLoader().load( '/assets/textures/concrete.JPG' );
    temp_material  = new THREE.MeshBasicMaterial( { map: texture } );
    temp_mesh = new THREE.Mesh( temp_geometry, temp_material );
    temp_mesh.position.x = position_x;
    temp_mesh.position.y = 0;
    temp_mesh.position.z = position_y;
    scene.add( temp_mesh );
    //adding model server
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setBaseUrl( '/assets/models/' );
    mtlLoader.setPath( '/assets/models/' );
    var url = "Server.mtl";
    mtlLoader.load( url, function( materials ) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );
    objLoader.setPath( '/assets/models/' );
    objLoader.load( 'Server.obj', function ( object ) {

        object.position.x = position_x;
        object.position.y = +0.85;
        object.position.z = position_y+0.75;
        object.rotation.y = Math.PI *1.2;
        scene.add( object );

    } );
    }); 
    //drawing pipe between parent and child
    nameConvec ++;
    drawPipe(new THREE.Vector3(position_x,0,position_y),new THREE.Vector3(parent_x,0,parent_y),scene,1000,'pipe-'+nameConvec);
    //renderer.render( scene, camera );
}
function resize(renderer, scene, camera, controls, clock) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
      return;
  }

function drawPipe(vstart, vend,scene,speed, name){
    var radious = 0
    if(speed == 60){
        radious = 0.35
    }
    if(speed == 100){
        radious = 0.4
    }
    else if (speed == 1000){
        radious = 0.55;
    }
    else{
        radious = 0.6
    }
    pipe_position_x = (vstart.x+vend.x)/2
    pipe_position_z = (vstart.z+vend.z)/2
    var HALF_PI = Math.PI * .5;
    var distance = vstart.distanceTo(vend);
    var position  = vend.clone().add(vstart).divideScalar(2);
        // Defining arrow texture
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = 64;
    ctx.canvas.height = 64;

    ctx.fillStyle = "rgba(0,0,255,0.5)";
    ctx.fillRect(0, 0, 64, 64);

    ctx.translate(32, 32);
    ctx.rotate(Math.PI * .5);
    ctx.fillStyle = "rgb(23, 23, 23)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "48px sans-serif";
    ctx.fillText("-", 0, 0);

        const radiusTop = 0.3;
    const radiusBottom = 0.3;
    const height = 1;
    const radiusSegments = 20;
    const heightSegments = 2;
    const openEnded = true;

    const texture = new THREE.CanvasTexture(ctx.canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.x = 5;
    texture.repeat.y = 12;
    var material = new THREE.MeshLambertMaterial({
        color:0xffffff,
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });
    var cylinder = new THREE.CylinderGeometry(radious,radious,distance+s_radious,10,10,false);
    var orientation = new THREE.Matrix4();
    var offsetRotation = new THREE.Matrix4();
    orientation.lookAt(vstart,vend,new THREE.Vector3(0,1,0));
    offsetRotation.makeRotationX(HALF_PI);
    orientation.multiply(offsetRotation);
    cylinder.applyMatrix(orientation)
    var temp_mesh = new THREE.Mesh(cylinder,material);
    temp_mesh.position.x=pipe_position_x;
    temp_mesh.position.z=pipe_position_z;
    temp_mesh.position.y=0;
    scene.add(temp_mesh);
    temp_mesh.name= name;
    }
function modelRouter(position_x,position_y){
    var cubeMaterialArray = [];
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('/assets/textures/matt.jpg')} ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('/assets/textures/matt.jpg')} ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('/assets/textures/matt.jpg')} ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('/assets/textures/matt.jpg')} ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('/assets/networking/cisco3945.JPG')} ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('/assets/textures/matt.jpg')} ) );
    var cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );
    var cubeGeometry = new THREE.BoxGeometry( 2.5, 1, 2);
    mesh_cube = new THREE.Mesh( cubeGeometry, cubeMaterials );
    mesh_cube.position.x = position_x;
    mesh_cube.position.y = 1.2;
    mesh_cube.position.z = position_y;
    scene.add(mesh_cube);
}
function modelSwitch(position_x,position_y){
    var cubeMaterialArray = [];
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('/assets/textures/matt.jpg')} ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('/assets/textures/matt.jpg')} ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('/assets/textures/matt.jpg')} ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('/assets/textures/matt.jpg')} ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('/assets/networking/cisco2960.JPG')} ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('/assets/textures/matt.jpg')} ) );
    var cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );
    var cubeGeometry = new THREE.BoxGeometry( 2.5, 0.5,1.5);
    mesh_cube = new THREE.Mesh( cubeGeometry, cubeMaterials );
    mesh_cube.position.x = position_x;
    mesh_cube.position.y = 0.8;
    mesh_cube.position.z = position_y;
    scene.add(mesh_cube);
}
function drawRouterPipe(position_x,position_y,parent_x,parent_y){
    nameConvec++;
    drawPipe(new THREE.Vector3(position_x,0,position_y),new THREE.Vector3(parent_x,0,parent_y),scene,1000,'pipe-'+nameConvec);
}

function movePipe(pipe, timeElapsed){
    var pipe1 = scene.getObjectByName(pipe);
    pipe1.material.map.offset.y = (timeElapsed * 3 % 1);
}

function findCoordinate(A,B){
    var m = findSlope(A, B);
    var b = findIntercept(A, m);

    var coordinates = [];
    var coordinates = [];
    var i=0;
    for (var x = A[0]; x <= B[0]; x=x+flow_speed) {
    var y = m * x + b;
    i++;
    coordinates.push([x, y]);
    if(i==2){
        break;
    }
    }
    //console.log(coordinates);
    return coordinates;
}
function removePacket(object) {
    console.log("packet_remove_key-"+object);
    var selectedObject = scene.getObjectByName(object.name);
    scene.remove( selectedObject );
}


function findSlope(a, b) {
    if (a[0] == b[0]) {
        return null;
    }

    return (b[1] - a[1]) / (b[0] - a[0]);
}

function findIntercept(point, slope) {
    if (slope === null) {
        return point[0];
    }
    return point[1] - slope * point[0];
}
function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
