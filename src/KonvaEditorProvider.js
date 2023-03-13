import React, { useRef, useState } from 'react'
import KonvaEditorContext from './context/KonvaEditorContext'

const KonvaEditorProvider = ({ children }) => {

    const [state, setState] = useState({
        frameSize: 960,
        currentLayer: null,
    })

    return (
        <KonvaEditorContext.Provider value={{
            frameSize: state.frameSize,
            currentLayer: state.currentLayer,
            setCurrentLayer: (currentLayer) => {
                setState({...state, currentLayer})
            }
        }}>
            {children}
        </KonvaEditorContext.Provider>
    )

}

export default KonvaEditorProvider