import Konva from 'konva'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Layer, Stage } from 'react-konva'
import DesignConstant from './constants/DesignConstant'
import KonvaEditorContext from './context/KonvaEditorContext'
import DesignHelper from './helper/DesignHelper'
import ImageLayer from './layers/ImageLayer'
import TextLayer from './layers/TextLayer'

const KonvaEditor = () => {

    const stage = useRef()
    const context = useContext(KonvaEditorContext)
    const [initialLayers, setInitialLayers] = useState([
        {
            side: 'front',
            layers: [
                {
                    id: '1',
                    text: "all draggble and resizable",
                    x: 50,
                    y: 250,
                    fontSize: 40,
                    draggable: true,
                    width: 400,
                    ellipsis: true,
                    fontFamily: "changa",
                    align: "center",
                    layerType: 'text'
                },
                {
                    id: '2',
                    text: "hello world",
                    x: 10,
                    y: 120,
                    fontSize: 120,
                    draggable: true,
                    width: 600,
                    fontStyle: "normal",
                    align: "left",
                    lineHeight: 1,
                    fill: "#f84852",
                    strokeWidth: 4,
                    layerType: 'text'
                },
            ]
        },
        {
            side: 'back',
            layers: [
                {
                    id: 3,
                    src: 'https://upload.wikimedia.org/wikipedia/commons/5/55/John_William_Waterhouse_A_Mermaid.jpg',
                    x: 600 / 2 - 400 / 2,
                    y: 600 / 2 - 600 / 2,
                    width: 400,
                    height: 600,
                    draggable: true,
                    layerType: 'image'
                }
            ]
        }

    ])
    const [currentSide, setCurrentSide] = useState('front')
    const [layers, setLayers] = useState([])
    const [selectedLayer, setSelectedLayer] = useState(null);

    const onDeattach = (e) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedLayer(null);
        }
    }

    const onUpdateAlign = (align = 'center') => {
        if (context.currentLayer) {
            context.currentLayer.setAlign(align)
        }
    }

    const duplicateLayer = () => {
        const layer = layers.find(l => l.id === selectedLayer)
        layer.id = 5
        console.log(layer)
        if (layer) {
            const newLayers = [...layers, layer]
            setLayers(newLayers)
        }
    }

    const onDeleteLayer = () => {
        if (context.currentLayer) {
            hideTool()
            setSelectedLayer(null)
            context.setCurrentLayer(null)
            context.currentLayer.destroy()
        }
    }

    const onFlipX = () => {
        if (context.currentLayer) {
            context.currentLayer.offsetX(context.currentLayer.width() / 2)
            context.currentLayer.to({ scaleX: -context.currentLayer.scaleX() })
        }
    }

    const onFlipY = () => {
        if (context.currentLayer) {
            context.currentLayer.offsetY(context.currentLayer.height() / 2)
            context.currentLayer.to({ scaleY: -context.currentLayer.scaleY() })
        }
    }

    const hideTool = () => {
        const textEditor = document.getElementById('text-editor')
        textEditor.style.display = 'none'
    }

    const updateLayerBySide = (side = 'front', newLayers = []) => {
        const layerBySide = initialLayers.find(layer => layer.side === side)
        layerBySide.layers = newLayers
    }

    const addImage = async () => {
        const imageUrl = 'https://upload.wikimedia.org/wikipedia/vi/7/79/Super_Hero_Taisen.jpg'
        const imageRatio = await DesignHelper.getImageRatio(imageUrl)
        const imageWith = context.frameSize / 3;
        const { x, y } = DesignHelper.getCenterCoordinate(
            { x: imageWith, y: imageWith / imageRatio },
            { x: context.frameSize, y: context.frameSize }
        )
        const image = {
            ...DesignConstant.DEFAULT_IMAGE_ELEMENT,
            src: imageUrl,
            x,
            y,
            width: imageWith,
            height: imageWith / imageRatio,
        }
        const newLayers = [...layers, image]
        setLayers(newLayers)
        updateLayerBySide(currentSide, newLayers)
    }

    const addText = () => {
        const text = {
            ...DesignConstant.DEFAULT_TEXT_ELEMENT,
            x: context.frameSize / 2,
            y: context.frameSize / 2,
        }
        const newLayers = [...layers, text]
        setLayers(newLayers)
        updateLayerBySide(currentSide, newLayers)
    }

    useEffect(() => {
        const selectedLayer = initialLayers.find(layer => layer.side === currentSide)
        setLayers(selectedLayer.layers)
    }, [currentSide])

    return (
        <div className='container' style={{ border: '1px solid', width: `${context.frameSize}px`, height: `${context.frameSize}px` }}>
            <button type="button" onClick={() => setCurrentSide('front')}>front</button>
            <button type='button' onClick={() => setCurrentSide('back')}>back</button>
            <button type="button" onClick={() => addImage()}>Add image</button>
            <button type='button' onClick={() => addText()}>Add text</button>
            <Stage
                ref={stage}
                width={context.frameSize}
                height={context.frameSize}
                onMouseDown={onDeattach}
                onTouchStart={onDeattach}
            >
                <Layer>
                    {layers.map((layer, i) => {
                        return (
                            layer.layerType === 'text' ?
                                <TextLayer
                                    key={i}
                                    textProps={layer}
                                    isSelected={layer.id === selectedLayer}
                                    onSelect={() => {
                                        setSelectedLayer(layer.id);
                                    }}
                                    onChange={(newAttrs) => {
                                        const listLayers = layers.slice();
                                        listLayers[i] = newAttrs;
                                        setLayers(listLayers);
                                        updateLayerBySide(currentSide, listLayers)
                                    }}
                                />
                                : <ImageLayer
                                    key={i}
                                    imageProps={layer}
                                    isSelected={layer.id === selectedLayer}
                                    onSelect={() => {
                                        setSelectedLayer(layer.id);
                                    }}
                                    onChange={(newAttrs) => {
                                        const listLayers = layers.slice();
                                        listLayers[i] = newAttrs;
                                        setLayers(listLayers);
                                        updateLayerBySide(currentSide, listLayers)
                                    }}
                                />
                        );
                    })}
                </Layer>
            </Stage>
            {/* <div className='image-editor-tools'>
                <button>rotata</button>
                <button></button>
                <button></button>
                <button></button>
                <button></button>
            </div> */}
            <div className='text-editor-tools' id="text-editor">
                <button onClick={() => onUpdateAlign('left')}>align left</button>
                <button onClick={() => onUpdateAlign('center')}>align center</button>
                <button onClick={() => onUpdateAlign('right')}>align right</button>
                <button onClick={() => onFlipX()}>flip x</button>
                <button onClick={() => onFlipY()}>flip y</button>
                <button onClick={() => duplicateLayer()}>duplicate</button>
                <button onClick={onDeleteLayer}>delete</button>
            </div>
        </div>
    )

}

export default KonvaEditor