import { useState } from 'react'

function FlippableImage({
    src = 'https://cdn.luyenthinaq.edu.vn/wp-content/uploads/2022/06/z3465157044163_115fa3a7341473877b963ac1af175ea7-1-e1654276968675-982x491.jpg',
    alt
}) {
    const [flipped, setFlipped] = useState(false)

    const flipImage = () => {
        setFlipped(!flipped)
    }

    const transformStyle = flipped
        ? // ? { transform: 'scaleX(-1)' }
          // : { transform: 'scaleX(1)' }
          { transform: 'scaleY(-1)' }
        : { transform: 'scaleY(1)' }

    return (
        <img src={src} alt={alt} style={transformStyle} onClick={flipImage} />
    )
}

export default FlippableImage
