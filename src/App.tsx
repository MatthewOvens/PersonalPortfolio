//import React from 'react';
import Projects from './components/Projects';
import Contacts from './components/Contacts';
import Introduction from './components/Introduction';
import NavBar from './components/NavBar';
import Education from './components/Education';
import './App.css';
import Footer from './components/Footer';

const App = () => {
  return (
    <div>
      <div className='navbar'>
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
