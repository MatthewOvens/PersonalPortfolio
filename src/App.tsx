//import React from 'react';
import Projects from './components/Projects';
import Contacts from './components/Contacts';
import Introduction from './components/Introduction';
import NavBar from './components/NavBar';

const App = () => {
  return (
    <div>
      <NavBar />
      <Introduction />
      <Projects />
      <Contacts />
    </div>
  );
};

export default App;
