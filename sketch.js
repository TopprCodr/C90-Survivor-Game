const Engine = Matter.Engine;
const Composite = Matter.Composite;
const Bodies = Matter.Bodies;
const Events = Matter.Events;

var engine, world;
var particles = [];
var boosters = [];
var ground, player, backgroundImg;
var playerLife = 0;
var instructionsImg, instructions;
var gameState = "start";

function preload() {
    backgroundImg = loadImage("./images/bg1.jpg");
    instructionsImg = loadImage("./images/ins_img.jpg");
}

function setup() {
    canvas = createCanvas(1200, 400);
    engine = Engine.create();
    world = engine.world;
    ground = new Ground(width / 2, 390, width, 20);
    player = new Player(width / 2, height - 20, 100, 60);
    instructions = createSprite(width / 2, 180, 100, 20);
    instructions.addImage(instructionsImg);
    instructions.scale = 0.3;
}

function draw() {
    background(0);
    Engine.update(engine);
    drawSprites();
    //Add gamestates
    if (gameState == "start" && mousePressedOver(instructions)) {
        gameState = "play";
    }
    else if (gameState == "play") {
        instructions.visible = false;
        imageMode(CENTER);
        image(backgroundImg, width / 2, height / 2, width, height);
        //score
        textSize(25)
        fill("white")
        text("Player Lifetime: " + playerLife, width - 250, 50);
        playerLife = Math.round(frameCount / 10);
        //Spawn particles
        if (frameCount % 30 == 0) {
            newParticle();
        }
        for (var i = 0; i < particles.length; i++) {
            particles[i].display();
            //remove particles that reaches ground
            if (particles[i].body.position.y > 370) {
                Matter.World.remove(world, particles[i].body);
                particles.splice(i, 1);
            }
        }
        //Spawn boosters
        if (frameCount % 100 == 0) {
            newBooster();
        }
        for (var i = 0; i < boosters.length; i++) {
            boosters[i].display();
            //remove particles that reaches ground
            if (boosters[i].body.position.y > 370) {
                Matter.World.remove(world, boosters[i].body);
                boosters.splice(i, 1);
            }
        }
        ground.display();
        player.display();
        Events.on(engine, 'collisionStart', collision);
        //changing to end state
        if(player.body.position.y > 430) {
            gameState = "end";
        }
    }
    else if (gameState == "end") {
        textSize(35)
        fill("red");
        text("SURVIVED FOR: " + playerLife + " seconds", width - 800, 250);

        textSize(40)
        fill("red");
        text("GAME OVER", width - 700, 150);
    }
}

function newParticle() {
    var xPos = random(10, width - 10);
    var radius = random(5, 10);
    var p = new Particle(xPos, 0, radius);
    particles.push(p);
}

function newBooster() {
    var xPos = random(10, width - 10);
    var radius = random(5, 10);
    var b = new Booster(xPos, 0, radius);
    boosters.push(b);
}

function collision(event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
        var bodyA = pairs[i].bodyA.label;
        var bodyB = pairs[i].bodyB.label;
        //check for pairs of particle and player
        if (bodyA == 'particle' && bodyB == 'player' ||
            bodyA == 'player' && bodyB == 'particle') {
            //change player's y position
            Matter.Body.setPosition(player.body, { x: mouseX, y: player.body.position.y + 0.05 });
        }
        //check for pairs of booster and player
        if (bodyA == 'booster' && bodyB == 'player' ||
            bodyA == 'player' && bodyB == 'booster') {
            //change player's y position
            Matter.Body.setPosition(player.body, { x: mouseX, y: player.body.position.y - 0.05 });
        }
    }
}
