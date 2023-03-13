// import React from 'react'
// import { Image, Transformer } from 'react-konva'

// function KonvaImage({ imageProps, isSelected, onSelect, onChange }) {
//     const imageRef = React.useRef()
//     const trRef = React.useRef()

//     React.useEffect(() => {
//         if (isSelected) {
//             // we need to attach transformer manually
//             trRef.current.nodes([imageRef.current])
//             trRef.current.getLayer().batchDraw()
//         }
//     }, [isSelected])

//     const [isFlipped, setIsFlipped] = React.useState(false)

//     const handleFlipHorizontal = () => {
//         setIsFlipped(!isFlipped)
//         const image = imageRef.current
//         const scaleX = image.scaleX() * -1
//         const x = image.x() + (scaleX === 1 ? -1 : 1) * image.width()
//         image.scaleX(scaleX)
//         image.x(x)
//     }

//     const imagePropsWithFlip = isFlipped
//         ? { ...imageProps, scaleY: -1 }
//         : imageProps
//     return (
//         <React.Fragment>
// <Image
//     onClick={() => {
//         onSelect()
//         handleFlipHorizontal()
//     }}
//     onTap={onSelect}
//     ref={imageRef}
//     // {...imageProps}
//     draggable
//     onDragEnd={(e) => {
//         onChange({
//             // ...imageProps,
//             ...imagePropsWithFlip,
//             x: e.target.x(),
//             y: e.target.y()
//         })
//     }}
//     {...imagePropsWithFlip}
// />
//             {isSelected && (
//                 <>
//                     <Transformer
//                         ref={trRef}
//                         boundBoxFunc={(oldBox, newBox) => {
//                             console.log({ oldBox, newBox })
//                             if (newBox.width < 5 || newBox.height < 5) {
//                                 return oldBox
//                             }
//                             return newBox
//                         }}
//                     />
//                 </>
//             )}
//         </React.Fragment>
//     )
// }

// export default KonvaImage

import React from 'react'
import { Image, Transformer, Group } from 'react-konva'
import { useEffect } from 'react'

function KonvaImage({
    imageProps,
    isSelected,
    onSelect,
    onChange,
    isCentered,
    setImageSize,
    stageSize
}) {
    const imageRef = React.useRef()
    const trRef = React.useRef()
    const groupRef = React.useRef()

    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([groupRef.current])
            trRef.current.getLayer().batchDraw()
        }
    }, [isSelected])

    // const [isFlippedX, setIsFlippedX] = React.useState(false)
    // const [isFlippedY, setIsFlippedY] = React.useState(false)

    const handleFlipHorizontal = () => {
        // setIsFlippedX(!isFlippedX)
        const group = groupRef.current
        group.scaleX(group.scaleX() * -1)
        group.offsetX(imageRef.current.width() / 2)
    }

    const handleFlipVertical = () => {
        // setIsFlippedY(!isFlippedY)
        const group = groupRef.current
        group.scaleY(group.scaleY() * -1)
        group.offsetY(imageRef.current.height() / 2)
    }

    const imagePropsWithFlip = {
        ...imageProps,
        width: stageSize.width,
        height: stageSize.height
        // scaleX: isFlippedX ? -1 : 1,
        // scaleY: isFlippedY ? -1 : 1
    }

    const handleCenter = () => {
        const group = groupRef.current
        group.x((group.getStage().width() - group.width()) / 2)
        group.y((group.getStage().height() - group.height()) / 2)
    }

    useEffect(() => {
        handleCenter()
    }, [isCentered])

    return (
        <React.Fragment>
            <Group
                ref={groupRef}
                onClick={() => {
                    onSelect()
                    handleFlipHorizontal()
                }}
                onTap={onSelect}
                draggable={true}
                onDragEnd={(e) => {
                    onChange({
                        ...imagePropsWithFlip,
                        x: e.target.x(),
                        y: e.target.y()
                    })
                }}
                {...imagePropsWithFlip}
            >
                <Image
                    width={imageProps.width}
                    height={imageProps.height}
                    ref={imageRef}
                    image={imageProps.image}
                />
            </Group>
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox
                        }
                        setImageSize((prev) => ({
                            ...prev,
                            height: newBox.height,
                            width: newBox.width
                        }))
                        return newBox
                    }}
                />
            )}
        </React.Fragment>
    )
}

export default KonvaImage
