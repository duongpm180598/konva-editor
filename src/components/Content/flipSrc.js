export function flipSrc(src) {
    // get the base64 string from the src url
    const base64String = src.split(',')[1];

    // convert the base64 string to a binary string
    const binaryString = atob(base64String);

    // convert the binary string to a Uint8Array
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }

    // create a Blob object from the Uint8Array
    const blob = new Blob([uint8Array], { type: 'image/jpeg' });

    // create a new FileReader object
    const reader = new FileReader();

    // read the Blob as a data URL
    reader.readAsDataURL(blob);

    // return a Promise that resolves with the flipped data URL
    return new Promise((resolve) => {
        reader.onloadend = () => {
            // create a new canvas element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // set the canvas dimensions to match the image dimensions
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;

                // flip the image horizontally
                ctx.translate(img.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(img, 0, 0);

                // get the flipped data URL from the canvas
                const flippedDataURL = canvas.toDataURL();

                // resolve the Promise with the flipped data URL
                resolve(flippedDataURL);
            };
            img.src = reader.result;
        };
    });
}