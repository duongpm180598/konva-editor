class DesignHelper {
    static getCenterCoordinate = (elementCoordiante, frameCoordinate) => {
        return {
            x: Math.abs(frameCoordinate.x - elementCoordiante.x) / 2,
            y: Math.abs(frameCoordinate.y - elementCoordiante.y) / 2
        }
    }

    static getImageRatio = (imageSrc, waitingTime = 0) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const imageObj = new Image()
                imageObj.src = imageSrc
                imageObj.onload = function () {
                    resolve(this.width / this.height)
                }
                imageObj.onerror = function () {
                    resolve(1)
                }
            }, waitingTime)
        })
    }
}

export default DesignHelper