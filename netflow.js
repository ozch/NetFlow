//main components
var camera, scene, renderer,controls;
//system clock
var clock = new THREE.Clock();
//constant for getBase();
const s_radious=2;
const s_height=1.2;
//used in findCoordinate to set Speed
const flow_speed =0.2;
//size of cube for animate
const cube_size = 0.15;
//one packet  in animate equal to number of real packets
const packet_equal = 2;
var timer;
var locations = { };
var json_resp ={
    "1":{
        "type":"router",
        "mac" : "BA03ADEAE2A0",
        "speed":"1000",
        "ip" : ["192.168.1.1","192.168.2.1","192.168.3.1"],
        "child":[
            {
                "type":"server",
                "mac" : "EBA6D7E41A34",
                "speed":"1000",
                "ip" : "192.168.1.2",
            },
            {
                "type":"device",
                "mac" : "EBA6D7E41A34",
                "speed":"1000",
                "ip" : "192.168.1.3",
            },
            {
                "type":"switch",
                "mac" : "EBA6D7E41A34",
                "speed":"1000",
                "ip" : "192.168.1.4",
                "child":
                [
                    {
                        "type":"device",
                        "mac" : "EBA6D7E41A35",
                        "speed":"60",
                        "ip" : "192.168.1.5"
                    },
                    {
                        "type":"device",
                        "mac" : "EBA6D7E41A6",
                        "speed":"60",
                        "ip" : "192.168.1.6"
                    },
                    {
                        "type":"switch",
                        "mac" : "484AD7233FE7",
                        "speed":"1000",
                        "ip" : "192.168.2.7",
                        "child":
                        [
                            {
                                "type":"device",
                                "mac" : "DBA6D7E41A35",
                                "speed":"60",
                                "ip" : "192.168.2.3"
                            },
                            {
                                "type":"server",
                                "mac" : "DBA6D7E41A6",
                                "speed":"60",
                                "ip" : "192.168.2.4"
                            }
                        ]
                    }
                ]
            }
            
        ]
    }
};
var color = {
    80: 'olive',//http
    443: 'green',//https
    20: 'purple',//ftp
    21: 'purple',//ftp
    22: 'red',//ssh
    23: 'red',//tenet
    38: 'red',//remote acces protocol
    43: 'yellow',//whois
    513: 'yellow',//who
    25: 'teal',//STMP
    53: 'yellow',//dns
    109: 'teal',//mail pop
    110: 'teal',//mail pop3
    143: 'teal',//mail imap4
    161: 'orange',//snmp
    162: 'orange',//snmp trap
    220: 'teal',//mail imap
    336: 'teal',//mail smtp
    989: 'purple',//ftp
    990: 'purple',//ftp
    993: 'teal',//mail imap
    992: 'red',//tellnet
    995: 'teal',//mail pop3 ssl
    902: 'blue',//vmware server
    3306: 'navy',//traffic
    8000: 'black',//server
};
var net_flow = [
    {
        "start" : "192.168.1.3",
        "packets": 4,
        "dest_port": 8000,
        "path" : ["192.168.1.1","192.168.1.4","192.168.2.7","192.168.2.4"]
    },
    {
        "start" : "192.168.1.2",
        "packets": 4,
        "dest_port": 220,
        "path" : ["192.168.1.1"]
    },
    {
        "start" : "192.168.1.1",
        "packets": 4,
        "dest_port": 3306,
        "path" : ["192.168.1.4"]
    },
    {
        "start" : "192.168.2.3",
        "packets": 4,
        "dest_port": 220,
        "path" : ["192.168.2.7","192.168.2.4"]
    },
    {
        "start" : "192.168.2.3",
        "packets": 4,
        "dest_port": 80,
        "path" : ["192.168.2.7","192.168.2.4"]
    },
    {
        "start" : "192.168.2.3",
        "packets": 4,
        "dest_port": 111,
        "path" : ["192.168.2.7","192.168.2.4"]
    },
    {
        "start" : "192.168.2.3",
        "packets": 4,
        "dest_port": 111,
        "path" : ["192.168.2.7","192.168.2.4"]
    }
];
//holds all the packet flow information which is underway
var json_flow = {};

