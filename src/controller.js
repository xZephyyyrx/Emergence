import View from './view.js';
import ParticleGenerator from './model.js';
import { Vector } from './model.js';
import { Utils } from './model.js';

// Assigns the canvas element to the ctx attribute
// Also establishs both the screen width and height, with an allowance made for the windows taskbar
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const taskBarHeight = 48;
const screenWidth = screen.width;
const screenHeight = screen.height - taskBarHeight;

canvas.width = screenWidth;
canvas.height = screenHeight;

// Establishs the framerate
const frameRate = 24;
setInterval(() => draw(), 1000/frameRate)

// Max particles to prevent excessive memory use
const maxParticles = 25000;
const maxParticleGenerators = 100;
const newParticleGeneratorsPerFrame = 1;
const allGenerators = [];
const allParticles = [];

const view = new View(ctx, screenWidth, screenHeight);


////////////////////
// VFX attributes //
////////////////////

// Enables branching generator creation
let branching = false;

// Flag to manually create first branching generator
let firstBranch = false;

// Used to make percentages more readable
const percentageMultiplier = 100;
// Chance a generator will branch to another on any given frame
// This number may be considered a percentage, e.g. 5 = 5%
let branchChance = 2;
// Chance that a particle generator will terminate itself
// Must have reproduced at least once before
let deathChance = 10;

let particleSize = 7;
let verticalSpeed = 3;
let horizontalSpeed = 4;
let verticalVariance = 2;
let horizontalVariance  = 3;

// Colour
let hueChange = 2;
let hueVariance = 1;
let lightnessChange = 0.2;

// Initial lstatic lightness value for Particle Generators
let initialLightness = ParticleGenerator.lightness;

// Minimum lightness before particle is deleted
let minLightness = 0;

// Used to confirm old particles will be deleted before new particles are created
Utils.testLightness(maxParticles, maxParticleGenerators, newParticleGeneratorsPerFrame, initialLightness, minLightness, lightnessChange);

// Main rendering loop
function draw() {
    view.drawBackground();

    if (branching === true) {
        if (firstBranch === true) {
            allGenerators.forEach(generator => {
                if  (allGenerators.length < maxParticleGenerators) {
                    if (Math.random() <= (branchChance / percentageMultiplier)) {
                        const newGenerator = new ParticleGenerator(new Vector(generator.pos.x, generator.pos.y));
                        allGenerators.push(newGenerator);
                        generator.hasReproduced = true;
                    }
                } 
            });
        } else {
            const newGenerator = new ParticleGenerator(new Vector((screenWidth * Math.random()), screenHeight));
            allGenerators.push(newGenerator);
            firstBranch = true;
        }
    } else {
        // Creates new particle generators on each fram
        // The number of new generators is defined by newParticleGeneratorsPerFrame
        // and the maximum is defined by maxParticleGenerators
        for(let i = 0; i < newParticleGeneratorsPerFrame; i++) {
            if (allGenerators.length < maxParticleGenerators) {
                const newGenerator = new ParticleGenerator(new Vector((screenWidth * Math.random()), screenHeight));
                allGenerators.push(newGenerator);
            }
        }
    }
    

    // Generates a new Particle at each generators position
    allGenerators.forEach(generator => {
        if (allParticles.length < maxParticles) {
            const newParticle = generator.generateParticle(particleSize);
            allParticles.push(newParticle);
        }
    });

    // Renders each particle
    view.drawParticles(allParticles);

    // Updates the position of each generator
    allGenerators.forEach(generator => {
        generator.updateColour(hueChange, hueVariance);
        generator.updatePos(screenHeight, screenWidth, verticalSpeed, verticalVariance, horizontalSpeed, horizontalVariance);
        if (branching === true && generator.hasReproduced === true) {
            if (generator.checkDeath(deathChance, percentageMultiplier)) {
                let index = allGenerators.indexOf(generator);
                allGenerators.splice(index, 1);
            }
        }
    });
    
    allParticles.forEach(particle => {
        particle.updateLightness(lightnessChange);
        if (particle.deletionCheck(minLightness)) {
            let index = allParticles.indexOf(particle);
            allParticles.splice(index, 1);
        }
    });
}