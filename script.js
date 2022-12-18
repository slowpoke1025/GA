const ACC_RATE = 0.5
const config = {

    "sep-vision": 80,
    vision: 80,
    bird_width: 30,
    bird_num: 50,
    boundary: 150,
    boundary_force: 1,
    "max-speed(b)": 5,
    vision_show: false,
    sep_vision_show: false,
    obj_vision_show: false,
    max_food: 130,
    food: 1,
    generation: 200,
    obj_move: false,
    steps: 1000,
    show_process: false,
    stop: false
}
let FOOD_NUM = 0;




const canvas = document.getElementById("canvas")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d")

const Birds = [];
const Predators = []
const Bombs = []
const Foods = []
let Obstacles = []



const birdImg = new Image()
birdImg.src = "./swallow.png";

const demoImg = new Image()
demoImg.src = "./demo.png";


const modal = document.getElementById("modal")
const ctrlBtn = document.getElementById("control")
const cancelBtn = document.getElementById("cancel")
const controlContainer = modal.querySelector(".container")


const showObjVision = document.getElementById("obj-vision")
const showVision = document.getElementById("show-vision")
const showSepVision = document.getElementById("show-sep-vision")
const objMove = document.getElementById("obj-move")
const showProcess = document.getElementById("show_process")
const Stop = document.getElementById("stop")


showProcess.addEventListener("change", e => {
    config.show_process = showProcess.checked
})

Stop.addEventListener("change", e => {
    config.stop = Stop.checked
})

objMove.addEventListener("change", e => {
    config.obj_move = objMove.checked
})
showSepVision.addEventListener("change", e => {
    config.sep_vision_show = showSepVision.checked
})
showVision.addEventListener("change", e => {
    config.vision_show = showVision.checked
})
showObjVision.addEventListener("change", e => {
    config.obj_vision_show = showObjVision.checked
})



new Control("max-speed(b)", { value: config["max-speed(b)"], min: 0, max: 10, step: 0.5 })
new Control("bird_num", { value: config.bird_num, min: 0, max: 200, step: 10 })

new Control("generation", { value: config.generation, min: 0, max: 2000, step: 50 })
new Control("steps", { value: config.steps, min: 0, max: 2000, step: 100 })

let population;
window.addEventListener("resize", e => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})

ctrlBtn.addEventListener("click", e => {
    modal.showModal()
    e.stopPropagation()
})

let start = false
cancelBtn.addEventListener("click", e => {
    modal.close()
    e.stopPropagation()
    if (!start) {
        for (let index = 0; index < config.bird_num; index++) {
            Birds.push(new Bird())
        }
        population = new Population(config.bird_num, 0.05)
        // setTimeout(() => {
        if (config.generation === 0 || config.steps === 0) animate1()
        else if (config.show_process) animateText()
        else {
            document.getElementById("displayG").style.display = "block"
            setTimeout(() => {
                animate()
            }, 500)
        }
        showProcess.disabled = true
        // })
        start = true
        for (let i = 0; i < config.max_food / 4; i++) {
            Foods.push(new Food())
        }

    }
})


// document.addEventListener("click", e => {
//     Birds.push(new Bird(null, e.pageX - config.bird_width / 2, e.pageY - config.bird_width / 2))
// })



// const demobird = new DemoBird(demoImg)
// // Birds.push(demobird)

modal.showModal()





let g = 0
let G = 0



async function animate() {
    while (true) {
        for (const bird of population.Birds) {
            if (bird.dead) continue
            bird.generateForce()
            bird.update()
        }

        population.generateFood()
        for (const obstacle of Obstacles) {
            obstacle.update()
        }

        if (g++ > config.steps) {

            population.select();
            population.reproduction();

            g = 0
            console.log(G)


            if (++G < config.generation) {
                // console.log(population.best_bird)
                // let sum = 0, count = 0
                // population.track_birds.forEach((b, i) => {
                //     if (!b.dead) {
                //         sum += b.fitval
                //         ++count
                //     }
                // })
                // console.log(count, sum / count)
            }
            else {
                const arr = [0, 0, 0, 0, 0, 0]
                Birds.forEach((b, i) => {
                    b.genes.forEach((g, j) => {
                        arr[j] += g;
                    })
                })
                console.log(arr.map(v => v / population.population_num))
                population.generateObstacles(20)
                // for (const i in Birds) {
                //     Birds[i] = new Bird(population.best_bird.genes)
                // }
                console.log(Birds)
                // Birds.forEach(b => {
                //     b.genes = [0.9, 0.5, 0.9, 0.9, 0.9, 0.5]
                // })
                document.getElementById("displayG").style.display = "none"
                alert("finish")
                animate1()
                break;

            }
        }
    }
}

function animate1() {

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const food of Foods) {
        food.draw()
    }
    for (const obstacle of Obstacles) {
        if (!config.stop) obstacle.update()
        obstacle.draw()
    }
    for (const bird of population.Birds) {
        if (bird.dead) continue
        if (!config.stop) {
            bird.generateForce()
            bird.update()
        }
        bird.draw()
        bird.draw_circle()

    }

    if (!config.stop) population.generateFood()
    requestAnimationFrame(animate1)

}



function animateText() {

    ctx.clearRect(0, 0, canvas.width, canvas.height)



    for (const food of Foods) {
        food.draw()
    }
    for (const obstacle of Obstacles) {
        obstacle.update()
        obstacle.draw()
    }
    for (const bird of population.Birds) {
        if (bird.dead) continue
        bird.generateForce()
        bird.update()
        bird.draw()
    }
    population.generateFood()

    if (g++ > config.steps) {
        population.select();
        population.reproduction();

        g = 0
        console.log(G)


        if (G++ < config.generation) {
            console.log(population.best_bird)
        }
        else {
            const arr = [0, 0, 0, 0, 0, 0]
            Birds.forEach((b, i) => {
                b.genes.forEach((g, j) => {
                    arr[j] += g;
                })
            })
            console.log(arr.map(v => v / population.population_num))
            population.generateObstacles(20)

            console.log(Birds)
            alert("finish")

            return animate1()
        }
    }

    ctx.font = "20px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.fillText(`Generation: ${G}/${config.generation}`, 20, 20);
    requestAnimationFrame(animateText)
}


function random(max, min = 0) {
    return Math.random() * (max - min) + min
}



function Collision(a, b) {
    const flag = a.x > b.x + b.width ||
        a.x + a.width < b.x ||
        a.y >= b.y + b.width ||
        a.y + a.width <= b.y;
    return !flag;
    // return a.x >= b.x && a.x <= b.x + b.width && a.y >= b.y && a.y <= b.y + b.width
}


