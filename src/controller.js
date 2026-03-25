import View from './view.js';
import ParticleGenerator from './model.js';
import { Vector } from './model.js';

// Assigns the canvas element to the ctx attribute
// Also establishs both the screen width and height, with an allowance made for the windows taskbar
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const taskBar = 48;
const screenWidth = screen.width;
const screenHeight = screen.height - taskBar;

canvas.width = screenWidth;
canvas.height = screenHeight;

// Establishs the framerate
const frameRate = 24;
setInterval(() => draw(), 1000/frameRate)

// Max particles to prevent excessive memory use
const maxParticles = 25000;
const maxParticleGenerators = 50;
const newParticleGeneratorsPerFrame = 1;
const allGenerators = [];
const allParticles = [];

const view = new View(ctx, screenWidth, screenHeight);


////////////////////
// VFX attributes //
////////////////////
let particleSize = 7;
let verticalSpeed = 5;
let horizontalSpeed = 4;
let verticalVariance = 2;
let horizontalVariance  = 3;

// Colour
let hueChange = 2;
let hueVariance = 1;
let lightnessChange = 0.2;

// Minimum lightness before particle is deleted
let minLightness = 0;

// Main rendering loop
view.drawBackground();
function draw() {
    view.drawBackground();

    // Creates new particle generators on each fram
    // The number of new generators is defined by newParticleGeneratorsPerFrame
    // and the maximum is defined by maxParticleGenerators
    for(let i = 0; i < newParticleGeneratorsPerFrame; i++) {
        if (allGenerators.length < maxParticleGenerators) {
            const newGenerator = new ParticleGenerator(new Vector((screenWidth * Math.random()), screenHeight));
            allGenerators.push(newGenerator);
        }
    }

    // Generates a new Particle at each generators position
    allGenerators.forEach(generator => {
        if (allParticles.length < maxParticles) {
            const newParticle = generator.generateParticle(particleSize);
            allParticles.push(newParticle);
            console.log(newParticle.colour)
        }
    });

    // Renders each particle
    view.drawParticles(allParticles);

    // Updates the position of each generator
    allGenerators.forEach(generator => {
        generator.updateColour(hueChange, hueVariance);
        generator.updatePos(screenHeight, screenWidth, verticalSpeed, verticalVariance, horizontalSpeed, horizontalVariance);
    });
    
    allParticles.forEach(particle => {
        particle.updateLightness(lightnessChange);
        if (particle.deletionCheck(minLightness)) {
            let index = allParticles.indexOf(particle);
            allParticles.splice(index, 1);
        }
    });
}