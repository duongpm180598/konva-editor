import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { Image, Transformer } from 'react-konva'
import useImage from 'use-image'
import KonvaEditorContext from '../context/KonvaEditorContext'

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const ImageLayer = ({ imageProps, isSelected, onSelect, onChange, toggleFlip, setToggleFlip }) => {

    const context = useContext(KonvaEditorContext)

    const imageRef = useRef();
    const trRef = useRef();
    let [image] = useImage(imageProps.src)

    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([imageRef.current])
            trRef.current.getLayer().batchDraw()
        }
    }, [isSelected])

    const onItemClick = (event) => {
        onSelect()
        addEditor(event)
        
    }

    const addEditor = (event) => {
        const textNode = event.target
        context.setCurrentLayer(textNode)
        const editor = document.getElementById('image-editor')
        const textPosition = textNode.absolutePosition()

        const areaPosition = {
            x: textPosition.x,
            y: textPosition.y,
        }
        editor.style.display = 'block'
        editor.style.top = areaPosition.y - 100 + 'px'
        editor.style.left = areaPosition.x + 'px'
    }

    const onFlipX = () => {
        const node = imageRef.current;
        const scaleX = node.scaleX();
        node.scaleX(-scaleX / 2); // flip horizontally
        onChange({
            ...imageProps,
            scaleX: -scaleX, // update scaleX prop in imageProps
            x: imageProps.x + (scaleX === 1 ? node.width() : -node.width()),
        });
    }

    const onFlipY = () => {
        const node = imageRef.current;
        const scaleY = node.scaleY();
        node.scaleY(-scaleY); // flip vertically
        onChange({
            ...imageProps,
            scaleY: -scaleY, // update scaleY prop in imageProps
            y: imageProps.y + (scaleY === 1 ? node.height() : -node.height())
        });
    }

    useEffect(() => {
        if (toggleFlip){
            const { flippedX, flippedY } = toggleFlip
            if (flippedX){
                onFlipX()
                setToggleFlip({
                    flippedX: false,
                    flippedY: false
                })
            }else if (flippedY) {
                onFlipY()
                setToggleFlip({
                    flippedX: false,
                    flippedY: false
                })
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toggleFlip])

   
    // useEffect(() => {
    //     if (isFlippedY)
    //         onFlipY()
    // }, [isFlippedY])

    return (
        <Fragment>
            <Image
                image={image}
                onClick={onItemClick}
                onTap={onItemClick}
                onTouchStart={e => console.log({e})}
                ref={imageRef}
                {...imageProps}
                draggable
                onDragEnd={(e) => {
                    addEditor(e)
                    onChange({
                        ...imageProps,
                        x: e.target.x(),
                        y: e.target.y()
                    });
                }}
                onTransformEnd={(e) => {
                    const node = imageRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...imageProps,
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(5, node.height() * scaleY)
                    });
                }}
            />
            {isSelected && (
                <Transformer 
                    ref={trRef}
                />
            )}
        </Fragment>
    )
}

export default ImageLayer