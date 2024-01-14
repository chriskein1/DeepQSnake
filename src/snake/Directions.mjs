// :):)):):):)

// Dictionary for directions based on array
export const directions = {
    "left": [-1, 0],
    "right": [1, 0],
    "up": [0, -1],
    "down": [0, 1]
}

// Functions to improve array comparison readability
export function arrayCompare(arr1, arr2) {
    if (arr1[0] === arr2[0] && arr1[1] === arr2[1]) {
        return true;
    }
}