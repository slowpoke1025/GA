class Food {
    constructor(x, y) {
        this.width = 10
        this.x = x ?? random(canvas.width - 50, 50);
        this.y = y ?? random(canvas.height - 50, 50);
    }
    draw() {
        // ctx.drawImage(bombImg, this.sprite * this.width, 0, this.width, this.width, this.x, this.y, config.bird_width * 1.1, config.bird_width * 1.1)
        ctx.fillStyle = "#ffde00"
        ctx.fillRect(this.x, this.y, this.width, this.width)
    }
    update() {

    }
}