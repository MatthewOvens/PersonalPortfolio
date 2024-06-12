import { DrawingUtils, FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import { GestureModel } from "../models/GestureModel";
import { useEffect } from "react";

export interface Coordinates {
    x: number;
    y: number;
}

interface GestureComponentProps {
    video: HTMLVideoElement | null
}

const GestureComponent = (props: GestureComponentProps) => {
    // Define a sensitivity value to control effect change speed
    var video = props.video;
    var gestureRecognizer: GestureRecognizer | null = null;

    var canvasElement: any | null = null;
    var canvasCtx: any | null = null;
    var results: any = undefined;
    const videoHeight = "100vh";
    const videoWidth = "100vw";
    
    const model: GestureModel = new GestureModel();

    // var lastVideoTime: any = -1;

    // Excecuted every time the video change
    useEffect(() => {
        console.log("GestureComponent")
        console.log(video)
        if (video && gestureRecognizer == null) {
            createGestureRecognizer().then(() => {
                video?.addEventListener("loadeddata", predictWebcam);
                requestAnimationFrame(() => {
                    predictWebcam();
                });
            });
        }
    }, [video]);

    /**
     * Function to create the gestureRecognizer and initialization of the regions (used to create loops in the music flow)
     */
    const createGestureRecognizer = async () => {
        let recognizer = await loadModelWithRetry();
        if (recognizer) {
            gestureRecognizer = recognizer;
        }

        if (!gestureRecognizer) {
            console.error("Model loading failed after all retry attempts.");
            // Handle the failure case here
        }

    }

    async function loadModelWithRetry() {
        let maxRetries = 3; // Maximum number of retry attempts
        let currentRetry = 0;
        let recognizer;

        while (currentRetry < maxRetries) {
            try {
                const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm");
                recognizer = await GestureRecognizer.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"
                    },
                    numHands: 1,
                    runningMode: "VIDEO"
                });
                break; // If loading is successful, exit the loop
            } catch (error) {
                console.error("An error occurred on attempt #" + (currentRetry + 1) + ":", error);

                // Calculate and log the percentage of completion
                const percentage = ((currentRetry + 1) / maxRetries) * 100;
                console.log("Loading progress: " + percentage.toFixed(2) + "%");

                currentRetry++;

                if (currentRetry < maxRetries) {
                    // You can add a delay before the next retry if needed
                    // await new Promise(resolve => setTimeout(resolve, retryDelayMilliseconds));
                } else {
                    console.error("Maximum retry attempts reached. Model loading failed.");
                    break; // Exit the loop if max retries are reached
                }
            }
        }

        return recognizer; // Return the loaded recognizer or null if all retries failed
    }


    /**
     * Function to predict gestures from the webcam feed
     */
    const predictWebcam = () => {
        // Start detecting the stream
        console.log("Predicting webcam");
        if (gestureRecognizer) {
            setupCanvas();
            if (video && video.videoHeight > 0 && video.videoWidth > 0) {
                try {
                    results = gestureRecognizer.recognizeForVideo(video, Date.now());
                } catch (error) {
                    console.error(error);
                }
            }
            drawHands();
            performAction();
            requestAnimationFrame(() => {
                predictWebcam();
            });
            // window.requestAnimationFrame(predictWebcam.bind(this));
        }
    }

    const setupCanvas = () => {
        if (canvasCtx == undefined) {
            canvasElement = document.getElementById("output_canvas") as HTMLCanvasElement;
            canvasCtx = canvasElement.getContext("2d");
            canvasElement.style.height = videoHeight;
            canvasElement.style.width = videoWidth;
        }

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }

    /**
     * Function to render the user's hands skeleton
     */
    const drawHands = () => {
        const drawingUtils = new DrawingUtils(canvasCtx);
        if (results && results.landmarks) {
            console.log("Drawing hands");
            for (const landmarks of results.landmarks) {
                drawingUtils.drawConnectors(
                    landmarks,
                    GestureRecognizer.HAND_CONNECTIONS,
                    {
                        color: "#FFFFFF",
                        lineWidth: 5
                    }
                );
                drawingUtils.drawLandmarks(landmarks, {
                    color: "#B01EB0",
                    lineWidth: 10
                });
            }
        }
        canvasCtx.restore();
    }

    /**
     * Function from which all the handles are called
     */
    const performAction = () => {
        if (results && results.gestures.length == 0) {
            //let current_gesture = document.getElementById('current_gesture') as HTMLOutputElement;
            //current_gesture.innerText = "🙌";
        }

        if (results && results.gestures.length > 0) {
            for (let i = 0; i < results.gestures.length; i++) {
                const categoryName = results.gestures[i][0].categoryName;
                const handedness = results.handednesses[i][0].displayName;

                detectAction(categoryName, handedness, results.landmarks[i]);
                handleDrums(handedness, results.landmarks[i]);
                handlePlayPause();
            }
        }
    }

    /**
     * Function to detect the specific action returned by the model
     */
    const detectAction = (categoryName: string, handedness: string, landmarks: any) => {
        //let current_gesture = document.getElementById('current_gesture') as HTMLOutputElement;
        model.updateFSMStates(categoryName, handedness, landmarks, "current_gesture"); // To put proper gesture
    }

    /**
     * Function to handle "drums" effects. Mapped to each finger (through the relative landmark)
     */
    const handleDrums = (handedness: string, landmarks: any) => {
        //DRUMS detect and managing
        if (handedness == "Right") {
            // Managing of the click over the coordinates where the gesture has been taken
            // For example with the following I get the x coordinate of the 8th landmark
            // landmarks[8].x

            // Would be nice to be able to scroll with the pinch, hold while the thumb and index are close

            // let current_gesture = document.getElementById('current_gesture') as HTMLOutputElement;
            // current_gesture.innerText = "🥁 ✅";
        }
    }

    /**
     * Function to handle play/pause based on detected gestures (Closed_Fist)
     */
    const handlePlayPause = () => {
        // Something to do with the first gesture

        //Maybe take the click event in the moment with the other hand make the fist
    }

    return (
        <>
            <div>
                <canvas className="output_canvas" id="output_canvas" width="1920" height="1080" />
            </div>
        </>
    );

}

export default GestureComponent;