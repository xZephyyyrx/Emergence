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

    drawBackground() {
        this.drawRect(0, 0, this.screenWidth, this.screenHeight, `rgb(0, 0, 0)`)
    }

    drawParticles(allParticles) {
        allParticles.forEach(particle => {
            this.drawRect(particle.pos.x, particle.pos.y, particle.size, particle.size, particle.parseColour());
        });
    }
}