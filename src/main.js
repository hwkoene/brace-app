import Application from '../lib/application.js';
import { Lut } from '../lib/threejs/Lut.js';
import { STLLoader } from '../lib/threejs/STLLoader.js';

const appInstance = new Application();

function onWindowResize () 
{
    Application.onWindowResize();
};

// Event handling
window.addEventListener('resize', onWindowResize, false);

function requestJSON(filename)
{
    var request = new XMLHttpRequest();
    var data    = null;

    request.open('GET', filename, false);
    request.onload = function()
    { 
        if (request.status >= 200 && request.status < 400) 
        {
            data = JSON.parse(request.responseText);
        } 
        else 
        {
            console.log("Server error");
        }
    }

    request.onerror = function() 
    {
        console.log("Connection error");
    };

    request.send();

    return data;
};

var sensor_config = requestJSON("/assets/sensors.json");

// Add legend
var lut = new Lut();
var sprite = new THREE.Sprite( new THREE.SpriteMaterial( {
    map: new THREE.CanvasTexture( lut.createCanvas() )
} ) );
sprite.scale.x = 0.125;
Application.uiScene.add( sprite );

lut.setColorMap( 'cooltowarm' );
lut.setMax( sensor_config.max_value );
lut.setMin( 0 );

lut.updateCanvas( sprite.material.map.image );
sprite.material.map.needsUpdate = true;

// Load sensors
var sensormat = new THREE.MeshStandardMaterial;
sensormat.color = new THREE.Color('green');
var sensorgeo = new THREE.SphereGeometry;
var sensormesh = new THREE.Mesh(sensorgeo, sensormat);
sensormesh.scale.set(6, 6, 6);

for(var i = 0; i < sensor_config.positions.length; i++)
{
    var newmesh = sensormesh.clone();
    newmesh.position.set(sensor_config.positions[i][0], sensor_config.positions[i][1], sensor_config.positions[i][2])
    Application.perspectiveScene.add(newmesh);
}


// Add brace
var material = new THREE.MeshPhongMaterial( { 
    color: 0xffaaff, 
    flatShading: false, 
    vertexColors: true,
    shininess: 0
} );

var datapoint = requestJSON("../assets/data/datapoint0.json");

var loader = new STLLoader();
loader.load("./assets/brace.stl", function (geometry) {
    // geometry.center();
    var mesh = new THREE.Mesh(geometry, material);

    // Load colors
    var pressures = datapoint.mesh_colors;
    var colors = [];
    for ( var i = 0, n = geometry.attributes.position.count; i < n; ++ i ) {
        var color = lut.getColor(pressures[i])
        colors.push( color.r, color.g, color.b );

    }
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    
    mesh.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
   
    Application.perspectiveScene.add(mesh);
});



// Light
Application.perspectiveScene.add( new THREE.HemisphereLight( 0x8a90b5, 0x111122, 3.0 ) );

Application.onWindowResize();
Application.render();