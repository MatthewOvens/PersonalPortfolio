

// Check if webcam access is supported.
export function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/**
 * Function to check if two points are close enough in order to detect the finger tips touch
 */
export const closedPoints = (point1: any, point2: any, precision: number) => {
    var a = point1.x - point2.x;
    var b = point1.y - point2.y;
    var c = Math.sqrt(a * a + b * b);
    if (c < precision) {
        return true;
    }
    return false;
}