import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { Text, Transformer } from 'react-konva';
import KonvaEditorContext from '../context/KonvaEditorContext';

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const TextLayer = ({ textProps, isSelected, onSelect, onChange }) => {
    const context = useContext(KonvaEditorContext)
    const textRef = useRef();
    const trRef = useRef();

    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([textRef.current])
            trRef.current.getLayer().batchDraw()
        }
    }, [isSelected])

    const onItemClick = (event) => {
        onSelect()
        const textNode = event.target
        context.setCurrentLayer(textNode)
        const editor = document.getElementById('text-editor')
        const textPosition = textNode.absolutePosition()

        const areaPosition = {
            x: textPosition.x,
            y: textPosition.y,
        }
        // document.getElementById('btn-delete').addEventListener('click', () => {
        //     textNode.destroy()
        // })
        editor.style.display = 'block'
        editor.style.top = areaPosition.y - 100 + 'px'
        editor.style.left = areaPosition.x + 'px'
    }

    const onItemDrag = (event) => {
        const textNode = event.target
        const editor = document.getElementById('text-editor')
        const textPosition = textNode.absolutePosition()

        const areaPosition = {
            x: textPosition.x,
            y: textPosition.y,
        }
        // document.getElementById('btn-delete').addEventListener('click', () => {
        //     textNode.destroy()
        // })
        editor.style.top = areaPosition.y - 100 + 'px'
        editor.style.left = areaPosition.x + 'px'
    }

    const onDoubleClick = (event) => {
        const textNode = event.target

        //hide textNode and transformer
        textNode.hide()
        trRef.current.hide()

        // find position of text node relative to the stage
        const textPosition = textNode.absolutePosition()

        const areaPosition = {
            x: textPosition.x,
            y: textPosition.y,
        }
        const textarea = document.createElement('textarea')
        
        // add class to absolute textarea
        textarea.className = 'inline-editor'
        document.body.appendChild(textarea)
        // wrapperRef.appendChild(textarea)

        textarea.value = textNode.text()
        textarea.style.top = areaPosition.y + 'px'
        textarea.style.left = areaPosition.x + 'px'
        textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px'
        textarea.style.maxWidth = context.frameSize - areaPosition.x + 'px'
        textarea.style.height =
            textNode.height() - textNode.padding() * 2 + 5 + 'px'
        textarea.style.fontSize = textNode.fontSize() + 'px'
        textarea.style.transformOrigin = 'left top'
        textarea.style.lineHeight = textNode.lineHeight()
        textarea.style.fontFamily = textNode.fontFamily()
        textarea.style.textAlign = textNode.align()
        textarea.style.color = textNode.fill()
        const rotation = textNode.rotation()
        let transform = ''
        if (rotation) {
            transform += 'rotateZ(' + rotation + 'deg)'
        }

        let px = 0;
        // also we need to slightly move textarea on firefox
        // because it jumps a bit
        var isFirefox =
            navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isFirefox) {
            px += 2 + Math.round(textNode.fontSize() / 20);
        }
        transform += 'translateY(-' + px + 'px)';

        textarea.style.transform = transform;

        // reset height
        textarea.style.height = 'auto';
        // after browsers resized it we can set actual value
        textarea.style.height = textarea.scrollHeight + 3 + 'px';

        textarea.focus();

        function removeTextarea() {
            textarea.parentNode.removeChild(textarea);
            window.removeEventListener('click', handleOutsideClick);
            textNode.show();
            if (trRef.current) {
                trRef.current.show();
                trRef.current.forceUpdate();
            }
        }

        function setTextareaWidth(newWidth) {
            if (!newWidth) {
                // set width for placeholder
                newWidth = textNode.placeholder.length * textNode.fontSize();
            }
            // some extra fixes on different browsers
            var isSafari = /^((?!chrome|android).)*safari/i.test(
                navigator.userAgent
            );
            var isFirefox =
                navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            if (isSafari || isFirefox) {
                newWidth = Math.ceil(newWidth);
            }

            var isEdge =
                document.documentMode || /Edge/.test(navigator.userAgent);
            if (isEdge) {
                newWidth += 1;
            }
            textarea.style.width = newWidth + 'px';
        }

        textarea.addEventListener('keydown', function (e) {
            // hide on enter
            // but don't hide on shift + enter
            if (e.keyCode === 13 && !e.shiftKey) {
                textNode.text(textarea.value);
                removeTextarea();
            }
            // on esc do not set value back to node
            if (e.keyCode === 27) {
                removeTextarea();
            }
        });

        textarea.addEventListener('keydown', function (e) {
            const scale = textNode.getAbsoluteScale().x;
            setTextareaWidth(textNode.width() * scale);
            textarea.style.height = 'auto';
            textarea.style.height =
                textarea.scrollHeight + textNode.fontSize() + 'px';
        });

        function handleOutsideClick(e) {
            if (e.target !== textarea) {
                textNode.text(textarea.value);
                removeTextarea();
            }
        }
        setTimeout(() => {
            window.addEventListener('click', handleOutsideClick);
        });
    }


    return (
        <Fragment>
            <Text
                onClick={onItemClick}
                onTap={onItemClick}
                ref={textRef}
                {...textProps}
                draggable
                onDblClick={onDoubleClick}
                onDblTap={onDoubleClick}
                onDragMove={onItemDrag}
                onDragEnd={(e) => {
                    onChange({
                        ...textProps,
                        x: e.target.x(),
                        y: e.target.y()
                    });
                }}
                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = textRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...textProps,
                        x: node.x(),
                        y: node.y(),
                        // set minimal value
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(5, node.height() * scaleY)
                    });
                }}
                on
            />
            {isSelected && (
                <Transformer ref={trRef} />
            )}
        </Fragment>
    )
}

export default TextLayer