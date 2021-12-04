export default class ScorePanel {
    private scoreElement: HTMLElement
    private levelElement: HTMLElement

    private currentLevel: number = 1

    constructor(private scorePerLevel: number = 10, private levelLimit: number = 10) {
        this.scoreElement = document.getElementsByClassName('score')[0] as HTMLElement
        this.levelElement = document.getElementsByClassName('level')[0] as HTMLElement
    }

    addScore = (step: number = 1) => {
        let currentScore = Number(this.scoreElement.innerText)
        currentScore += step
        if (currentScore >= this.scorePerLevel) {
            currentScore = 0;
            this.addLevel()
        }
        this.scoreElement.innerText = String(currentScore)
    }

    get level() {
        return this.currentLevel
    }

    private addLevel = () => {
        if (++this.currentLevel > this.levelLimit) {
            this.currentLevel = this.levelLimit
        } else {
            this.levelElement.innerText = String(this.currentLevel)
        }
    }
}
