import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Image, Transformer } from 'react-konva'
import useImage from 'use-image'

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const ImageLayer = ({ imageProps, isSelected, onSelect, onChange }) => {
    const imageRef = useRef();
    const trRef = useRef();
    let [image] = useImage(imageProps.src)

    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([imageRef.current])
            trRef.current.getLayer().batchDraw()
        }
    }, [isSelected])

    return (
        <Fragment>
            <Image
                image={image}
                onClick={onSelect}
                onTap={onSelect}
                ref={imageRef}
                {...imageProps}
                draggable
                onDragEnd={(e) => {
                    onChange({
                        ...imageProps,
                        x: e.target.x(),
                        y: e.target.y()
                    });
                }}
                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
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
                        // set minimal value
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(5, node.height() * scaleY)
                    });
                }}
            />
            {isSelected && (
                <Transformer ref={trRef} />
            )}
        </Fragment>
    )
}

export default ImageLayer