import Konva from 'konva'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Layer, Stage } from 'react-konva'
import DesignConstant from './constants/DesignConstant'
import KonvaEditorContext from './context/KonvaEditorContext'
import DesignHelper from './helper/DesignHelper'
import ImageLayer from './layers/ImageLayer'
import TextLayer from './layers/TextLayer'
import EditorTool from './components/EditerTool';

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

    const onDeAttach = (e) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            hideTool()
            setSelectedLayer(null)
            context.setCurrentLayer(null)
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
        hideTool()
        setSelectedLayer(null)
        if (context.currentLayer) {
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
        const imageEditor = document.getElementById('image-editor')
        textEditor.style.display = 'none'
        imageEditor.style.display = 'none'
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
            rotation: 0, // xoay
            cornerRadius: 0, // radius
            x,
            y,
            id: Date.now().toString(),
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



    // add editor
    const addEditorMenu = (event) => {
        const elNode = event.target
        const textPosition = elNode.absolutePosition()
        // context.setCurrentLayer(elNode)
        const editor = document.getElementById('image-editor')
        editor.style.display = 'block'




        // const centerX = elNode.attrs.x - elNode.attrs.width / 2;
        // const centerY = elNode.attrs.y - elNode.attrs.height / 2;

        // console.log(centerX, centerY)
        // console.log(textPosition.x, textPosition.y)
        // const offsetX = 0;
        // const offsetY = elNode.attrs.height / 2 + 20

        // const centerX = elNode.attrs.x + elNode.attrs.width / 2;
        // const centerY = elNode.attrs.y + elNode.attrs.height / 2;

        // const elNodeX = centerX + offsetX;
        // const elNodeY = centerY + offsetY;

        // // console.log(elNodeX, elNodeY)

        // editor.style.top = elNodeY + 'px'
        // editor.style.left = elNodeX + 'px'

        const areaPosition = {
            x: textPosition.x,
            y: textPosition.y,
        }

        editor.style.top = areaPosition.y - 100 + 'px'
        editor.style.left = areaPosition.x - 50 + 'px'


    }

    const setFullSize = (axis = 'xy') => {
        const width = context.frameSize
        const height = context.frameSize
        setLayers(prev => {
            return prev.map(item => {
                if (item.id === selectedLayer) {
                    return {
                        ...item,
                        width: axis === 'xy' || axis === 'x' ? width : item.width,
                        height: axis === 'xy' || axis === 'y' ? height : item.height,
                        x: axis === 'xy' || axis === 'x' ? 0 : item.x,
                        y: axis === 'xy' || axis === 'y' ? 0 : item.y,
                    }
                } return item
            })
        })
    }

    const setSize = (axis) => {
        const { width, height } = axis
        setLayers(prev => {
            return prev.map(item => {
                if (item.id === selectedLayer) {
                    return {
                        ...item,
                        width: width ? width : item.width,
                        height: height ? height : item.height
                    }
                } return item
            })
        })
    }

    const setScale = (number) => {
        setLayers(prev => {
            return prev.map(item => {
                if (item.id === selectedLayer) {
                    return {
                        ...item,
                        scaleX: number ? number : item.scaleX,
                        scaleY: number ? number : item.scaleY
                    }
                } return item
            })
        })
    }

    const changeRotate = (number) => {
        setLayers(prev => {
            return prev.map(item => {
                if (item.id === selectedLayer) {
                    return {
                        ...item,
                        rotation: number ? number : 0,
                    }
                } return item
            })
        })
    }

    const setPosition = (position) => {
        const { top, left } = position
        setLayers(prev => {
            return prev.map(item => {
                if (item.id === selectedLayer) {
                    return {
                        ...item,
                        y: top ? top : item.y,
                        x: left ? left : item.x
                    }
                } return item
            })
        })
    }

    const setPosition2 = (position) => {
        // const { top, left } = position
        // console.log({ top, left })
        setLayers(prev => {
            return prev.map(item => {
                if (item.id === selectedLayer) {
                    if (position === 'top') {
                        return {
                            ...item,
                            y: 0,
                        }
                    } else if (position === 'left') {
                        return {
                            ...item,
                            x: 0,
                        }
                    } else if (position === 'bottom') {
                        return {
                            ...item,
                            y: context.frameSize - item.height,
                        }
                    } else if (position === 'right') {
                        return {
                            ...item,
                            x: context.frameSize - item.width,
                        }
                    } else if (position === 'ver') {
                        const { x } = DesignHelper.getCenterCoordinate(
                            { x: item.width, y: item.width },
                            { x: context.frameSize, y: context.frameSize }
                        )
                        return {
                            ...item,
                            x: x,
                        }
                    } else if (position === 'hor') {
                        const { y } = DesignHelper.getCenterCoordinate(
                            { x: item.height, y: item.height },
                            { x: context.frameSize, y: context.frameSize }
                        )
                        return {
                            ...item,
                            y: y,
                        }
                    }
                } return item
            })
        })
    }

    const onZoom = (e) => {

        const { deltaY } = e.evt

        if (deltaY > 0) {
            setScaleXY(scaleXY / 1.2);
        } else {
            setScaleXY(scaleXY * 1.2);
        }

        let scale = 1
        scale += deltaY * -0.01;

        // Restrict scale
        scale = Math.min(Math.max(0.125, scale), 4);

        // Apply scale transform
        // stage.current.style.transform = `scale(${scale})`;
    }

    const [drag, setDrag] = useState(false);

    const [scaleXY, setScaleXY] = useState(1);

    const handleZoomIn = () => {
        setScaleXY(scaleXY * 1.2);
    };

    const handleZoomOut = () => {
        setScaleXY(scaleXY / 1.2);
    }

    // flip image horizontally and vertically
    const [flipAxis, setFlipAxis] = useState({
        x: false,
        y: false
    })

    return (
        <div className='container' style={{ border: '1px solid', width: `${context.frameSize}px`, height: `${context.frameSize}px` }}>
            <button type="button" onClick={() => setCurrentSide('front')}>front</button>
            <button type='button' onClick={() => setCurrentSide('back')}>back</button>
            <button type="button" onClick={() => addImage()}>Add image</button>
            <button type='button' onClick={() => addText()}>Add text</button>
            <button type='button' onClick={() => setDrag(!drag)}>drag</button>
            <button onClick={handleZoomIn}>Zoom In {Math.round(scaleXY * 100)}</button>
            <button onClick={handleZoomOut}>Zoom Out {Math.round((1 / scaleXY) * 100)}</button>
            <Stage
                ref={stage}
                width={context.frameSize}
                height={context.frameSize}
                onClick={onDeAttach}
                onMouseDown={onDeAttach}
                onTouchStart={onDeAttach}
                draggable={drag}
                style={{ backgroundColor: 'green', cursor: `${drag ? 'grab' : 'default'}` }}
                onWheel={onZoom}
                scale={{ x: scaleXY, y: scaleXY }}
            >
                <Layer
                >
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
                                    flipAxis={flipAxis}
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

                                    // optional
                                    addEditorMenu={addEditorMenu}
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

            <EditorTool
                onDeleteLayer={onDeleteLayer} type={'image'}
                setFullSize={setFullSize} duplicateLayer={duplicateLayer} changeRotate={changeRotate}
                setSize={setSize} setScale={setScale} setPosition={setPosition} setPosition2={setPosition2}
                setFlipAxis={setFlipAxis} flipAxis={flipAxis}
            />
        </div>
    )

}

export default KonvaEditor