import styles from './Content.module.scss'
import classNames from 'classnames/bind'
import { Stage, Layer } from 'react-konva'
import { useState, useRef, useEffect } from 'react'
import KonvaText from '../Konva/KonvaText/index'
const cx = classNames.bind(styles)

const initialTexts = [
    {
        text: 'text here',
        x: 120,
        y: 20,
        fontSize: 50,
        draggable: true,
        // width: 400,
        fontStyle: 'normal',
        align: 'center',
        id: 0,
        textDecoration: 'line-through ',
        fontVariant: 'small-caps',
        wrap: 'word'
    },
    {
        text: 'all draggble and resizable',
        x: 50,
        y: 250,
        fontSize: 40,
        draggable: true,
        width: 400,
        // height:50,
        // fillPatternImage:'star.svg',
        ellipsis: true,
        fontFamily: 'changa',
        stroke: 'blue',
        align: 'center',
        id: 1
    },
    {
        text: 'hello world',
        x: 10,
        y: 120,
        fontSize: 120,
        draggable: true,
        width: 600,
        fontStyle: 'normal',
        align: 'left',
        id: 2,
        lineHeight: 1,
        fill: '#f84852',
        stroke: 'purple',
        strokeWidth: 4
    }
]

function Content() {
    // common
    const wrapperRef = useRef(null)
    const [stageSize, setStageSize] = useState({
        width: 0,
        height: 0
    })
    useEffect(() => {
        if (wrapperRef.current) {
            const width = wrapperRef.current.clientWidth
            const height = wrapperRef.current.clientHeight

            setStageSize({
                width,
                height
            })
        }
    }, [wrapperRef])

    // const handleResize = useCallback(() => {
    //     if (wrapperRef.current) {
    //         const width = wrapperRef.current.clientWidth
    //         const height = wrapperRef.current.clientHeight
    //         setStageSize({
    //             width,
    //             height
    //         })
    //     }
    // }, [wrapperRef])
    // useEffect(() => {
    //     handleResize()
    //     window.addEventListener('resize', handleResize)
    //     return () => {
    //         window.removeEventListener('resize', handleResize)
    //     }
    // }, [handleResize])

    // text
    const [texts, setTexts] = useState(initialTexts)
    const [selectedId, selectShape] = useState(null)

    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage()
        if (clickedOnEmpty) {
            selectShape(null)
        }
    }

    return (
        <div className={cx('wrapper')} ref={wrapperRef}>
            <Stage
                width={stageSize.width}
                height={stageSize.height}
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}
            >
                <Layer>
                    {texts.map((txt, i) => {
                        return (
                            <KonvaText
                                key={i}
                                textProps={txt}
                                isSelected={txt.id === selectedId}
                                onSelect={() => {
                                    selectShape(txt.id)
                                }}
                                onChange={(newAttrs) => {
                                    const txts = texts.slice()
                                    txts[i] = newAttrs
                                    setTexts(txts)
                                }}
                            />
                        )
                    })}
                </Layer>
            </Stage>
        </div>
    )
}

export default Content
