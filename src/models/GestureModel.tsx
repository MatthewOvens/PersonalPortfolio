import { IndexState } from "../utils/GestureEnums";

export class GestureModel {

    currSIndex: IndexState = IndexState.Open;

    constructor() {
        console.log("In Gesture Model constructor")
    }

    /**
     * 
     * @param categoryName 
     * @param handedness Can be "Left" or "Right"
     * @param landmarks Coordinates of the landmarks of the hand
     * @param current_gesture Current recognized gesture
     */
    updateFSMStates(categoryName: string, handedness: string, landmarks: any, current_gesture: any) {
        // Each landmark is a point in the hand represented in the coordinates space
        switch (categoryName) {
            case "None":
                break;
            case "Pointing_Up":
                
            case "Open_Palm":
                console.log("Open_Palm")
                break;
            case "Closed_Fist":
                console.log("Closed_Fist")
                break;
            case "Victory":
                console.log("Victory")  
                break;
            case "Thumb_Up":
                console.log("Thumb_Up")
                break;
            case "Thumb_Down":
                console.log("Thumb_Down")
                break;
            case "ILoveYou":
                console.log("ILoveYou")
                break;
        }
    }

    getFingerPinch(landmarks: any) {
        // Distance between the index fingertip (8) and the thumb tip (4).
        const dx = landmarks[8].x - landmarks[4].x;
        const dy = landmarks[8].y - landmarks[4].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Hysteresis: once pinched, require a wider gap before releasing, so the
        // gesture doesn't rapidly toggle when the fingertips hover near the
        // threshold (which would drop the scroll drag mid-gesture).
        const threshold = this.currSIndex === IndexState.Closed ? 0.08 : 0.05;

        if (distance < threshold) {
            this.currSIndex = IndexState.Closed;
            return 'index';
        }

        this.currSIndex = IndexState.Open;
        return undefined;
    }
    
}