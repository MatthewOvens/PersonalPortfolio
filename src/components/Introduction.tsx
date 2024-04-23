
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
          <h4 className='infiniteSlider'>Prova • Frontend developer • UX designer • Interactive Designer • Creative Innovator • Prova • Frontend developer • UX designer • Creative Innovator • Prova • Frontend developer • UX designer • Creative Innovator • Prova • Frontend developer • UX designer • Creative Innovator • Prova • Frontend developer • UX designerProva • Frontend developer • UX designer • Creative Innovator Prova • Frontend developer • UX designer • Creative Innovator Prova • Frontend developer • UX designer • Creative Innovator Prova • Frontend developer</h4>
        </div>  
      </div>
      <div className='handRecInfo'>
        <div className='textSuggestion'>
          <img src="src\assets\text1.svg" style={{marginRight:"-55px"}}/>
          <svg width="70" height="50" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Vector">
            <mask id="path-1-inside-1_1_45" fill="#FCFCFC">
            <path d="M12.0261 5.71754C11.9381 5.71754 11.8501 5.55849 11.7785 5.27879C11.564 4.45614 10.5461 2.53114 9.77026 1.47266C9.42912 1.01198 8.76337 0.139972 8.68083 0.0467383C8.55979 -0.0903699 8.5873 0.090613 8.73035 0.375798C8.81839 0.556781 9.00546 0.984559 9.14852 1.33007C9.29157 1.67558 9.57768 2.28435 9.79227 2.67373C10.2434 3.50735 11.0247 5.08135 11.0798 5.27879C11.1128 5.38848 11.0633 5.36105 10.7992 5.11974C10.0289 4.41227 8.82389 3.78705 6.62303 2.95343C3.88847 1.91141 2.36988 1.52751 1.46203 1.65365C0.950331 1.72494 0.0369765 1.99916 0.00396367 2.08691C-0.0125427 2.14175 0.0204701 2.14724 0.141517 2.11433C0.378109 2.04852 1.43452 2.08143 2.18281 2.17466C3.7069 2.37209 6.95316 3.38121 8.65883 4.18192C9.68222 4.65906 10.5901 5.27331 10.9147 5.70108L11.0578 5.88207L10.8597 5.9753C10.7551 6.02466 10.6671 6.09596 10.6671 6.13435C10.6671 6.17274 10.5626 6.23855 10.436 6.27694C10.304 6.30984 10.1499 6.37017 10.0894 6.40856C10.0289 6.44695 9.77026 6.55116 9.51166 6.6389C8.86791 6.86376 8.64782 6.96248 7.46486 7.54382C6.89814 7.81804 6.43046 8.07031 6.43046 8.09774C6.43046 8.15258 6.85412 8.09774 7.25578 7.98805C7.42084 7.93869 7.94355 7.71383 8.41123 7.48898C9.50615 6.96248 10.1279 6.70472 10.3205 6.70472C10.403 6.70472 10.6231 6.64439 10.8047 6.56761C10.9862 6.49631 11.2173 6.4305 11.3109 6.4305C11.5419 6.4305 12.0261 6.16177 12.0646 6.01918C12.1197 5.83271 12.1032 5.71754 12.0261 5.71754Z"/>
            </mask>
            <path className='arrow' d="M12.0261 5.71754C11.9381 5.71754 11.8501 5.55849 11.7785 5.27879C11.564 4.45614 10.5461 2.53114 9.77026 1.47266C9.42912 1.01198 8.76337 0.139972 8.68083 0.0467383C8.55979 -0.0903699 8.5873 0.090613 8.73035 0.375798C8.81839 0.556781 9.00546 0.984559 9.14852 1.33007C9.29157 1.67558 9.57768 2.28435 9.79227 2.67373C10.2434 3.50735 11.0247 5.08135 11.0798 5.27879C11.1128 5.38848 11.0633 5.36105 10.7992 5.11974C10.0289 4.41227 8.82389 3.78705 6.62303 2.95343C3.88847 1.91141 2.36988 1.52751 1.46203 1.65365C0.950331 1.72494 0.0369765 1.99916 0.00396367 2.08691C-0.0125427 2.14175 0.0204701 2.14724 0.141517 2.11433C0.378109 2.04852 1.43452 2.08143 2.18281 2.17466C3.7069 2.37209 6.95316 3.38121 8.65883 4.18192C9.68222 4.65906 10.5901 5.27331 10.9147 5.70108L11.0578 5.88207L10.8597 5.9753C10.7551 6.02466 10.6671 6.09596 10.6671 6.13435C10.6671 6.17274 10.5626 6.23855 10.436 6.27694C10.304 6.30984 10.1499 6.37017 10.0894 6.40856C10.0289 6.44695 9.77026 6.55116 9.51166 6.6389C8.86791 6.86376 8.64782 6.96248 7.46486 7.54382C6.89814 7.81804 6.43046 8.07031 6.43046 8.09774C6.43046 8.15258 6.85412 8.09774 7.25578 7.98805C7.42084 7.93869 7.94355 7.71383 8.41123 7.48898C9.50615 6.96248 10.1279 6.70472 10.3205 6.70472C10.403 6.70472 10.6231 6.64439 10.8047 6.56761C10.9862 6.49631 11.2173 6.4305 11.3109 6.4305C11.5419 6.4305 12.0261 6.16177 12.0646 6.01918C12.1197 5.83271 12.1032 5.71754 12.0261 5.71754Z" stroke="#FCFCFC" stroke-width="2" mask="url(#path-1-inside-1_1_45)"/>
            </g>
          </svg>
        </div>
        <button className='handRecButton'>
          <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30" fill='#000411'><path d="M880-759q0-51-35-86t-86-35v-60q75 0 128 53t53 128h-60ZM240-40q-83 0-141.5-58.5T40-240h60q0 58 41 99t99 41v60Zm162 0q-30 0-56-13.5T303-92L48-465l24-23q19-19 45-22t47 12l116 81v-383q0-17 11.5-28.5T320-840q17 0 28.5 11.5T360-800v537L212-367l157 229q5 8 14 13t19 5h278q33 0 56.5-23.5T760-200v-560q0-17 11.5-28.5T800-800q17 0 28.5 11.5T840-760v560q0 66-47 113T680-40H402Zm38-440v-400q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v400h-80Zm160 0v-360q0-17 11.5-28.5T640-880q17 0 28.5 11.5T680-840v360h-80ZM486-300Z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default Introduction;
