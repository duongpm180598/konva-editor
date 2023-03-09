import React, { useRef, useState } from 'react'
import KonvaEditorContext from './context/KonvaEditorContext'

const KonvaEditorProvider = ({ children }) => {

    const [state, setState] = useState({
        frameSize: 1200
    })

    return (
        <KonvaEditorContext.Provider value={{
            frameSize: state.frameSize
        }}>
            {children}
        </KonvaEditorContext.Provider>
    )

}

export default KonvaEditorProvider