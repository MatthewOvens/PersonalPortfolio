import { CutState } from "../utils/GestureEnums";
import { closedPoints } from "../utils/helpers";

export class GestureModel {
    currSCut: CutState = CutState.Empty;

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
        //console.log("In updateFSMStates")
        //console.log(handedness)
        //console.log(landmarks)
        //console.log(current_gesture)
        //console.log(categoryName)
        switch (categoryName) {
            case "None":
                console.log("None")
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

    getCutText() {
        switch (this.currSCut) {
            case CutState.StartCuttingLeft:
                return "✌️ + 🤞 To Start Loop";
            case CutState.ClosedCutLeft:
                return "Left Cut ✅ → Complete Right Cut ✌️";
            case CutState.CuttedLeft:
                return "✌️ + 🤞 To Close Loop";
            case CutState.StartCuttingRight:
                return "✌️ + 🤞 To Close Loop";
            case CutState.CuttedCompleted:
                return "Loop created ✅ → ✌️ To Remove Loop";
        }
        return undefined;
    }

    getDrumSound(landmarks: any) {
        if (closedPoints(landmarks[8], landmarks[4], 0.05)) {
            
        } else {
            
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