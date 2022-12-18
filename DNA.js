class DNA {

    constructor(genes) {
        if (!genes) {
            genes = [0, 0, 0, 0, 0, 0]
            for (const i in genes) {
                genes[i] = Math.random()
            }
        }
        this.genes = genes;
        this.fitval = 0
    }
    fitness() {
        this.fitval = (this.foodGet) ** 2 * (this.dead ? 0 : 1)
        if (this.crash) this.fitval *= 0.5
        if (this.collision) this.fitval *= 0.1
        return this.fitval
    }
    crossover(partner) {

        const child = [0, 0, 0, 0, 0, 0]

        for (let i = 0; i < 6; i++) {
            if (Math.random() >= 0.5) {
                child[i] = this.genes[i]
            } else {
                child[i] = partner.genes[i]
            }
        }
        return new Bird(child)
    }
    mutate(mutate_rate) {

        for (let i in this.genes) {
            if (Math.random() < mutate_rate) {
                this.genes[i] = Math.random()
            }
        }
    }

    generateForce() {
        this.f.x = 0
        this.f.y = 0
        const separation = { x: 0, y: 0 }
        const repulsion = { x: 0, y: 0 }


        let total = 0

        const sep_factor = map(this.genes[0], 0, 2)
        const sep_vision = map(this.genes[1], 0, 150)
        const food_factor = map(this.genes[2], 0, 2)
        const food_vision = map(this.genes[3], 0, 150)
        const obstacle_factor = map(this.genes[4], 0, 2)
        const obstacle_vision = map(this.genes[5], 0, 150)


        for (const bird of Birds) {

            if (bird === this || bird.dead) continue
            const vector = this.getVector(bird)
            if (Math.atan2(vector.y, vector.x) > Math.PI) continue

            if (vector.length < sep_vision) {
                separation.x += -vector.x / vector.length ** 2 * sep_vision
                separation.y += -vector.y / vector.length ** 2 * sep_vision
                ++total
            }
        }


        if (total > 0) {
            this.f.x =
                separation.x * sep_factor

            this.f.y =
                separation.y * sep_factor
        }

        const closet = { food: null, vector: { x: null, y: null, length: Number.MAX_SAFE_INTEGER } }
        for (const i in Foods) {
            const vector = this.getVector(Foods[i])
            if (vector.length < food_vision && vector.length < closet.vector.length) {
                closet.food = Foods[i]
                closet.vector = vector
            }
        }
        if (closet.food) {
            this.f.x += closet.vector.x / closet.vector.length ** 2 * food_vision * food_factor
            this.f.y += closet.vector.y / closet.vector.length ** 2 * food_vision * food_factor
        }


        const closetObj = { obj: null, vector: { x: null, y: null, length: Number.MAX_SAFE_INTEGER } }

        for (const obj of Obstacles) {
            const vector = this.getVector(obj)
            if (vector.length < obstacle_vision && vector.length < closetObj.vector.length) {
                closetObj.obj = obj
                closetObj.vector = vector
            }

        }
        if (closetObj.obj) {
            this.f.x += -closetObj.vector.x / closetObj.vector.length ** 2 * obstacle_vision * obstacle_factor
            this.f.y += -closetObj.vector.y / closetObj.vector.length ** 2 * obstacle_vision * obstacle_factor
        }




        // let objTotal = 0
        // for (const obj of Obstacles) {
        //     const vector = this.getVector(obj)
        //     if (vector.length < obstacle_vision) {
        //         ++objTotal
        //         repulsion.x += -vector.x / vector.length ** 2 * obstacle_vision
        //         repulsion.y += vector.y / vector.length ** 2 * obstacle_vision
        //     }
        // }
        // if (objTotal) {
        //     this.f.x =
        //         repulsion.x * obstacle_factor

        //     this.f.y =
        //         repulsion.y * obstacle_factor
        // }

        if (Math.abs(this.f.x) > 5) {
            this.f.x = this.f.x / Math.abs(this.f.x) * 5
        }
        if (Math.abs(this.f.y) > 5) {
            this.f.y = this.f.y / Math.abs(this.f.y) * 5
        }

    }

}

function map(val, min, max) {
    return val * (max - min) + min
}