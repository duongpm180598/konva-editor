import { create } from "zustand";

const useStore = create(set => ({
    // Width and height of the window
    width: window.innerWidth,
    height: window.innerHeight,
    setSize: ({ width, height }) => set({ width, height }),

    // Width and height of the image
    imageWidth: 100,
    imageHeight: 100,
    setImageSize: size => set(() => ({ imageWidth: size.width, imageHeight: size.height })),

    // Scale of the image
    scale: 1,
    setScale: scale => set({ scale }),

    // Flag indicating if the user is currently drawing a region
    isDrawing: false,
    toggleIsDrawing: () => set(state => ({ isDrawing: !state.isDrawing })),

    // Array of regions drawn on the image
    regions: [],
    setRegions: regions => set(state => ({ regions })),

    // ID of the currently selected region
    selectedRigionId: null,
    selectRegion: selectedRigionId => set({ selectedRigionId }),

    // Brightness level of the image
    brightness: 0,
    setBrightness: brightness => set({ brightness })
}));

export default useStore;
