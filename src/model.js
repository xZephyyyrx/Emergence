class ColourHandler {
    static parseColour(colour) {
        return `hsl(${colour.hue}, ${colour.saturation}%, ${colour.lightness}%)`
    };

    static updateLightness(lightness, change) {
        lightness -= change;
        return lightness;
    }

    static updateHue(hue, change, variance) {
        hue += change * (Math.random() - 0.5) * variance;
        if (hue > 360) {
            hue -= 360;
        } else if (hue < 0) {
            hue += 360;
        }
        return hue;
    }
}

export default class ParticleGenerator {
    static hue = 0;
    static saturation = 100;
    static lightness = 50;

    constructor(pos) {
        this.pos = pos;

        // Once a generator has branched itself, it has a chance to die
        this.hasReproduced = false;
    }

    generateParticle(size = 20, hue = ParticleGenerator.hue, saturation = ParticleGenerator.saturation, lightness = ParticleGenerator.lightness) {
        const newParticle = new Particle(new Vector(this.pos.x, this.pos.y), size, hue, saturation, lightness);
        return newParticle;
    }

    updatePos(screenHeight, screenWidth, verticalSpeed, verticalVariance, horizontalSpeed, horizontalVariance) {
        if (this.pos.y < 0) {
            this.pos.y = screenHeight;
        } else {
            this.pos.y -= verticalSpeed * Math.random() * verticalVariance;
        }

        if (this.pos.x < 0) {
            this.pos.x = screenWidth;
        } else if (this.pos.x > screenWidth) {
            this.pos.x = 0;
        } else {
            this.pos.x += horizontalSpeed * (Math.random() - 0.5) * horizontalVariance;
        }
    }

    updateColour(hueChange, hueVariance) {
        ParticleGenerator.hue = ColourHandler.updateHue(ParticleGenerator.hue, hueChange, hueVariance);
    }

    checkDeath(chance, percentageMultiplier) {
        return (Math.random() <= (chance / percentageMultiplier));
    }
}


class Particle {
    constructor(pos, size, hue, saturation, lightness) {
        this.pos = pos;
        this.size = size;
        this.colour = {
            "hue": hue,
            "saturation": saturation,
            "lightness": lightness
        }
    }

    parseColour() {
        return ColourHandler.parseColour(this.colour);
    }

    updateLightness(change) {
        this.colour.lightness = ColourHandler.updateLightness(this.colour.lightness, change);
    }

    deletionCheck(minLightness) {
        let result = false;
        if (this.colour.lightness <= minLightness) {
            result =  true;
        }
        return result;
    }
}

export class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

export class Utils {
    static testLightness(maxParticles, maxParticleGenerators, newParticleGeneratorsPerFrame, initialLightness, minLightness, lightnessChange) {
        const framesToTerminate = ((initialLightness - minLightness) / lightnessChange); 
        let framesToMaxParticles = 0;
        let result = 0;
        let generators = newParticleGeneratorsPerFrame;
        do {
            framesToMaxParticles += 1;
            result += (generators);
            if (generators < maxParticleGenerators) {
                generators += newParticleGeneratorsPerFrame;
                if (generators > maxParticleGenerators) {
                    generators = maxParticleGenerators;
                }
            }
        } while (result <= maxParticles);
    
        console.log(`Frames to termination: ${framesToTerminate}`);
        console.log(`Frames to max particle count: ${framesToMaxParticles}`);
    
        if (framesToMaxParticles < framesToTerminate) {
            throw new Error("Particle count will cap before old particles are delete!");
        }
    }
}