import * as THREE from 'three';
import { createWorld, createBoidWithRandomPositionAndDirection } from './game';
import { createBoidView, createFloor, createLights, createCamera } from './renderer';

const context = {
    config: {
        showForceLine: false,
        showRepelLine: false,
        showAttractLine: false,
        showFollowLine: false,
        showFriendLines: false
    }
};

const update = (delta, boidsViews, world) => {
    world.update(delta);
    for (const boidView of boidsViews) {
        const boid = world.getBoid(boidView.tag);
        boidView.update(boid, context);
    }
};

// setup a bunch of boids that should flock
const setupBoids = (scene, world, boidGeometry, boidMaterial) => {
    const numBoids = 450;
    const boids = [];

    for (let i = 0; i < numBoids; i++) {
        const boidView = createBoidView(scene, boidGeometry, boidMaterial);
        boidView.tag = i;
        boids.push(boidView);

        world.addBoid(createBoidWithRandomPositionAndDirection(-7, 7, 0.75, boidView.tag));
    }
    return boids;
};

const setup = (scene) => {
    const world = createWorld();

    const boidGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const boidMaterial = new THREE.MeshPhongMaterial({ color: 0xff6464 });

    const boids = setupBoids(scene, world, boidGeometry, boidMaterial);

    scene.add(createFloor());

    for (const light of createLights()) {
        scene.add(light);
    }

    var camera = createCamera();

    return { world, boids, camera };
};

const createRenderLoop = (clock, boids, scene, camera, renderer, world) => {
    const internalRender = () => {
        window.requestAnimationFrame(internalRender);

        var delta = clock.getDelta();
        update(delta, boids, world);

        renderer.render(scene, camera);
    };
    return internalRender;
};

const KEYS = {
    KEY_I: 73,
    KEY_U: 85,
    KEY_O: 79,
    KEY_P: 80,
    KEY_Y: 89
};

const onDocumentKeyDown = (event) => {
    console.log('keydown', event);
    switch (event.keyCode) {
        case KEYS.KEY_Y:
            context.config.showForceLine = !context.config.showForceLine;
            break;
        case KEYS.KEY_U:
            context.config.showRepelLine = !context.config.showRepelLine;
            break;
        case KEYS.KEY_I:
            context.config.showAttractLine = !context.config.showAttractLine;
            break;
        case KEYS.KEY_O:
            context.config.showFollowLine = !context.config.showFollowLine;
            break;
        case KEYS.KEY_P:
            context.config.showFriendLines = !context.config.showFriendLines;
            break;
    }
};

const setupKeyboardListeners = () => {
    document.addEventListener("keydown", onDocumentKeyDown, false);
};

window.onload = () => {
    var scene = new THREE.Scene();

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var { world, boids, camera } = setup(scene);

    setupKeyboardListeners();

    var clock = new THREE.Clock();

    var render = createRenderLoop(clock, boids, scene, camera, renderer, world);

    render();
};
