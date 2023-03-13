import React, { Fragment, useEffect, useRef } from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';

const ImageLayer = ({ imageProps, isSelected, onSelect, onChange, toggleFlip, setToggleFlip, addEditorMenu }) => {

    const imageRef = useRef();
    const trRef = useRef();
    let [image] = useImage(imageProps.src)

    const onItemClick = (event) => {
        addEditorMenu(event)
        onSelect()
    }

    // const onFlipX = () => {
    //     const node = imageRef.current;
    //     const scaleX = node.scaleX();
    //     node.scaleX(-scaleX / 2); // flip horizontally
    //     onChange({
    //         ...imageProps,
    //         scaleX: -scaleX, // update scaleX prop in imageProps
    //         x: imageProps.x + (scaleX === 1 ? node.width() : -node.width()),
    //     });
    // }

    // const onFlipY = () => {
    //     const node = imageRef.current;
    //     const scaleY = node.scaleY();
    //     node.scaleY(-scaleY / 2); // flip vertically
    //     onChange({
    //         ...imageProps,
    //         scaleY: -scaleY, // update scaleY prop in imageProps
    //         y: imageProps.y + (scaleY === 1 ? node.height() : -node.height())
    //     });
    // }

    const flipNode = (flipAxis) => {
        const node = imageRef.current;
        const scaleAxis = flipAxis === 'x' ? 'scaleX' : 'scaleY';
        const currentScale = node[scaleAxis]();
        node[scaleAxis](-currentScale / 2); // flip horizontally or vertically

        const newProps = {
            ...imageProps,
            [scaleAxis]: -currentScale,
            [flipAxis === 'x' ? 'x' : 'y']: imageProps[flipAxis === 'x' ? 'x' : 'y'] + (currentScale === 1 ? node[flipAxis === 'x' ? 'width' : 'height']() : -node[flipAxis === 'x' ? 'width' : 'height']())
        };
        onChange(newProps);
    }

    const onFlipX = () => flipNode('x');

    const onFlipY = () => flipNode('y')

    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([imageRef.current])
            trRef.current.getLayer().batchDraw()
        }
    }, [isSelected])

    useEffect(() => {
        if (toggleFlip) {
            const { flippedX, flippedY } = toggleFlip
            if (flippedX) {
                onFlipX()
                setToggleFlip({
                    flippedX: false,
                    flippedY: false
                })
            } else if (flippedY) {
                onFlipY()
                setToggleFlip({
                    flippedX: false,
                    flippedY: false
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toggleFlip])

    return (
        <Fragment>
            <Image
                image={image}
                onClick={onItemClick}
                onTap={onItemClick}
                ref={imageRef}
                {...imageProps}
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