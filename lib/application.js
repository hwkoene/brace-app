/**
 * @file        application.js
 * @author      Hans Koene
 * @date        19/10/2020
 * @brief       Basic application structure
 * @copyright   Copyright © Hans Koene. All rights reserved.
 */

import * as THREE from './threejs/three.module.js';

import { OrbitControls } from './threejs/OrbitControls.js';

export default class Application {
    
    container = null;
    static renderer = null;

    static uiScene = null;
    static uiCamera = null;

    static perspectiveScene = null;
    static perspectiveCamera = null;

    static controls = null;

    constructor () {
        console.log("Starting application");

        this.container = document.createElement('div');
        document.body.appendChild(container);

        Application.renderer =  new THREE.WebGLRenderer({ antialias: true });
        Application.renderer.autoClear = false;
        Application.renderer.setPixelRatio(window.devicePixelRatio);
        Application.renderer.setSize(window.width, window.height);
        container.appendChild(Application.renderer.domElement);

        // 3D object scene
        Application.perspectiveScene = new THREE.Scene();
        Application.perspectiveScene.background = new THREE.Color(0xffffff);

        Application.perspectiveCamera = new THREE.PerspectiveCamera(60, window.width / window.height, .1, 5000);
        Application.perspectiveCamera.position.set(0, 0, 600);
        Application.perspectiveScene.add(Application.perspectiveCamera);

        // UI scene
        Application.uiScene = new THREE.Scene();

        Application.uiCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 2);
        Application.uiCamera.position.set(0.5, 0, 1);

        // Controls (default: only render when the camera is moved)
        Application.controls = new OrbitControls(Application.perspectiveCamera, Application.renderer.domElement);
        Application.controls.addEventListener('change', Application.render);
        
    };

    // #render = function () {
    static render = function () {
        Application.renderer.clear();
        Application.renderer.render(Application.perspectiveScene, Application.perspectiveCamera);
        Application.renderer.render(Application.uiScene, Application.uiCamera);
    };

    // #onWindowResize = function () 
    static onWindowResize = function () 
    {
        Application.perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
        Application.perspectiveCamera.updateProjectionMatrix();

        Application.renderer.setSize(window.innerWidth, window.innerHeight);
        Application.render();
    };
}