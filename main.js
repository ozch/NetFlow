function init() {
	var scene = new THREE.Scene();
	var gui = new dat.GUI();
	var clock = new THREE.Clock();

	var enableFog = false;
	

	if (enableFog) {
		scene.fog = new THREE.FogExp2(0xffffff, 0.2);
	}
    
    // Get materials
    
    var planeMaterial = getMaterial('standard', 'rgb(255, 255, 255)');
    
    var axesHelper = new THREE.AxisHelper(5);
	
	var plane = getPlane(planeMaterial, 30);
	var directionalLight = getDirectionalLight(1);
	var sphere = getSphere(0.05);
	var boxGrid = getBoxGrid(10, 1.5);
    var torus = getTorus( 0.2, 0.01, 24, 64 );
    var plate = getPlate(2);
//    var te = createText('dfdsfdsfs', scene, true);
//    console.log(te);
    
//    Give Objects name
	plane.name = 'plane-1';
	boxGrid.name = 'boxGrid';
    torus.name = 'torus-1';
    plate.name = 'plate-1';
    
//    console.log(scene.position.getPositionFromMatrix( child.matrixWorld ))

	plane.rotation.x = Math.PI/2;
    plate.rotation.x = Math.PI/2;
    torus.rotation.x = Math.PI/2;
    
//    Light position
	directionalLight.position.x = 13;
	directionalLight.position.y = 10;
	directionalLight.position.z = 10;
	directionalLight.intensity = 2;

//    Add to the scene
	//scene.add(plane);
	directionalLight.add(sphere);
	scene.add(directionalLight);
//	scene.add(boxGrid);
    //scene.add (torus);
   // scene.add( axesHelper );
//    scene.add(plate);
//    scene.add(te);

    var sphereMaterial = getMaterial('standard', 'rgb(65, 62, 62)');
    var loader = new THREE.TextureLoader();
    sphereMaterial.map = loader.load('/assets/textures/concrete.JPG');
    sphereMaterial.wrapS = THREE.RepeatWrapping;
		sphereMaterial.wrapT = THREE.RepeatWrapping;
//		sphereMaterial.repeat.set(15, 15);
    var sphereGroup = createSphereGroup(sphereMaterial,3, 12);
    sphereGroup.name = 'sphereGroup';
    //scene.add(sphereGroup);
    
    var torus1 = getTorus( 0.2, 0.01, 24, 64 );
    torus1.name = 'torus1';
    torus1.rotation.x = Math.PI/2;
    torus1.rotation.z = 0.35;
//    torus1.position.x = 3;
//    torus.geometry.center(0,0.7,0.8);
    console.log(sphereGroup.children[1].rotation);
    console.log(sphereGroup.children[2].rotation);
    console.log(torus.rotation);

    torus.scale = ( sphereGroup.children[0].position.distanceTo( sphereGroup.children[1].position ) );
    torus.position.x = 0.5 * (sphereGroup.children[1].position.x + sphereGroup.children[2].position.x);
    torus.position.z = 0.5 * (sphereGroup.children[1].position.z + sphereGroup.children[2].position.z);
    
    //scene.add(torus1);
    
//    torus.add(sphereFlow);
//    
//    torus.add(sphereFlow);
    
    var loader = new THREE.TextureLoader();
    planeMaterial.map = loader.load('/assets/textures/concrete.JPG');
    planeMaterial.bumpMap = loader.load('/assets/textures/concrete.JPG');
    planeMaterial.bumpScale = 0.01;
    var maps = ['map', 'bumpMap'];
	maps.forEach(function(mapName) {
		var texture = planeMaterial[mapName];
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(15, 15);
	});
    
    var folder1 = gui.addFolder('light_1');
	folder1.add(directionalLight, 'intensity', 0, 10);
	folder1.add(directionalLight.position, 'x', 0, 20);
	folder1.add(directionalLight.position, 'y', 0, 20);
	folder1.add(directionalLight.position, 'z', 0, 20);
	folder1.add(sphereGroup.position, 'y', 0, 20);
    
    var folder3 = gui.addFolder('materials');
	folder3.add(sphereMaterial, 'metalness', 0, 1);
	folder3.add(sphereMaterial, 'roughness', 0, 1);
    folder3.add(planeMaterial, 'metalness', 0, 1);
	folder3.add(planeMaterial, 'roughness', 0, 1);
	folder3.open();
    
    
//    gui.add(sphereFlow.position, 'x', 0, 20);
//	gui.add(sphereFlow.position, 'y', 0, 20);
//	gui.add(sphereFlow.position, 'z', 0, 20);

	 var camera = new THREE.PerspectiveCamera(
	 	45,
	 	window.innerWidth/window.innerHeight,
	 	1,
	 	1000
	 );

//	var camera = new THREE.OrthographicCamera(
//		-15,
//		15,
//		15,
//		-15,
//		1,
//		1000
//	);

	camera.position.x = 10;
	camera.position.y = 18;
	camera.position.z = -18;

	camera.lookAt(new THREE.Vector3(0, 0, 0));

	var renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(172, 170, 170)');
	document.getElementById('webgl').appendChild(renderer.domElement);

	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	update(renderer, scene, camera, controls, clock);

	return scene;
}

