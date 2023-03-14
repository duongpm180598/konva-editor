function EditorTool({
  type = "image",
  setToggleFlip,
  onDeleteLayer,
  setFullSize,
  duplicateLayer,
  changeRotate,
  setSize,
  setScale,
  setPosition,
  setPosition2
}) {

  const onChangeRotate = (e) =>{
    changeRotate(parseInt(e.target.value))
  }

  const onChangeSize = (e) => {
    const {name,value} = e.target
    setSize({
      [name]: parseInt(value)
    })
  }

  const onScale = (e) => {
    const { value } = e.target
    setScale(Number(value))
  }

  const onChangePosition = (e) => {
    const { name, value } = e.target
    setPosition({
      [name]: parseInt(value)
    })
  }

  if (type === "image")
    return (
      <div className="text-editor-tools" id="image-editor">
        <button
          onClick={() =>
            setToggleFlip((prev) => ({
              ...prev,
              flippedX: true,
            }))
          }
        >
          FlipX
        </button>
        <button
          onClick={() =>
            setToggleFlip((prev) => ({
              ...prev,
              flippedY: true,
            }))
          }
        >
          FlipY
        </button>

        {setFullSize && (
          <>
            <button onClick={() => setFullSize("x")}>FullW</button>
            <button onClick={() => setFullSize("y")}>FullH</button>{" "}
            <button onClick={() => setFullSize("xy")}>Full</button>
          </>
        )}

        {onDeleteLayer && <button onClick={onDeleteLayer}>delete</button>}

        {duplicateLayer && <button onClick={duplicateLayer}>duplicate</button>}

        <div>
          {changeRotate && <input placeholder="rotate" onChange={onChangeRotate} type="number" />}
          {setScale && <input placeholder="scale" onChange={onScale} type="number" />}
        </div>

        <div>
          {setSize && <input placeholder="width" name="width" onChange={onChangeSize} type="number"/>}
          {setSize && <input placeholder="height" name="height" onChange={onChangeSize} type="number" />}
        </div>

        <div>
          {setPosition && <input placeholder="position_left" name="left" onChange={onChangePosition} type="number" />}
          {setPosition && <input placeholder="position_top" name="top" onChange={onChangePosition} type="number" />}
        </div>

        <div>
          {setPosition2 && <button onClick={() => setPosition2('left')}>left</button>}
          {setPosition2 && <button onClick={() => setPosition2('ver')}>ver</button>}
          {setPosition2 && <button onClick={() => setPosition2('right')}>right</button>}
          {setPosition2 && <button onClick={() => setPosition2('top')}>top</button>}
          {setPosition2 && <button onClick={() => setPosition2('hor')}>hor</button>}
          {setPosition2 && <button onClick={() => setPosition2('bottom')}>bottom</button>}
        </div>

      </div>
    );

  return <></>;
}

export default EditorTool;
