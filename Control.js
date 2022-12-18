class Control {
    static createControl(name, option) {
        const { min, max, step, value } = option
        const inputBox = document.createElement("div")
        const label = document.createElement("label")
        const range = document.createElement("input")
        const number = document.createElement("input")
        inputBox.className = "input-box"
        label.textContent = name
        range.type = "range"
        range.min = min
        range.max = max
        range.step = step
        range.value = value
        number.type = "text"
        number.value = value
        inputBox.append(label, range, number)
        controlContainer.append(inputBox)
        return { range, number }
    }
    constructor(name, option) {
        const { range, number } = Control.createControl(name, option)
        this.name = name
        this.range = range
        this.number = number
        this.updateNumber = this._updateNumber.bind(this)
        this.range.addEventListener("mousedown", e => {
            this.range.addEventListener("mousemove", this.updateNumber)
            this.range.addEventListener("touchmove", this.updateNumber)
        })

        this.range.addEventListener("mouseup", e => {
            this.range.removeEventListener("mousemove", this.updateNumber)
            this.range.removeEventListener("touchmove", this.updateNumber)
        })

        this.range.addEventListener("change", e => {
            config[this.name] = Number(this.range.value)
            this.number.value = this.range.value
        })
    }
    _updateNumber() {
        this.number.value = this.range.value
    }
}