function getMaterial(type, color) {
	var selectedMaterial;
	var materialOptions = {
		color: color === undefined ? 'rgb(255, 255, 255)' : color,
	};

	switch (type) {
		case 'basic':
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case 'lambert':
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case 'phong':
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
		case 'standard':
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		default: 
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}

	return selectedMaterial;
}


    //for (int ii = 0; ii < a1.getNoOfClients(); ii++) {

		//	glTranslatef(-0.1, 0, 0);
		//	//a.DrawCircle(0.2, 0.2, 0.005, 360);
		//	drawString(-0.08, 0, -0.02, ipList[ii]);
		//	glTranslatef(0.1, 0.0, 0);
		//	glRotatef(360 / a1.getNoOfClients(), 0.0, 0.01, 0.1);
		//}

//function loadFont() {
//    var loader = new THREE.FontLoader();
//    loader.load( '/fonts/helvetiker_regular.typeface.json', function ( response ) {
//        font = response;
//    } );
//}
function createText(text, scene, bevelEnabled) {
    var loader = new THREE.FontLoader();
    loader.load( '/fonts/helvetiker_regular.typeface.json', function ( response ) {
        font = response;
    textGeo = new THREE.TextGeometry( text, {
        font: font,

        size: 1,
        height: 1,
        curveSegments: 12,

        bevelThickness: 0,
        bevelSize: 0,
        bevelEnabled: bevelEnabled
    } );
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    // "fix" side normals by removing z-component of normals for side faces
    // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
    if ( ! bevelEnabled ) {
        var triangleAreaHeuristics = 0.1 * ( height * size );
        for ( var i = 0; i < textGeo.faces.length; i ++ ) {
            var face = textGeo.faces[ i ];
            if ( face.materialIndex == 1 ) {
                for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
                    face.vertexNormals[ j ].z = 0;
                    face.vertexNormals[ j ].normalize();
                }
                var va = textGeo.vertices[ face.a ];
                var vb = textGeo.vertices[ face.b ];
                var vc = textGeo.vertices[ face.c ];
                var s = THREE.GeometryUtils.triangleArea( va, vb, vc );
                if ( s > triangleAreaHeuristics ) {
                    for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
                        face.vertexNormals[ j ].copy( face.normal );
                    }
                }
            }
        }
    }
    var centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    textGeo = new THREE.BufferGeometry().fromGeometry( textGeo );
        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
    textMesh1 = new THREE.Mesh( textGeo, textMaterial );
    textMesh1.position.x = centerOffset;
//    textMesh1.position.y = hover;
    textMesh1.position.z = 0;
    textMesh1.position.y = 1;
    textMesh1.rotation.x = Math.PI / 2;
//    textMesh1.rotation.y = Math.PI * 2;
        
         scene.add(textMesh1);
        } );
}


