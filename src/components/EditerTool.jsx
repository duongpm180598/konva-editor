function EditorTool({ type = 'image', setToggleFlip, onDeleteLayer }) {
    if (type === 'image')
        return (
            <div className='text-editor-tools' id="image-editor">
                <button
                    onClick={() => setToggleFlip(prev => ({
                        ...prev,
                        flippedX: true
                    }))}
                >FlipX</button>
                <button
                    onClick={() => setToggleFlip(prev => ({
                        ...prev,
                        flippedY: true
                    }))}
                >FlipY</button>

                <button onClick={onDeleteLayer}>delete</button>
            </div>
        )

    return (
        <></>
    )
}

export default EditorTool;