import { Vector3 } from 'three';

const createBoid = (position, direction, speed) => {

    const getVectorToFriend = (me, other) => {
        const result = me.clone();
        result.sub(other);
        result.normalize();
        return result;
    };

    const rotationVector = new Vector3(0, 1, 0);

    const boid = {
        position,
        direction,
        speed,
        friends: []
    };

    boid.update = (delta, world) => {
        const velocity = boid.direction.clone();
        velocity.multiplyScalar(boid.speed);
        velocity.multiplyScalar(delta);
        boid.position.add(velocity);

        boid.friends = world.findNearbyBoids(boid, 1);
    };

    return boid;
};

const createWorld = () => {
    const boids = {};
    const world = {};

    world.addBoid = (position, direction, speed, key) => {
        boids[key] = createBoid(position, direction, speed);
    };

    world.update = (delta) => {
        for (const key in boids) {
            boids[key].update(delta, world);
        };
    };

    world.forEachBoid = (boidAction) => {
        for (const key in boids) {
            boidAction(boids[key]);
        };
    }

    world.getBoid = (key) => {
        return boids[key];
    };

    world.findNearbyBoids = (fromBoid, cutoffDistance) => {
        let friends = [];
        world.forEachBoid(otherBoid => {
            if (fromBoid === otherBoid) return;
            const newDist = fromBoid.position.distanceTo(otherBoid.position);
            if (newDist < cutoffDistance) {
                friends.push(otherBoid);
            }
        });
        return friends;
    };


    return world;
};

export { createBoid, createWorld };