function createSphereGroup(material, sphereCount, separationMultiplier) {
  var group = new THREE.Group();
    k = 360/sphereCount;
  for (var i = 1; i <= sphereCount; i++) {
      s = k * i;
    var geometry = new THREE.CylinderGeometry( 2, 1, 1, 64 );
//    var material = new THREE.MeshPhongMaterial({ color: 'rgb(65, 62, 62)' });
    var sphere = new THREE.Mesh(geometry, material);
//    createText(`${i}`, sphere, true);
//    sphere.position.x = 5;
    sphere.rotation.setFromVector3(new THREE.Vector3( 0, THREE.Math.degToRad(s), 0));
    sphere.translateZ( separationMultiplier );
      sphere.position.y = sphere.geometry.parameters.height/2;
      sphere.castShadow = true;
    group.add(sphere);
  }
  return group;
}

function getSphereFlow(position) {
    var sphereFlow = getSphere(0.05);
//    sphereFlow.position.z = -0.05;
    
    return sphereFlow;
}

function getPlate(size) {
    var plane = getPlane(size);
//    plane.material.color.setHex( 0xffffff );
    plane.position.y = 1;
    plane.position.x = 2;
        
    return plane;
}

function getBox(w, h, d) {
	var geometry = new THREE.BoxGeometry(w, h, d);
	var material = new THREE.MeshPhongMaterial({
		color: 'rgb(120, 120, 120)'
	});
	var mesh = new THREE.Mesh(
		geometry,
		material 
	);
	mesh.castShadow = true;

	return mesh;
}

function getBoxGrid(amount, separationMultiplier) {
	var group = new THREE.Group();

	for (var i=0; i<amount; i++) {
		var obj = getBox(1, 1, 1);
		obj.position.x = i * separationMultiplier;
		obj.position.y = obj.geometry.parameters.height/2;
		group.add(obj);
		for (var j=1; j<amount; j++) {
			var obj = getBox(1, 1, 1);
			obj.position.x = i * separationMultiplier;
			obj.position.y = obj.geometry.parameters.height/2;
			obj.position.z = j * separationMultiplier;
			group.add(obj);
		}
	}

	group.position.x = -(separationMultiplier * (amount-1))/2;
	group.position.z = -(separationMultiplier * (amount-1))/2;

	return group;
}

function getFlow () {
    var group = new THREE.Group();
    
    return group;
}

function getPlane(material, size) {
	var geometry = new THREE.PlaneGeometry(size, size);
//	var material = new THREE.MeshPhongMaterial({
//		color: 'rgb(120, 120, 120)',
//		side: THREE.DoubleSide
//	});
    material.side = THREE.DoubleSide;
	var mesh = new THREE.Mesh(
		geometry,
		material 
	);
	mesh.receiveShadow = true;

	return mesh;
}

function getSphere(size) {
	var geometry = new THREE.SphereGeometry(size, 24, 24);
	var material = new THREE.MeshBasicMaterial({
		color: 'rgb(255, 255, 255)'
	});
	var mesh = new THREE.Mesh(
		geometry,
		material 
	);

	return mesh;
}

function getTorus(radius , radialSegments , tubularSegments , arc ) {
//    var geometry = new THREE.TorusGeometry( radius , radialSegments , tubularSegments , arc );
    const ctx = document.createElement("canvas").getContext("2d");
ctx.canvas.width = 64;
ctx.canvas.height = 64;

ctx.fillStyle = "rgba(0,0,255,0.5)";
ctx.fillRect(0, 0, 64, 64);

ctx.translate(32, 32);
ctx.rotate(Math.PI * .5);
ctx.fillStyle = "rgb(0,255,255)";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = "48px sans-serif";
ctx.fillText("➡︎", 0, 0);

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
//    texture.repeat.set(Math.sin() * 10 +5, Math.cob() * 10 +5);
    
//    var material = new THREE.MeshBasicMaterial( { color: 'rgb(23,145,148)' } );
//    var mGlass = new THREE.MeshLambertMaterial( {
//        map: texture,
//        color: 0xffffff,
////        envMap: reflectionCube,
//        opacity: 0.2,
//        side: THREE.DoubleSide,
//        transparent: true
//    } );
    const geometry = new THREE.CylinderBufferGeometry( 
  radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded);
const mGlass = new THREE.MeshBasicMaterial({
   map: texture,
   side: THREE.DoubleSide,
//   depthWrite: false,
//   depthTest: false,
   transparent: true,
});
    var mesh = new THREE.Mesh(
		geometry,
		mGlass 
	);
    mesh.position.y = 0.4;
    mesh.renderDepth = -1.1;
    mesh.castShadow = true;

	return mesh;
}

