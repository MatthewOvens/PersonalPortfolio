//import React from 'react';
import Projects from './components/Projects';
import Contacts from './components/Contacts';
import Introduction from './components/Introduction';
import NavBar from './components/NavBar';
import Education from './components/Education';
import './App.css';

const App = () => {
  return (
    <div>
      <div className='navbar'>
        <NavBar/>
      </div>
      <div className='introduction'>
        <Introduction />
      </div>
      <div className='projects'>
        <Projects />
      </div>
      <div className='education'>
        <Education />
      </div> 
      <div className='contacts'>
        <Contacts />
      </div>      
    </div>
  );
};

export default App;
