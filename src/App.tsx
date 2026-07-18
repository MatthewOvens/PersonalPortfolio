import Projects from './components/Projects';
import Contacts from './components/Contacts';
import Introduction from './components/Introduction';
import NavBar from './components/NavBar';
import Education from './components/Education';
import Footer from './components/Footer';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import GestureComponent from './components/GestureComponents';
import { useRef, useState } from 'react';
import { hasGetUserMedia } from './utils/helpers';

const App = () => {

  // Hand navigation (and therefore the webcam) is off until the user opts in
  // by clicking the hand button in the Introduction section.
  const [handNavActive, setHandNavActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  async function enableHandNav() {
    if (!hasGetUserMedia()) {
      console.warn("getUserMedia() is not supported by your browser");
      return;
    }
    try {
      // Ask for a modest resolution/frame rate. Hand tracking doesn't need HD,
      // and a smaller source frame is far cheaper for MediaPipe to process —
      // which matters most on machines where the browser has no GPU
      // acceleration and the recognizer falls back to software. These are
      // "ideal" hints, so the browser still picks the closest supported mode.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
        },
      });
      streamRef.current = stream;
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.srcObject = stream;
        // A programmatically-set srcObject doesn't always autoplay; without
        // this the video stays paused and MediaPipe only ever sees a black
        // frame, so no hand landmarks are detected.
        await videoEl.play().catch((err) => console.error("Video play() failed:", err));
      }
      setHandNavActive(true);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  }

  function disableHandNav() {
    // Release the camera so the browser indicator turns off.
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHandNavActive(false);
  }

  function toggleHandNav() {
    if (handNavActive) {
      disableHandNav();
    } else {
      enableHandNav();
    }
  }

  return (
    <div>
      {handNavActive && (
        <div className='canvas'>
          <GestureComponent video={videoRef.current} />
        </div>
      )}
      <video ref={videoRef} id="webcam" autoPlay playsInline style={{ display: "none" }}></video>
      <div className='mynavbar'>
        <NavBar/>
      </div>
      <div className='introduction' id='home'>
        <Introduction handNavActive={handNavActive} onToggleHandNav={toggleHandNav} />
      </div>
      <div className='projects' id='projects'>
        <Projects />
      </div>
      <div className='education' id='education'>
        <Education />
      </div>
      <div className='contacts' id='contacts'>
        <Contacts />
      </div>
      <div className='footer'>
        <Footer />
      </div>
    </div>
  );
};

export default App;
