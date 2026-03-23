const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const taskBar = 48;
const screenWidth = screen.width;
const screenHeight = screen.height - taskBar;

canvas.width = screenWidth;
canvas.height = screenHeight;

const frameRate = 24;
setInterval(() => draw(), 1000/frameRate)

const maxParticles = 100;
const newParticlesPerFrame = 1;

class Particle {
    static riseSpeed = 1;
    static snowSize = 2;
    static hueShift = 1;
    static colour = {
        "hue": 128,
        "saturation": 100,
        "lightness": 50
    };
    static xVariance = 20;
    static lightnessVariance = 5;
    static hueVariance = 10;
    static riseSpeedVariance = 1;

    posX = (Math.random() * screenWidth);
    posY = screenHeight;


    updatePos() {
        if (this.posY <= 0) {
            this.posY = screenHeight;
        } else if (this.posY <= screenHeight) {
            this.posY -= (Particle.riseSpeed) * Math.random() * Particle.riseSpeedVariance;
        }

        this.posX += (Math.random() - 0.5) * Particle.xVariance;
    }

    static updateColour() {
        Particle.colour.hue += (Particle.hueShift * (Math.random() - 0.5) * Particle.hueVariance);
        if (Particle.colour.lightness > 50) {Particle.colour.lightness = 50};
        if (Particle.colour.lightness < -50) {Particle.colour.lightness = -50};
        Particle.colour.lightness += (Math.random() - 0.5) * Particle.lightnessVariance;
    }

    static parseColour() {
        return `hsl(
            ${Particle.colour.hue},
            ${Particle.colour.saturation}%,
            ${Particle.colour.lightness}%)`;
    }
}

class Canvas {
    allParticles = [];

    drawBackground() {
        ctx.fillStyle = `rgb(0, 0, 0)`;
        ctx.fillRect(0, 0, screenWidth, screenHeight);
    }

    drawParticles(array) {
        array.forEach(particle => {
            ctx.fillStyle = Particle.parseColour();
            ctx.fillRect(particle.posX, particle.posY, Particle.snowSize, Particle.snowSize);
            particle.updatePos();
        });
    }

    createParticles(numberOfParticles) {
        for(let i = 0; i < numberOfParticles; i++) {
            let newParticle = new Particle();
            this.allParticles.push(newParticle);
        }
    }
}

let theCanvas = new Canvas();
theCanvas.drawBackground();

function draw() {
    if (theCanvas.allParticles.length < maxParticles) {
        theCanvas.createParticles(newParticlesPerFrame);
    };
    theCanvas.drawParticles(theCanvas.allParticles);
    Particle.updateColour()
}