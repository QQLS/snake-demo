export default class Snake {
    private element: HTMLElement
    private header: HTMLElement
    private bodies: HTMLCollectionOf<HTMLElement>

    constructor() {
        this.element = document.getElementsByClassName('snake')[0] as HTMLElement
        this.header = document.querySelector('.snake > div') as HTMLElement
        this.bodies = this.element.getElementsByTagName('div')
    }

    get top() {
        return this.header.offsetTop
    }

    get left() {
        return this.header.offsetLeft
    }

    get length() {
        return this.bodies.length
    }

    random() {
        this.header.style.top = Math.round(Math.random() * 29) * 10 + 'px'
        this.header.style.left = Math.round(Math.random() * 29) * 10 + 'px'
    }

    moveTo = (top: number, left: number) => {
        if (top == this.top && left == this.left) {
            return true
        }

        if (this.checkBodyCross(top, left)) { // 如果出现自残返回失败
            return false
        }

        let lastTop = top
        let lastLeft = left
        let index = 0
        do {
            let item = this.bodies.item(index)!
            let originTop = item.offsetTop
            let originLeft = item.offsetLeft
            item.style.top = lastTop + 'px'
            item.style.left = lastLeft + 'px'
            lastTop = originTop
            lastLeft = originLeft
        } while (++index < this.bodies.length)
        return true
    }

    addBody = () => {
        this.element.insertAdjacentHTML('beforeend', '<div></div>')
    }

    // 检查是否撞到自己的身体
    checkBodyCross = (top: number, left: number) => {
        // 四个以上节点才会出现撞到自己的身体
        if (this.bodies.length <= 4) {
            return false
        }

        // 模拟身体移动
        let bodiesPoint:[number, number][] = [[top, left]]
        for (let index = 0; index < this.bodies.length - 1; index++) {
            let item = this.bodies.item(index)!
            let point: [number, number] = [item.offsetTop, item.offsetLeft]
            // 检测新的点是否已经有存在的点
            const isExist = bodiesPoint.some((value) => {
                return value[0] == point[0] && value[1] == point[1]
            })
            if (isExist) {
                return true
            } else {
                bodiesPoint.push(point)
            }
        }

        return false
    }

    checkTurnAround = (top: number, left: number) => {
        // 只有一个节点不需要考虑下面的问题
        if (this.bodies.length <= 1) {
            return false
        }

        // 首先检查是否发生调头
        if (this.top == top) { // 表示左右移动
            if ((
                this.left > left // 让其向左走
                && this.left > this.bodies.item(1)!.offsetLeft // 原本向右走
                )
                || (
                this.left < left // 让其向右走
                && this.left < this.bodies.item(1)!.offsetLeft // 原本向左走
                )) {
                return true
            }
        } else if (this.left == left) { // 表示上下移动
            if ((
                this.top > top // 让其向上走
                && this.top > this.bodies.item(1)!.offsetTop // 原本向下走
                )
                || (
                this.top < top // 让其向下走
                && this.top < this.bodies.item(1)!.offsetTop // 原本向上走
                )) {
                return true
            }
        }
        return false
    }
}