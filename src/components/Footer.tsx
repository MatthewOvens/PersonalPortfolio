const Footer = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'min(1200px, 100% - 48px)',
          margin: '0 auto',
          padding: '22px 0',
          fontSize: '0.9rem',
        }}
      >
        <div>© {new Date().getFullYear()} Matteo Fornara</div>
        <div>Paris, France</div>
      </div>
    );
  };

  export default Footer;
