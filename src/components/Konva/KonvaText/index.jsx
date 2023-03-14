import React from 'react'
import { Text, Transformer } from 'react-konva'

function KonvaText({ textProps, isSelected, onSelect, onChange }) {
    const textRef = React.useRef()
    const trRef = React.useRef()

    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([textRef.current])
            trRef.current.getLayer().batchDraw()
        }
    }, [isSelected])
    return (
        <React.Fragment>
            <Text
                onClick={onSelect}
                onTap={onSelect}
                ref={textRef}
                {...textProps}
                verticalAlign="center"
                // dragBoundFunc ={(pos)=>{
                //   // important pos - is absolute position of the node
                //   // you should return absolute position too
                //   return {
                //     x: this.absolutePosition().x,
                //     y: pos.y,
                //   };
                // }}
                // verticalAlign='center'
                // fillPatternImage= 'https://i.pinimg.com/564x/eb/68/86/eb68862a2eae8f1648599653cdb740b7.jpg'
                draggable
                onDragEnd={(e) => {
                    onChange({
                        ...textProps,
                        x: e.target.x(),
                        y: e.target.y()
                    })
                }}
                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = textRef.current
                    const scaleX = node.scaleX()
                    const scaleY = node.scaleY()

                    // we will reset it back
                    node.scaleX(1)
                    node.scaleY(1)
                    onChange({
                        ...textProps,
                        x: node.x(),
                        y: node.y(),
                        // set minimal value
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(5, node.height() * scaleY)
                    })
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox
                        }
                        return newBox
                    }}
                />
            )}
        </React.Fragment>
    )
}

export default KonvaText
