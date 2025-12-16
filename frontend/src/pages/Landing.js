import React from 'react';
import { useNavigate } from 'react-router-dom';
// IMPORT THE IMAGE: Ensure landingpage.jpg is in src/assets/
import landingBg from '../assets/landingpage.jpg';

function Landing() {
  const navigate = useNavigate();

  // --- STYLES ---

  // 1. Main Container
  const containerStyle = {
    backgroundImage: `url(${landingBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.7)', 
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'white',
    fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
    overflow: 'hidden'
  };

  // 2. Radiant Title Text
  const titleStyle = {
    fontSize: 'clamp(3rem, 8vw, 5rem)',
    fontWeight: '900',
    marginTop: '4vh',
    marginBottom: '4vh',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    background: 'linear-gradient(to right, #00c6ff, #9646ff, #ff0099)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    filter: 'drop-shadow(0 0 15px rgba(150, 70, 255, 0.5)) drop-shadow(0 0 30px rgba(0, 198, 255, 0.3))',
  };

  // 3. Split Layout Container
  const splitLayoutContainer = {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    maxWidth: '1200px',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '4rem',
    paddingBottom: '50px',
    flexWrap: 'wrap'
  };

  // 4. Left Side: Information Panel
  const leftInfoStyle = {
    flex: '1 1 400px',
    textAlign: 'left',
    padding: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  };

  const mainPointStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#ffffff',
    lineHeight: '1.2'
  };

  const subTextStyle = {
    fontSize: '1.2rem',
    color: '#d0d0d0',
    lineHeight: '1.6',
    maxWidth: '500px'
  };

  // 5. Right Side: Button Container
  const rightButtonStyle = {
    flex: '1 1 400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // --- UPDATED BUTTON STYLE: FIXED WIDTH & SQUARISH ---
  const buttonBaseStyle = {
    padding: '25px 20px',  
    fontSize: '24px',
    fontWeight: '800',
    cursor: 'pointer',
    color: 'white',
    border: 'none',
    
    // --- CHANGED FROM 60px TO 10px ---
    borderRadius: '20px',   // Squarish with minimal curve
    
    // --- FIXED WIDTH ---
    width: '400px',       // Forces exact same width for both
    maxWidth: '90vw',     // Responsive for mobile
    
    boxShadow: '0 10px 20px -10px rgba(0,0,0,0.5)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    display: 'flex',        
    justifyContent: 'center',
    alignItems: 'center'
  };

  // Vibrant Green/Blue Gradient for Corporations
  const donateBtnStyle = {
    ...buttonBaseStyle,
    backgroundImage: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
  };

  // Vibrant Blue/Purple Gradient for Schools
  const requestBtnStyle = {
    ...buttonBaseStyle,
    backgroundImage: 'linear-gradient(135deg, #3b26c5 0%, #8935e9 100%)',
  };

  const addHover = (e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.8)'; }
  const removeHover = (e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(0,0,0,0.5)'; }


  return (
    <div style={containerStyle}>
      
      {/* Top Radiant Title */}
      <h1 style={titleStyle}>TechWithTech</h1>

      {/* Split Content Area */}
      <div style={splitLayoutContainer}>
        
        {/* Left Side: Information */}
        <div style={leftInfoStyle}>
          <h2 style={mainPointStyle}>
            Connect Tech with <span style={{color: '#00c6ff'}}>Future Techies</span>
          </h2>
          <p style={subTextStyle}>
            We are the bridge connecting cutting-edge software companies directly with schools. We facilitate the donation of vital resources to empower the next generation of innovators.
          </p>
        </div>

        {/* Right Side: Buttons */}
        <div style={rightButtonStyle}>
          <button 
            onClick={() => navigate('/login')} 
            style={donateBtnStyle}
            onMouseOver={addHover} onMouseOut={removeHover}
          >
            Corporations: Donate
          </button>

          <button 
            onClick={() => navigate('/login')} 
            style={requestBtnStyle}
            onMouseOver={addHover} onMouseOut={removeHover}
          >
            Schools: Request
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;