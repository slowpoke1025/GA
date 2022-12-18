
class Population {
    constructor(population_num, mutate_rate) {
        this.population_num = population_num
        this.mutate_rate = mutate_rate
        this.Birds = Birds
        this.avg = []
        this.next_birds = []
        this.track_birds = []
        this.best_fitval = 0
        this.best_bird;
        this.best_generation = 0
        this.generation = 0
        this.generateObstacles(20)
    }
    select() {

        let sum_fitval = 0
        for (const i in this.Birds) {
            this.track_birds[i] = this.Birds[i]
        }
        // const fitval_array = Array.from({ length: this.size }, () => 0)
        for (let dna of this.Birds) {
            const fitval = dna.fitness()
            if (fitval >= this.best_fitval) {
                this.best_fitval = fitval
                this.best_bird = dna
                this.best_generation = this.generation
            }
            sum_fitval += dna.fitval
        }


        for (let i = 0; i < this.population_num; i++) {
            const rand = Math.random() * sum_fitval
            let sum_value = 0
            for (let dna of this.Birds) {
                sum_value += dna.fitval
                if (sum_value >= rand) {
                    this.next_birds.push(dna)
                    break;
                }
            }
        }
    }
    reproduction() {
        for (let i in this.next_birds) {
            const a = Math.floor(Math.random() * this.population_num)
            const b = Math.floor(Math.random() * this.population_num)
            const c = this.next_birds[a].crossover(this.next_birds[b])

            c.mutate(this.mutate_rate)
            Birds[i] = c;
        }

        this.next_birds = []

        ++this.generation
    }
    live() {

    }
    generateFood() {
        if (Foods.length < config.max_food && Math.random() < 0.8) {
            if (config.obj_move) return Foods.push(new Food)
            while (true) {
                const food = new Food()
                let flag = true
                for (const obj of Obstacles) {
                    if (Collision(obj, food)) {
                        flag = false
                        break;
                    }
                }
                if (flag) {
                    Foods.push(food)
                    break;
                }
            }
        }
    }
    generateObstacles(num) {
        Obstacles = []
        for (let i = 0; i < num; i++) {
            Obstacles.push(new Obstacle())
        }
    }

}