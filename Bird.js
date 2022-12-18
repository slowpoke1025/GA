class Bird extends DNA {
    constructor(dna, x, y) {
        super(dna)
        this.width = config.bird_width
        this.x = x ?? random(canvas.width - this.width);
        this.y = y ?? random(canvas.height - this.width);
        this.vx = random(1, -1) * config["max-speed(b)"];
        this.vy = random(1, -1) * config["max-speed(b)"];
        this.f = { x: 0, y: 0 }
        this.blood = 150;
        this.foodGet = 0
        this.crash = false
        this.img = birdImg
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.width / 2)
        ctx.rotate(Math.atan2(this.vy, this.vx) + Math.PI / 4 * 3)
        // ctx.fillRect(-this.width / 2, -this.width / 2, this.width, this.width)
        // ctx.drawImage(this.img, this.sprite * this.width, 0, this.width, this.width, -this.width / 2, -this.width / 2, this.width, this.width)

        ctx.drawImage(this.img, -this.width / 2, -this.width / 2, this.width, this.width)

        ctx.restore()


        ctx.fillStyle = this.blood >= 80 ? "green" : (this.blood < 30 ? "red" : "yellow");
        ctx.fillRect(this.x, this.y - 10, this.blood / 100 * this.width, 7)



    }
    draw_circle() {
        if (config.obj_vision_show) {
            ctx.strokeStyle = "green"
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.width / 2, map(this.genes[5], 0, 200), 0, 2 * Math.PI);
            ctx.stroke();
            ctx.font = "10px Comic Sans MS";
            ctx.fillStyle = "green";
            ctx.fillText(this.genes[4].toFixed(2), this.x + this.genes[5] * 150, this.y + this.genes[5] * 150);
        }
        if (config.vision_show) {
            ctx.strokeStyle = "red"
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.width / 2, map(this.genes[3], 0, 200), 0, 2 * Math.PI);
            ctx.stroke();
            ctx.font = "10px Comic Sans MS";
            ctx.fillStyle = "red";
            ctx.fillText(this.genes[2].toFixed(2), this.x - this.genes[3] * 150, this.y + this.genes[3] * 150);
        }
        if (config.sep_vision_show) {
            ctx.strokeStyle = "blue"
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.width / 2, map(this.genes[1], 0, 200), 0, 2 * Math.PI);
            ctx.stroke();
            ctx.font = "10px Comic Sans MS";
            ctx.fillStyle = "blue";
            ctx.fillText(this.genes[0].toFixed(2), this.x + this.genes[1] * 150, this.y - this.genes[1] * 150);
        }
    }
    update() {
        this.vx += this.f.x * ACC_RATE;
        this.vy += this.f.y * ACC_RATE;
        this.detectBoundary()
        this.limitSpeed()
        this.x += this.vx
        this.y += this.vy
        this.eat()
        this.collide()
        this.blood -= 0.25
        if (this.blood <= 0) {
            this.dead = true;
            Foods.push(new Food(this.x, this.y))
        }

    }

    detectBoundary() {
        if (this.x + this.vx > (canvas.width - this.width - config.boundary)) { this.vx -= config.boundary / (canvas.width - this.width - this.x) ** 2 }
        else if (this.x + this.vx < config.boundary) { this.vx += config.boundary / this.x / this.x }

        if (this.y + this.vy > (canvas.height - this.width - config.boundary)) { this.vy -= config.boundary / (canvas.height - this.width - this.y) ** 2 }
        else if (this.y + this.vy < config.boundary) { this.vy += config.boundary / this.y / this.y }

    }

    getVector(other) {
        const vector = { x: other.x - this.x, y: other.y - this.y }
        vector.length = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
        return vector
    }

    limitSpeed() {
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
        if (speed > config["max-speed(b)"]) {
            this.vx = this.vx / speed * config["max-speed(b)"]
            this.vy = this.vy / speed * config["max-speed(b)"]
        }
    }


    eat() {
        for (const i in Foods) {
            if (Collision(Foods[i], this)) {
                Foods.splice(i, 1)
                this.blood = Math.min(this.blood + 10, 100)
                ++this.foodGet
                ++FOOD_NUM
                return
            }
        }
    }
    collide() {


        // for (const obj of Obstacles) {
        //     if (Collision(this, obj)) {
        //         this.crash = true
        //         this.blood -= 50
        //         return
        //     }
        // }

        for (const bird of Birds) {
            if (!bird.dead)
                if (Collision(this, bird) && bird !== this) {
                    this.crash++
                    this.blood -= 3
                    return
                }
        }

    }

}