init();
animate();
function initCamera(){
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 20;
    camera.position.z = 20;
    controls = new THREE.OrbitControls( camera );
    controls.update();
}
function initRenderer(){
    renderer = new THREE.WebGLRenderer({antialias: true} );
    renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(172, 170, 170)');
    document.getElementById('webgl').appendChild(renderer.domElement);   
}
function initScene(){
    scene = new THREE.Scene();
}
function initLights(){
    var light_amb = new THREE.AmbientLight(0xffffff, 0.5);
    var light_point = new THREE.PointLight(0xffffff, 0.5);
    scene.add(light_amb);
    scene.add(light_point);
}
function initTimer(){
    timer = new Date().getTime();
}
function init() {
    //Initiating requirements
    initRenderer();
    initCamera();
    initScene();
    initLights();
    initTimer();
    assignPositions();
    drawDevices();    
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    var controls = new THREE.OrbitControls(camera, renderer.domElement);

}
function animate() {
    var timeElapsed = clock.getElapsedTime();

    controls.update();
    var json_flow_c = JSON.parse(JSON.stringify(json_flow))
    for (var key in json_flow_c) {
    
        if (json_flow_c.hasOwnProperty(key)) {
            movePackets(key,timeElapsed);
        }
    }
    if ((new Date().getTime() - timer) > 400){
    timer = new Date().getTime();
    net_flowx = [
        {
            "start" : "192.168.1.2",
            "packets": 4,
            "dest_port": 22,
            "path" : ["192.168.1.1"]
        },
        {
            "start" : "192.168.1.1",
            "packets": 4,
            "dest_port": 22,
            "path" : ["192.168.1.4"]
        },
        {
            "start" : "192.168.2.3",
            "packets": 4,
            "dest_port": 22,
            "path" : ["192.168.2.7","192.168.2.4"]
        },
        {
            "start" : "192.168.2.3",
            "packets": 4,
            "dest_port": 22,
            "path" : ["192.168.2.7","192.168.2.4"]
        },
        {
            "start" : "192.168.2.3",
            "packets": 4,
            "dest_port": 22,
            "path" : ["192.168.2.7","192.168.2.4"]
        },
        {
            "start" : "192.168.2.3",
            "packets": 4,
            "dest_port": 22,
            "path" : ["192.168.2.7","192.168.2.4"]
        }
    ];
    addToAnmimateFlow();
    }
    requestAnimationFrame( animate );
    
    renderer.render( scene, camera );
}
function getdistance(A,B){
    vec1 = new THREE.Vector3(A[0],0,A[1])
    vec2 = new THREE.Vector3(B[0],0,B[1])
    var distance = vec1.distanceTo( vec2 );
return distance
//Math.sqrt(Math.pow(A[0]-B[0],2)+Math.pow(A[1]-B[1],2))
}
function isBoxRemovable(packet,packets){
    var x1=packet.position.x;
    var x2=json_flow[packets]["x"];

    var y1=packet.position.z;
    var y2=json_flow[packets]["y"];
    ans = getdistance([x1,y1],[x2,y2]);
    console.log(ans);
    if(ans<s_radious/3){
        console.log("removeable")
        return true;
        
    }
    else{
        return false;
    }
}
function movePackets(packets){
   
    var packet = scene.getObjectByName(packets);  
    var list = findCoordinate([packet.position.x,packet.position.z],[json_flow[packets]["x"],json_flow[packets]["y"]]);
    if(isBoxRemovable(packet,packets)){
        var dest_port = json_flow[packets]["dest_port"];
        var parent_ip = json_flow[packets]["parent_ip"];
        var pack = json_flow[packets]["packets"];
        var path = json_flow[packets]["path"];
        removePacket(packet);
        delete json_flow[packets];
        if(path.length != 0){
            var re_entry = {
                "start" : parent_ip,
                "packets": pack,
                "dest_port": dest_port,
                "path" : path
            };
            net_flow.push(re_entry);
            //next_ip = path.shift();
            //console.log(next_ip);
            //animateFlow(x,y,next_ip[0],next_ip[1],100,path,dest_port);
        }
        
        
        
        
        /*}
        else{
            
            json_flow[packets]["x"] = path.shift();
            json_flow[packets]["y"] = path.shift();
        }
        */
        
    }
    else{
        try {        
            packet.position.x = list[0];
            packet.position.z = list[1]; 
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

async function addToAnmimateFlow(){
    while(net_flow.length!=0){
        //getting coordinate of starting ip/device
        var start_pos = locations[net_flow[0]["start"]];
        console.log(start_pos);
        var path = net_flow[0]["path"];
        if(path.length>=1){
            
            var next_ip = path.shift();
            console.log(next_ip);
        }
        var parent_pos = locations[next_ip];
        var total_packets =net_flow[0]["packets"];
        var packets = Math.ceil(total_packets/packet_equal);
        var dest_port = net_flow[0]["dest_port"];
        for(let packet = 1;packet<=packets;packet++){
            await animateFlow(start_pos[0],start_pos[1],parent_pos[0],parent_pos[1],100,path,dest_port,next_ip,total_packets);
            net_flow.shift();
            sleep(1400);
        }
        
    }
}

//add color option
function animateFlow(position_x,position_y,parent_x,parent_y,pipe=100,path,dest_port,next_ip,total_packets){
    var pgeometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    
    if (color.hasOwnProperty(dest_port)) {
        
        var pmaterial = new THREE.MeshBasicMaterial({color:color[dest_port]});
    }else{
        var pmaterial = new THREE.MeshNormalMaterial();
    }
    
    var pmesh = new THREE.Mesh( pgeometry, pmaterial );
    pipe_rad = getPipeRadious(pipe);
    pmesh.position.x = position_x+getCubeRandLocation(pipe_rad);
    pmesh.position.y = 0+getCubeRandLocation(pipe_rad);
    pmesh.position.z = position_y+getCubeRandLocation(pipe_rad);
    scene.add(pmesh);
    pmesh.name = generateUUID();
    json_flow[pmesh.name]={};
    json_flow[pmesh.name]["x"]=parent_x;
    json_flow[pmesh.name]["y"]=parent_y;
    json_flow[pmesh.name]["parent_ip"]=next_ip;
    json_flow[pmesh.name]["dest_port"]=dest_port;
    json_flow[pmesh.name]["packets"]=total_packets;
    json_flow[pmesh.name]["path"]=path;
    //json_flow[pmesh.name]["packets"]=num_packets; 
}
function animateFlowRenew(position_x,position_y,parent_x,parent_y,pipe=100,path,dest_port){
    var pgeometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    var pmaterial = new THREE.MeshNormalMaterial();
    var pmesh = new THREE.Mesh( pgeometry, pmaterial );
    pipe_rad = getPipeRadious(pipe);
    pmesh.position.x = position_x+getCubeRandLocation(pipe_rad);
    pmesh.position.y = 0+getCubeRandLocation(pipe_rad);
    pmesh.position.z = position_y+getCubeRandLocation(pipe_rad);
    scene.add(pmesh);
    pmesh.name = generateUUID();
    json_flow[pmesh.name]={};
    json_flow[pmesh.name]["x"]=parent_x;
    json_flow[pmesh.name]["y"]=parent_y;
    json_flow[pmesh.name]["dest_port"]=dest_port;
    json_flow[pmesh.name]["path"]=path;
    //json_flow[pmesh.name]["packets"]=num_packets; 
}
function getBase(position_x,position_y){
    var temp_geometry =new THREE.CylinderGeometry( s_radious, s_radious, s_height, 64 );
    var texture = new THREE.TextureLoader().load( '/assets/textures/wood.JPG' );
    var temp_material  = new THREE.MeshBasicMaterial( { map: texture } );
    temp_mesh = new THREE.Mesh( temp_geometry, temp_material );
    temp_mesh.position.x = position_x;
    temp_mesh.position.y = 0;
    temp_mesh.position.z = position_y;
    return temp_mesh;
}
function getIPText(position_x,position_y,type,ip="None"){
    var loader = new THREE.FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json' ,function ( font ) {

        var temp_geometry = new THREE.TextGeometry( ip, {
    
            font: font,
    
            size: 0.4,
            height: 0.01,
            curveSegments: 0.01,
    
            bevelThickness: 0.005,
            bevelSize: 0.01,
            bevelEnabled: true
    
        } );
    var p = 0;
    if(type == 1 || type == 2){
        p = 3;
    }else if(type == 3){
        p=5;
    }else if(type == 4){
        p=6.5
    }
    var temp_material = new THREE.MeshBasicMaterial({color:0x525a63})
    temp_geometry.center()
    temp_mesh = new THREE.Mesh( temp_geometry, temp_material );
    temp_mesh.position.x = position_x;
    temp_mesh.position.y = p;
    temp_mesh.position.z = position_y;

    scene.add(temp_mesh)
    });
}
function addRouter(position_x,position_y,ip){
    setLocations(ip,true,position_x,position_y);
    var base = getBase(position_x,position_y);
    var router = modelRouter(position_x,position_y);
    getIPText(position_x,position_y,1,ip.toString());
    var group = new THREE.Group();
    group.add(base);
    group.add(router);
    scene.add( group );
} 
function addSwitch(position_x,position_y,parent_x,parent_y,ip){
    setLocations(ip,false,position_x,position_y);
    var base = getBase(position_x,position_y);
    var switc = modelSwitch(position_x,position_y);
    getIPText(position_x,position_y,2,ip);
    var group = new THREE.Group();
    group.add(base);
    group.add(switc);
    scene.add(group);
    drawPipe(new THREE.Vector3(position_x,0,position_y),new THREE.Vector3(parent_x,0,parent_y),scene,1000);
}
function addDevice(position_x,position_y,parent_x,parent_y,ip,interface=""){
    setLocations(ip,false,position_x,position_y);
    var base = getBase(position_x,position_y);
    getIPText(position_x,position_y,3,ip);
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
        object.position.y = -1;
        object.position.z = position_y-1;
        var group = new THREE.Group();
        group.add(base);
        group.add(object);
        scene.add(group);
    } );
    }); 
    drawPipe(new THREE.Vector3(position_x,0,position_y),new THREE.Vector3(parent_x,0,parent_y),scene,100);
}
function addServer(position_x,position_y,parent_x,parent_y,ip,interface=""){
    setLocations(ip,false,position_x,position_y);
    var text = getIPText(position_x,position_y,4,ip);
    //creating base 
    var base = getBase(position_x,position_y);
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
    objLoader.load( 'Server.obj', function ( object ){
        object.position.x = position_x;
        object.position.y = 0.5;
        object.position.z = position_y;
        object.rotation.y = Math.PI *1.2;
        var group = new THREE.Group()
        group.add(base);
        group.add(object);
        scene.add(group);
    } );
    }); 
    drawPipe(new THREE.Vector3(position_x,0,position_y),new THREE.Vector3(parent_x,0,parent_y),scene,1000);
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

