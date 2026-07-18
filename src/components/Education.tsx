import './Education.css';

// Placeholder entries — swap in the real education history.
const educationData = [
  {
    period: '2021 — 2024',
    title: "Master's Degree",
    school: 'University name — City, Country',
    detail: 'Short description of the programme: focus areas, thesis topic, notable coursework.',
  },
  {
    period: '2018 — 2021',
    title: "Bachelor's Degree",
    school: 'University name — City, Country',
    detail: 'Short description of the programme: focus areas, projects, notable coursework.',
  },
];

const Education = () => {
  return (
    <div className='educationSection'>
      <div className='description'>
        <span className='section-eyebrow'>Background</span>
        <h2 className='section-title'>Education</h2>
      </div>
      <div className='timeline'>
        {educationData.map((entry) => (
          <div key={entry.title} className='timelineItem'>
            <span className='timelineDot' />
            <span className='timelinePeriod'>{entry.period}</span>
            <h4 className='timelineTitle'>{entry.title}</h4>
            <div className='timelineSchool'>{entry.school}</div>
            <p className='timelineDetail'>{entry.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