function getPointLight(intensity) {
	var light = new THREE.PointLight(0xffffff, intensity);
	light.castShadow = true;

	return light;
}

function randChoice(array){
    return array[Math.floor(Math.random()*array)];
};

function getSpotLight(intensity) {
	var light = new THREE.SpotLight(0xffffff, intensity);
	light.castShadow = true;

	light.shadow.bias = 0.0001;
	light.shadow.mapSize.width = 4096;
	light.shadow.mapSize.height = 4096;

	return light;
}

function getDirectionalLight(intensity) {
	var light = new THREE.DirectionalLight(0xffffff, intensity);
	light.castShadow = true;

	light.shadow.camera.left = -10;
	light.shadow.camera.bottom = -10;
	light.shadow.camera.right = 10;
	light.shadow.camera.top = 10;

	return light;
}

function update(renderer, scene, camera, controls, clock) {
	renderer.render(
		scene,
		camera
	);

	controls.update();

	var timeElapsed = clock.getElapsedTime();

	var boxGrid = scene.getObjectByName('boxGrid');
//	boxGrid.children.forEach(function(child, index) {
//		var x = timeElapsed * 5 + index;
//		child.scale.y = (noise.simplex2(x, x) + 1) / 2 + 0.001;
//		child.position.y = child.scale.y/2;
//	});
    
    var torus = scene.getObjectByName('torus-1');
    var torus1 = scene.getObjectByName('torus1');
    var sphereGroup = scene.getObjectByName('sphereGroup');
//    torus.scale.z = 40 * 24;
//    torus.scale.y +=0.05;
//    torus.material.transparent = true;
//    torus.position.z += timeElapsed * 0.5;
//    torus.rotation.z = timeElapsed * 1;
    torus.material.map.offset.y = (timeElapsed * 3 % 1);
    torus1.material.map.offset.y = (timeElapsed * 4 % 1);
//    sphereGroup.children.forEach(function(child,index){ 
//        var x = timeElapsed * 5 + index;
//        child.scale.y = ( Math.sin(1) * x % 1);
//    });
    
    torus.scale.y = ( sphereGroup.children[0].position.distanceTo( sphereGroup.children[1].position ) );
    
//    torus.position.z = (sphereGroup.children[1].position.x - sphereGroup.children[0].position.x);
    torus.rotation.setFromVector3(new THREE.Vector3( Math.PI/2, Math.PI , (sphereGroup.children[2].rotation.y + sphereGroup.children[1].rotation.y)/2.89 ));
//    torus.rotation.x = sphereGroup.children[1].rotation.x;
//    torus.rotation.y = sphereGroup.children[1].rotation.y;
//    torus.rotation.y = 1.5 ;
    
    matrixWorldNeedsUpdate = true;
    
//    torus.geometry.translate(0.01,0.01,0);
//    torus.translateY(-10,0);
//    torus.rotation.y = ( sphereGroup.children[0].rotation.y.distanceTo( sphereGroup.children[1].rotation.y ) );
    
    torus.children.forEach(function(child,index){
        var x = timeElapsed * 5 + index;
        child.scale.x=0;
        child.scale.y=0;
        child.scale.z=0;
        
//        child.position.z = timeElapsed * 1 + index;
    });

    resize(renderer, scene, camera, controls, clock);
	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls, clock);
	})
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

var scene = init();