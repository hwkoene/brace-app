import * as THREE from '../include/three.module.js';

import { GUI } from '../include/dat.gui.module.js';

import { OrbitControls } from '../include/OrbitControls.js';
import { Lut } from '../include/Lut.js';

var container;

var perpCamera, orthoCamera, renderer, lut;

var mesh, sprite;
var scene, uiScene;

var params;

init();

function init() {

	container = document.getElementById( 'container' );

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );

	uiScene = new THREE.Scene();

	lut = new Lut();

	var width = window.innerWidth;
	var height = window.innerHeight;

	perpCamera = new THREE.PerspectiveCamera( 60, width / height, 1, 100 );
	perpCamera.position.set( 0, 0, 10 );
	scene.add( perpCamera );

	orthoCamera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 1, 2 );
	orthoCamera.position.set( 0.5, 0, 1 );
	scene.add( orthoCamera );

	sprite = new THREE.Sprite( new THREE.SpriteMaterial( {
		map: new THREE.CanvasTexture( lut.createCanvas() )
	} ) );
	sprite.scale.x = 0.125;
	scene.add( sprite );

	mesh = new THREE.Mesh( undefined, new THREE.MeshLambertMaterial( {
		side: THREE.DoubleSide,
		color: 0xF5F5F5,
		vertexColors: true
	} ) );
	scene.add( mesh );

	params	= {
		colorMap: 'rainbow',
	};
	loadJsonModel( );

	var pointLight = new THREE.PointLight( 0xffffff, 1 );
	perpCamera.add( pointLight );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.autoClear = false;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( width, height );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	var controls = new OrbitControls( perpCamera, renderer.domElement );
	controls.addEventListener( 'change', render );

	var gui = new GUI();

	gui.add( params, 'colorMap', [ 'rainbow', 'cooltowarm', 'blackbody', 'grayscale' ] ).onChange( function () {

		updateColors();
		render();

	} );

}

function onWindowResize() {

	var width = window.innerWidth;
	var height = window.innerHeight;

	perpCamera.aspect = width / height;
	perpCamera.updateProjectionMatrix();

	renderer.setSize( width, height );
	render();

}

function render() {

	renderer.clear();
	renderer.render( scene, perpCamera );
	renderer.render( uiScene, orthoCamera );

}

function loadJsonModel( ) {

	var loader = new THREE.BufferGeometryLoader();
	loader.load( './assets/pressure.json', function ( geometry ) {

		geometry.center();
		geometry.computeVertexNormals();

		// default color attribute
		var colors = [];
		for ( var i = 0, n = geometry.attributes.position.count; i < n; ++ i ) {

			colors.push( 1, 1, 1 );

		}
		geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

		mesh.geometry = geometry;
		updateColors();

		render();

	} );

}

function updateColors() {

	lut.setColorMap( params.colorMap );

	lut.setMax( 2000 );
	lut.setMin( 0 );

	var geometry = mesh.geometry;
	var pressures = geometry.attributes.pressure;
	var colors = geometry.attributes.color;
	for ( var i = 0; i < pressures.array.length; i ++ ) {

		var colorValue = pressures.array[ i ];

		var color = lut.getColor( colorValue );

		if ( color === undefined ) {

			console.log( 'Unable to determine color for value:', colorValue );

		} else {

			colors.setXYZ( i, color.r, color.g, color.b );

		}

	}

	colors.needsUpdate = true;

	var map = sprite.material.map;
	lut.updateCanvas( map.image );
	map.needsUpdate = true;

}