import Projects from './components/Projects';
import Contacts from './components/Contacts';
import Introduction from './components/Introduction';
import NavBar from './components/NavBar';
import Education from './components/Education';
import Footer from './components/Footer';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import GestureComponent from './components/GestureComponents';
import { useEffect, useState } from 'react';
import { hasGetUserMedia } from './utils/helpers';

const App = () => {

  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (hasGetUserMedia()) {
      enableCam();
    } else {
      console.log("getUserMedia() is not supported by your browser");
    }
  }, [video]);

  function enableCam() {
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      setVideo(document.getElementById("webcam") as HTMLVideoElement);
      if (video != null) {
        video.srcObject = stream;
      }
    }).catch((error) => {
      console.error("Error accessing webcam:", error);
    });
  }

  return (
    <div>
      <div className='canvas'>
        <GestureComponent video={video} />
      </div>    
      <video id="webcam" autoPlay playsInline style={{ display: "none" }}></video> 
      <div className='mynavbar'>
        <NavBar/>
      </div>
      <div className='introduction' id='home'>
        <Introduction />
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
