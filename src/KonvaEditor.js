import Konva from 'konva'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Layer, Stage } from 'react-konva'
import KonvaEditorContext from './context/KonvaEditorContext'
import ImageLayer from './layers/ImageLayer'
import TextLayer from './layers/TextLayer'

const initialLayers = [
    {
        id: 1,
        text: "all draggble and resizable",
        x: 50,
        y: 250,
        fontSize: 40,
        draggable: true,
        width: 400,
        ellipsis: true,
        fontFamily: "changa",
        stroke: "blue",
        align: "center",
        layerType: 'text'
    },
    {
        id: 2,
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
        stroke: "purple",
        strokeWidth: 4,
        layerType: 'text'
    },
    // {
    //     id: 3,
    //     src: 'https://upload.wikimedia.org/wikipedia/commons/5/55/John_William_Waterhouse_A_Mermaid.jpg',
    //     x: 600 / 2 - 400 / 2,
    //     y: 600 / 2 - 600 / 2,
    //     width: 400,
    //     height: 600,
    //     draggable: true,
    //     layerType: 'image'
    // }
]

const KonvaEditor = () => {

    const stage = useRef()
    const context = useContext(KonvaEditorContext)
    const [layers, setLayers] = useState(initialLayers)
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

    const hideTool = () => {
        const textEditor = document.getElementById('text-editor')
        textEditor.style.display = 'none'
    }

    return (
        <div className='container'>
            {/* <button type="button" onClick={() => draw('image')}>Add image</button>
            <button type='button' onClick={() => draw('text')}>Add text</button>
            <button type='button' onClick={() => clearTransform()}>Clear</button> */}
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
                <button onClick={() => duplicateLayer()}>duplicate</button>
                <button onClick={onDeleteLayer}>delete</button>
            </div>
        </div>
    )

}

export default KonvaEditor