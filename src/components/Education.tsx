import './Education.css';

const educationData = [
  {
    period: '2022 - 2024',
    title: 'MSc in Human Computer Interaction & Design (HCID)',
    school: 'EIT Digital Master School',
    details: [
      'Entry year: UPM - Madrid, Spain',
      'Exit year: UPS - Paris, France',
      'Summer school: “Digital Platform for Smart Cities” — Aalto University, Helsinki',
    ],
  },
  {
    period: 'Mar 2020 - Jun 2020',
    title: 'Postgraduate studies',
    school: 'Bit Academy - Turin, Italy',
    details: [],
  },
  {
    period: '2017 - 2020',
    title: 'Bachelor in Computer Science',
    school: 'Università Milano-Bicocca - Milan, Italy',
    details: [
      'Erasmus+ programme: 6 months at Universidad Rovira i Virgili, Tarragona',
    ],
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
            {entry.details.length > 0 && (
              <ul className='timelineDetails'>
                {entry.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
