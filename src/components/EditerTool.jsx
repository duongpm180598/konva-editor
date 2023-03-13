function EditorTool({
  type = "image",
  setToggleFlip,
  onDeleteLayer,
  setFullSize,
}) {
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
            <button onClick={setFullSize}>Full</button>
          </>
        )}

        {onDeleteLayer && <button onClick={onDeleteLayer}>delete</button>}
      </div>
    );

  return <></>;
}

export default EditorTool;
