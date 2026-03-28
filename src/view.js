import { Vector } from "./model.js";

export default class View {

    constructor(ctx, screenWidth, screenHeight) {
        this.ctx = ctx;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }

    drawRect(x, y, width, height, colour) {
        this.ctx.fillStyle = colour;
        this.ctx.fillRect(x, y, width, height);
    }

    drawBackground(image, imageWidth, imageHeight, alpha) {
        if (!image) {
            this.drawRect(0, 0, this.screenWidth, this.screenHeight, `rgb(0, 0, 0)`);
        } else {
            for(let i = 0; (i * imageWidth) < this.screenWidth; i++) {
                for(let j = 0; (j * imageHeight) < this.screenHeight; j++) {
                    this.ctx.drawImage(image, (i * imageWidth), (j * imageHeight));
                }
            }

            this.drawRect(0, 0, this.screenWidth, this.screenHeight, `rgba(0, 0, 0, ${alpha})`);
        }
    }

    drawParticles(allParticles) {
        allParticles.forEach(particle => {
            this.drawRect(particle.pos.x, particle.pos.y, particle.size, particle.size, particle.parseColour());
        });
    }
}