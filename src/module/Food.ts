export default class Food {
    private element: HTMLElement

    constructor() {
        this.element = document.getElementsByClassName('random-body')[0] as HTMLElement
    }

    get top() {
        return this.element.offsetTop
    }

    get left() {
        return this.element.offsetLeft
    }

    random() {
        this.element.style.top = Math.round(Math.random() * 29) * 10 + 'px'
        this.element.style.left = Math.round(Math.random() * 29) * 10 + 'px'
    }
}