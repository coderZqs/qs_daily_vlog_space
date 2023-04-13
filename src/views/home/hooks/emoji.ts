import Matter from "matter-js"

let { Engine, Runner, Render, Bodies, World, Composite } = Matter;

class Emoji {
    public engine = Engine.create();
    public timer;
    public runner;
    public render;
    constructor() {

    }

    run(element) {
        var render = Render.create({
            element: element,
            engine: this.engine,
            options: {
                height: window.innerHeight - 64,
                width: window.innerWidth,
                wireframes: false
            },
        });

        // 生成墙壁
        // var ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 64, window.innerWidth, 20, { isStatic: true });
        var leftGround = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true });
        var rightGround = Bodies.rectangle(0, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true });

        Composite.add(this.engine.world, [leftGround, rightGround]);

        this.timer = setInterval(() => {
            this.generateBall();
        }, 500)

        Render.run(render);
        this.runner = Runner.create();
        Runner.run(this.runner, this.engine);
    }

    /**
     * 生成球
     */

    generateBall() {
        let ball = Bodies.circle(Math.random() * window.innerWidth, 30, 5)
        ball.restitution = 1;
        ball.frictionAir = 0.001;
        World.add(this.engine.world, ball);
    }

    /**
     * 暂停
     */

    stop() {
        clearInterval(this.timer);
        Runner.stop(this.runner)
    }

    /**
     * 开始
     */


    start() {
        this.timer = setInterval(() => {
            this.generateBall();
        }, 500)
        Runner.start(this.runner)
    }

    /**
     * 取消动画
     */

    clear() {
        this.stop();
        World.clear(this.engine.world);
        Engine.clear(this.engine)
    }
}


export default new Emoji()