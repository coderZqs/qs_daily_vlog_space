import Matter from "matter-js"

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    Composite = Matter.Composite;

var engine = Engine.create();

var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        height: window.innerHeight - 64,
        width: window.innerWidth,
        wireframes: false
    },
});

var ground = Bodies.rectangle(window.innerWidth / 2, 610, window.innerWidth, 60, { isStatic: true });
Composite.add(engine.world, [ground]);

setInterval(() => {

    let ball = Bodies.circle(Math.random() * window.innerWidth, 30, 5)

    ball.restitution = 1;
    ball.frictionAir = 0.001;

    World.add(engine.world, ball);
}, 500)

Render.run(render);
var runner = Runner.create();
Runner.run(runner, engine);