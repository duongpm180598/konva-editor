import Konva from 'konva'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Layer, Stage } from 'react-konva'
import KonvaEditorContext from './context/KonvaEditorContext'

const KonvaEditor = (props) => {

    const stage = useRef()
    const context = useContext(KonvaEditorContext)
    const [currentLayer, setCurrentLayer] = useState(null)

    const draw = (type = '') => {
        const layer = new Konva.Layer()
        const transformer = new Konva.Transformer()
        switch (type) {
            case 'image':
                const imageObj = new Image()
                imageObj.src = 'https://upload.wikimedia.org/wikipedia/commons/5/55/John_William_Waterhouse_A_Mermaid.jpg'
                const imageNode = new Konva.Image({
                    image: imageObj,
                    x: context.frameSize / 2 - 400 / 2,
                    y: context.frameSize / 2 - 600 / 2,
                    width: 400,
                    height: 600,
                    draggable: true,
                });
                layer.add(imageNode)
                transformer.nodes([imageNode])
                layer.add(transformer)
                break;
            case 'text':
                const textNode = new Konva.Text({
                    x: 50,
                    y: 60,
                    fontSize: 20,
                    text: 'Hello from the Konva framework. Try to resize me.',
                    draggable: true,
                });
                layer.add(textNode)
                transformer.nodes([textNode])
                layer.add(transformer)
                break;
            default: break;
        }
        layer.on('click', layerClick)
        layer.on('touchstart', layerClick)
        // layer.on('dragmove', layerDragging)
        layer.batchDraw()
        // setCurrentLayer(layer)
        setCurrentLayer(layer)
        stage.current.add(layer)
    }

    const layerClick = (event) => {
        // setCurrentLayer(event.target)
    }

    const layerDragging = (event) => {
        // console.log(event.target)
    }

    const clearTransform = () => {
        console.log(currentLayer)
        if (currentLayer) {
           
        }
    }

    const disposeTransformer = () => {
        stage.current.on('click', function (e) {
            const currentShape = e.target;
            if (e.target === stage) {
                // tr.nodes([]);
                // return;
              }
        });
    }

    const handleClick = (e) => {
        disposeTransformer()
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClick)
    }, [])

    return (
        <div className='container'>
            <button type="button" onClick={() => draw('image')}>Add image</button>
            <button type='button' onClick={() => draw('text')}>Add text</button>
            <button type='button' onClick={() => clearTransform()}>Clear</button>
            <Stage width={context.frameSize} height={context.frameSize} ref={stage} />
        </div>
    )

}

export default KonvaEditor