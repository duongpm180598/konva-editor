import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';
const ImageLayer = ({ imageProps, isSelected, onSelect, onChange, addEditorMenu, flipAxis }) => {

    const imageRef = useRef();
    const trRef = useRef();
    let [image] = useImage(imageProps.src)

    const [zIndex, setZIndex] = useState(1);

    const onItemClick = (event) => {
        addEditorMenu(event)
        onSelect()
    }

    // const flipNode = (flipAxis) => {
    //     const node = imageRef.current;
    //     const scaleAxis = flipAxis === 'x' ? 'scaleX' : 'scaleY';
    //     const currentScale = node[scaleAxis]();
    //     node[scaleAxis](-currentScale / 2); // flip horizontally or vertically

    //     const newProps = {
    //         ...imageProps,
    //         [scaleAxis]: -currentScale,
    //         [flipAxis === 'x' ? 'x' : 'y']: imageProps[flipAxis === 'x' ? 'x' : 'y'] + (currentScale === 1 ? node[flipAxis === 'x' ? 'width' : 'height']() : -node[flipAxis === 'x' ? 'width' : 'height']())
    //     };
    //     onChange(newProps);
    // }

    // const onFlipX = () => flipNode('x');

    // const onFlipY = () => flipNode('y')

    // useEffect(() => {
    //     if (toggleFlip) {
    //         const { flippedX, flippedY } = toggleFlip
    //         if (flippedX) {
    //             onFlipX()
    //             setToggleFlip({
    //                 flippedX: false,
    //                 flippedY: false
    //             })
    //         } else if (flippedY) {
    //             onFlipY()
    //             setToggleFlip({
    //                 flippedX: false,
    //                 flippedY: false
    //             })
    //         }
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [toggleFlip])

    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([imageRef.current])
            trRef.current.getLayer().batchDraw()
            setZIndex(99)
        }
        else {
            setZIndex(0)
        }
    }, [isSelected])





    return (
        <Fragment>
            <Image
                onClick={onItemClick}
                onTap={onItemClick}
                ref={imageRef}
                {...imageProps}
                image={image}
                draggable
                onDragMove={onItemClick}
                onDragEnd={(e) => {
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
                        height: Math.max(5, node.height() * scaleY),
                    });
                }}
                zIndex={zIndex}

                // flip
                scaleX={flipAxis.x ? -1 : 1}
                width={flipAxis.x ? -1 * imageProps.width : imageProps.width}
                scaleY={flipAxis.y ? -1 : 1}
                height={flipAxis.y ? -1 * imageProps.height : imageProps.height}
            />
            {isSelected && (
                <Transformer ref={trRef} preventDefault={false} />
            )}
        </Fragment>
    )
}

export default ImageLayer