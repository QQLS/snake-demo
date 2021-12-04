import Food from './Food'
import Snake from './Snake'
import ScorePanel from './ScorePanel'

export default class GameControl {
    private readonly element = document.getElementsByClassName('staging')[0] as HTMLElement
    private readonly food = new Food()
    private readonly scorePanel = new ScorePanel()
    private readonly snake = new Snake()

    private direction: string = ''
    private timeoutId?: NodeJS.Timeout
    private isLive = false

    start = () => {
        this.food.random()
        do {
            this.snake.random()
        } while(this.snake.top === this.food.top && this.snake.left === this.food.left)
        addEventListener('keydown', this.keyboardListener)
    }

    private keyboardListener = (ev: KeyboardEvent) => {
        if (this.snake.length > 1 // 蛇身体数量为 1 时不用处理
            && this.checkTurnAround(this.direction, ev.key)) { // 如果是调头不作处理
            return
        }

        // 保存方向, 主要是为了让定时器运行时位置能按照指定方向移动
        this.direction = ev.key
        // 开始移动
        this.move()
    }

    private checkTurnAround = (originDirection: string, newDirection: string) => {
        switch (originDirection) {
            case 'ArrowUp':
            case 'Up':
                return newDirection == 'ArrowDown' || newDirection == 'Down'
            case 'ArrowDown':
            case 'Down':
                return newDirection == 'ArrowUp' || newDirection == 'Up'
            case 'ArrowLeft':
            case 'Left':
                return newDirection == 'ArrowRight' || newDirection == 'Right'
            case 'ArrowRight':
            case 'Right':
                return newDirection == 'ArrowLeft' || newDirection == 'Left'
        }
        return false
    }

    private move = () => {
        this.isLive = true
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
        }
        
        const step = 10
        let top = this.snake.top
        let left = this.snake.left
        switch (this.direction) {
            case 'ArrowUp':
            case 'Up':
                top -= step
                break
            case 'ArrowDown':
            case 'Down':
                top += step
                break
            case 'ArrowLeft':
            case 'Left':
                left -= step
                break
            case 'ArrowRight':
            case 'Right':
                left += step
                break
            default:
                this.isLive = false
                break
        }
        
        // 起初是想通过判断调头来更改 top, left 让其保持继续沿着原方向前进,
        // 后来感觉还是应该从源头进行拦截, 不做无畏的更新
        // if (this.snake.checkTurnAround(top, left)) {
        // }

        console.log(top, left);
        
        if (this.checkBeyondBound(top, left)) {
            alert("Game over!!!")
            this.isLive = false
            return
        }
        
        // 防止食物在蛇身上, 此时发生碰撞应该是失败, 而不是先去吃食物后失败
        if (this.snake.checkBodyCross(top, left)) {
            alert("Game over!!!")
            this.isLive = false
            return
        }

        // 检测能够吃到食物才进行下面的操作
        if (this.checkEatable(top, left)) {
            // 增加一截身体
            this.snake.addBody()
            // 再随机出现一个食物
            this.food.random()
            // 增加分数
            this.scorePanel.addScore()
        }

        // 移动蛇头位置
        if (!this.snake.moveTo(top, left)) {
            alert("Game over!!!")
            this.isLive = false
            return
        }
        
        // 只有是存活着才进行定时移动
        if (this.isLive) {
            this.timeoutId = setTimeout(this.move, 300 - this.scorePanel.level * 20)
        }
    }

    // 检查是否吃到
    private checkEatable = (top: number, left: number) => {
        return top == this.food.top
                && left == this.food.left
    }

    // 检查是否在边界内
    private checkBeyondBound = (top: number, left: number) => {
        return top < 0
                || top >= this.element.clientHeight
                || left < 0
                || left >= this.element.clientWidth
    }
}