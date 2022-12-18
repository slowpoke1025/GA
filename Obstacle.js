class Obstacle {
    constructor() {
        this.width = 25
        this.x = random(canvas.width - this.width);
        this.y = random(canvas.height - this.width);
        this.vx = Math.random() * (randomInt(0, 1) ? -1 : 1);
        this.vy = Math.random() * (randomInt(0, 1) ? -1 : 1);
    }
    draw() {
        // ctx.drawImage(bombImg, this.sprite * this.width, 0, this.width, this.width, this.x, this.y, config.bird_width * 1.1, config.bird_width * 1.1)
        ctx.fillStyle = "#ff0000"
        ctx.fillRect(this.x, this.y, this.width, this.width)
    }
    update() {

        if (config.obj_move) {
            if (this.x + this.width + this.vx > canvas.width)
                this.vx *= -1
            if (this.x + this.vx < 0)
                this.vx *= -1
            if (this.y + this.width + this.vy > canvas.height)
                this.vy *= -1
            if (this.y + this.vy < 0)
                this.vy *= -1

            this.x += this.vx
            this.y += this.vy
        }

        for (const bird of Birds) {
            if (!bird.dead)
                if (Collision(this, bird)) {
                    bird.collision = true
                    bird.blood -= 10
                    if (bird.blood <= 0) bird.dead = true

                }
        }
    }
}


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
