import { IndexState } from "../utils/GestureEnums";
import { closedPoints } from "../utils/helpers";

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
        
        if (closedPoints(landmarks[8], landmarks[4], 0.05)) {
            this.currSIndex = IndexState.Closed;
            return 'index';
        } else {
            this.currSIndex = IndexState.Open;
        }

        //Middle finger action
        if (closedPoints(landmarks[12], landmarks[4], 0.05)) {
            
        } else {
            
        }

        //Ring finger action
        if (closedPoints(landmarks[16], landmarks[4], 0.05)) {
            
        } else {
            
        }

        //Pinky Finger action
        if (closedPoints(landmarks[20], landmarks[4], 0.05)) {
            
        } else {
            
        }
        return undefined;
    }
    
}