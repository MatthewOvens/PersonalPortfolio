import Projects from './components/Projects';
import Contacts from './components/Contacts';
import Introduction from './components/Introduction';
import NavBar from './components/NavBar';
import Education from './components/Education';
import Footer from './components/Footer';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <div>
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