function drawPipe(vstart, vend,scene,speed){
    var radious = getPipeRadious(speed);
    pipe_position_x = (vstart.x+vend.x)/2
    pipe_position_z = (vstart.z+vend.z)/2
    var HALF_PI = Math.PI * .5;
    var distance = vstart.distanceTo(vend);
    var position  = vend.clone().add(vstart).divideScalar(2);
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = 64;
    ctx.canvas.height = 64;
    ctx.fillStyle = "rgba(240,227,218,0.5)";
    ctx.fillRect(0, 0, 64, 64);
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
    mesh_cube.position.y = 1.1;
    mesh_cube.position.z = position_y;
    return mesh_cube;
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
    return mesh_cube;
}
function drawRouterPipe(position_x,position_y,parent_x,parent_y){
    drawPipe(new THREE.Vector3(position_x,0,position_y),new THREE.Vector3(parent_x,0,parent_y),scene,1000);
}

function movePipe(pipe, timeElapsed){
    var pipe1 = scene.getObjectByName(pipe);
    pipe1.material.map.offset.y = (timeElapsed * 3 % 1);
}

function findCoordinate(A,B){
    var pointA = new THREE.Vector3(A[0],A[1],0);
    var pointB = new THREE.Vector3(B[0],B[1],0);
    var next_point = getPointInBetweenByLen(pointA, pointB, flow_speed);
    var coordinates = [next_point.x,next_point.y];
    return coordinates;
}
function getPointInBetweenByLen(pointA, pointB, length) {
    var dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
    return pointA.clone().add(dir);    
}
function removePacket(object) {
   
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
function generateUUID() { 
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
function getCubeRandLocation(pipe_rad){
    var max = (pipe_rad/2);
    var min = -(pipe_rad/2);
    
    return Math.random() * (max - min) + min; 
}
function getPipeRadious(speed){
    //Pipe sizes with respect to speed 60,100,1000,else
    var pipe_size = [0.35,0.4,0.55,0.6];
    var radious = 0;
    if(speed == 60){
        radious = pipe_size[0];
    }
    if(speed == 100){
        radious = pipe_size[1];
    }
    else if (speed == 1000){
        radious = pipe_size[2];
    }
    else{
        radious = pipe_size[3];
    }
    return radious;
}

/*
    leftSide,        // Left side
    rightSide,       // Right side
    topSide,         // Top side
    bottomSide,      // Bottom side
    frontSide,       // Front side
    backSide         // Back side
*/
function drawDevices() {
    let previousRouter;
    for (let key in json_resp) {
        let router = json_resp[key];
        addRouter(router.x, router.y,router.ip);
        drawRouterChilds(router);
        if (previousRouter) {
            drawRouterPipe(previousRouter.x, previousRouter.y, router.x, router.y);
        }
        previousRouter = router;
    }
}
function drawRouterChilds(router) {
    router.child.forEach(function (sw) {
        if (sw.type == "switch") {
            addSwitch(sw.x, sw.y, router.x, router.y,sw.ip);
            drawSwitchChilds(sw);
        }
        //added by me without testing
        else if (sw.type == "device"){
            addDevice(sw.x, sw.y, router.x, router.y,sw.ip);
        }  
        else {
            addServer(sw.x, sw.y, router.x, router.y,sw.ip);
        }
    });
}

function drawSwitchChilds(sw) {
    sw.child.forEach(function (c) {
        if (c.type == "switch") {
            addSwitch(c.x, c.y, sw.x, sw.y,c.ip);
            drawSwitchChilds(c);
        }
        //added by me
        else if (c.type == "server"){
            addServer(c.x, c.y, sw.x, sw.y,c.ip);
        } 
        else {
            addDevice(c.x, c.y, sw.x, sw.y,c.ip);
        }
    });
}

var routerAssignment;
var routerSwitches = {};
var switchDevices = {}
function assignPositions() {
    for (let key in json_resp) {
        let router = json_resp[key];
        assignRouterPosition(router);
        assignPositionsToRouterChilds(router);
    }
}

function assignRouterPosition(router) {
    if (!routerAssignment) {
        //if the alocation mapping is not right change location of 'y: 20*' and '.y -=20' from 20 to something else
        routerAssignment = {x: 0, y: 20 * Math.floor(Object.keys(json_resp).length / 2)};
    } else {
        routerAssignment.y -= 20;
    }
    Object.assign(router, routerAssignment);
}

function assignPositionsToRouterChilds(router) {
    const potentialIncrement = 240 / router.child.length;
    let currentAngle  = 330;
    router.child.forEach(function (sw) {
        Object.assign(sw, getPointByDegree(currentAngle, 30, router.x, router.y));
        if (sw.type == "switch") {
            assignPositionsToSwitchDevices(sw, currentAngle);   
        }
        currentAngle = (currentAngle + potentialIncrement) % 360;
        if (currentAngle > 60 && currentAngle < 120) {
            currentAngle = 120;
        } else if (currentAngle > 240 && currentAngle < 300) {
            currentAngle = 300;
        }
    });
}

function assignPositionsToSwitchDevices(sw, switchAngleToRouter) {
    const angleDifference = 30;
    const accomodateableDevices = 11;
    const angle = [switchAngleToRouter, switchAngleToRouter - angleDifference];

    let pipeLength = 15;
    let devicesAdded = 0;
    // add one device to one side to other on other
    sw.child.forEach(function (device, index) {
        const angleIndex = index % 2;
        const angleToUse = angle[angleIndex];
        Object.assign(device,  getPointByDegree(angleToUse, pipeLength, sw.x, sw.y));
        if (device.type == 'switch') {
            assignPositionsToSwitchDevices(device, angleToUse);
        }
        angleIndex ? angle[angleIndex] -= angleDifference :  angle[angleIndex] += angleDifference;
        devicesAdded++;
        if (devicesAdded == accomodateableDevices) {
            devicesAdded = 0;
            angle[0] = switchAngleToRouter + 15;
            angle[1] = switchAngleToRouter - 15;
            pipeLength = 20;
        }
    });
}
function getRouterSwitchCount(router) {
    return router.child.filter(function (sw) {
       return sw.type == "switch";
    }).length;
}

function getPointByDegree(degree, radius, cx, cy) {
    const rad = degree * (Math.PI / 180);
    const point =  {
        x: Math.ceil(cx + (radius * Math.cos(rad))),
        y: Math.ceil(cy + (radius * Math.sin(rad)))
    };
    return point;
}

function setLocations(ip,is_router,x,y){
    if(is_router){
        for(let i = 0; i < ip.length; i++){
            locations[ip[i]] = [x,y];
         }
    }else{
        locations[ip] = [x,y];
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }