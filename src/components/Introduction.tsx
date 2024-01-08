//import React from 'react';
import './Introduction.css';

const Introduction = () => {
  return (
    <div className='containerIntro'>
      <div className='personalImg'>
        <img src="https://avatars.githubusercontent.com/u/83605999?v=4" alt="profile" className="profilePicture"/>
      </div>
      <div className='presentation'>
        <h1>Nice to meet you!</h1>
        <h3>I'm Matteo, a</h3>
        <div className="infiniteSliderContainer second-color-background first-color">
          <h2 className='infiniteSlider'>Prova • Frontend developer • UX designer • Creative Innovator • Prova • Frontend developer • UX designer • Creative Innovator • Prova • Frontend developer • UX designer • Creative Innovator • Prova • Frontend developer • UX designer • Creative Innovator • Prova • Frontend developer • UX designerProva • Frontend developer • UX designer • Creative Innovator Prova • Frontend developer • UX designer • Creative Innovator Prova • Frontend developer • UX designer • Creative Innovator Prova • Frontend developer</h2>
        </div>  
      </div>
      <div className='handRecInfo'>
        <div className='textSuggestion'>
          <img src="src\assets\text1.svg" style={{marginRight:"-55px"}}/>
          <img src="src\assets\arrow3.svg" id='arrow' className='arrow'/>
        </div>
        <button className='handRecButton'>
          <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30" fill='#000411'><path d="M880-759q0-51-35-86t-86-35v-60q75 0 128 53t53 128h-60ZM240-40q-83 0-141.5-58.5T40-240h60q0 58 41 99t99 41v60Zm162 0q-30 0-56-13.5T303-92L48-465l24-23q19-19 45-22t47 12l116 81v-383q0-17 11.5-28.5T320-840q17 0 28.5 11.5T360-800v537L212-367l157 229q5 8 14 13t19 5h278q33 0 56.5-23.5T760-200v-560q0-17 11.5-28.5T800-800q17 0 28.5 11.5T840-760v560q0 66-47 113T680-40H402Zm38-440v-400q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v400h-80Zm160 0v-360q0-17 11.5-28.5T640-880q17 0 28.5 11.5T680-840v360h-80ZM486-300Z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default Introduction;

// 