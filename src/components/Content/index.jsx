import classNames from 'classnames/bind'
import { useEffect, useRef, useState } from 'react'
import { Layer, Stage } from 'react-konva'
import KonvaImage from '../Konva/KonvaImage/index'
import styles from './Content.module.scss'
const cx = classNames.bind(styles)

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

    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage()
        if (clickedOnEmpty) {
        }
    }

    // image
    const [elements, setElements] = useState([])
    const [selectedElement, setSelectedElement] = useState(false)
    const [imageObj, setImageObj] = useState(null)
    useEffect(() => {
        const img = new Image()
        img.onload = () => {
            setImageObj(img)
        }
        img.src =
            'https://goeco.link/Ziwmb'
    }, [])

    const [imageSize, setImageSize] = useState({
        width: 200,
        height: 200
    })

    const [isCentered, setIsCentered] = useState(false)

    return (
        <div style={{ height: '90vh',border:'1px solid #333', width:'90vw' }}>
            <div className={cx('wrapper')} ref={wrapperRef}>
                <Stage
                    width={stageSize.width}
                    height={stageSize.height}
                    onMouseDown={checkDeselect}
                    onTouchStart={checkDeselect}
                >
                    <Layer>
                        {imageObj && (
                            <KonvaImage
                                imageProps={{
                                    image: imageObj,
                                    width: imageSize.width,
                                    height: imageSize.height,
                                    draggable: true
                                }}
                                stageSize={stageSize}
                                setImageSize={setImageSize}
                                isCentered={isCentered}
                                isSelected={selectedElement}
                                onSelect={() => setSelectedElement(true)}
                                onChange={(newProps) => {
                                    setElements(
                                        elements.map((el) =>
                                            el.id === selectedElement
                                                ? { ...el, props: newProps }
                                                : el
                                        )
                                    )
                                }}
                            />
                        )}
                    </Layer>
                </Stage>
            </div>
            <button
                style={{ margin: '10px' }}
                onClick={() =>
                    setImageSize((prev) => ({
                        ...prev,
                        width: stageSize.width
                    }))
                }
            >
                set full width
            </button>
            <button
                style={{ margin: '10px' }}
                onClick={() =>
                    setImageSize((prev) => ({
                        ...prev,
                        height: stageSize.height
                    }))
                }
            >
                set full height
            </button>
            <button
                style={{ margin: '10px' }}
                onClick={() => {
                    // setImageSize((prev) => ({
                    //     ...prev,
                    //     height: stageSize.height,
                    //     width: stageSize.width
                    // }))
                    setIsCentered(!isCentered)
                }}
            >
                set full
            </button>
        </div>
    )
}

export default Content
