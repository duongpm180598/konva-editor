class DesignConstant {

    static DEFAULT_TRANSFORM = {
        id: Math.random().toString(36).slice(2, 7),
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        draggable: true
    }

    static DEFAULT_TEXT_ELEMENT = {
        ...this.DEFAULT_TRANSFORM,
        text: 'Your text',
        fontSize: 20,
        color: '#000000',
        align: 'center',
        fontStyle: "normal",
        layerType: 'text'
    }

    static DEFAULT_IMAGE_ELEMENT = {
        ...this.DEFAULT_TRANSFORM,
        allow_extensions: ['png', 'jpg', 'jpeg'],
        dimension: {
            width: 6000,
            height: 6000,
        },
        layerType: 'image'
    }
}

export default DesignConstant