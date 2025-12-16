import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import landingBg from '../assets/landingpage.jpg';

function ForgotPassword() {
  const navigate = useNavigate();

  // --- STATES ---
  const [email, setEmail] = useState('');
  
  // View State: 'CHOICE' | 'OTP_INPUT' | 'SUCCESS_TEMP' | 'SUCCESS_RESET'
  const [viewState, setViewState] = useState('CHOICE'); 
  
  // Data States
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [tempPassword, setTempPassword] = useState(''); // For Option 1
  
  // UI States
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- API HANDLERS ---

  // Option 1: Get Temporary Password
  const handleTempPassword = async () => {
    if(!email) { setError("Please enter your email first."); return; }
    setLoading(true); setError(''); setMessage('');

    try {
      const response = await fetch('http://localhost:8000/forgot-password/temp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        // Since we are mocking email, the backend might return the pass in the message or console
        // For this UI, we assume the user checks their email, but if your backend sends it in response:
        if (data.temporary_password) setTempPassword(data.temporary_password); 
        setViewState('SUCCESS_TEMP');
      } else {
        setError(data.detail || 'Failed to generate password.');
      }
    } catch (err) {
      setError('Server error. Ensure backend is running.');
    }
    setLoading(false);
  };

  // Option 2 (Step A): Send OTP Code
  const handleSendOTP = async () => {
    if(!email) { setError("Please enter your email first."); return; }
    setLoading(true); setError(''); setMessage('');

    try {
      const response = await fetch('http://localhost:8000/forgot-password/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setViewState('OTP_INPUT');
        setMessage('Code sent! Check your email.');
      } else {
        setError(data.detail || 'Failed to send code.');
      }
    } catch (err) {
      setError('Server error. Ensure backend is running.');
    }
    setLoading(false);
  };

  // Option 2 (Step B): Verify OTP & Reset
  const handleVerifyReset = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');

    try {
      const response = await fetch('http://localhost:8000/reset-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, new_password: newPassword }),
      });
      const data = await response.json();

      if (response.ok) {
        setViewState('SUCCESS_RESET');
      } else {
        setError(data.detail || 'Invalid Code or Expired.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };


  // --- STYLES (PRESERVED) ---
  const pageContainerStyle = {
    backgroundImage: `url(${landingBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.75)', 
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Inter', sans-serif",
  };

  const loginBoxStyle = {
    width: '100%',
    maxWidth: '450px',
    padding: '40px',
    backgroundColor: 'rgba(30, 30, 30, 0.6)', 
    backdropFilter: 'blur(15px)', 
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
    color: 'white'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '30px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    background: 'linear-gradient(to right, #00c6ff, #9646ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 0 10px rgba(0, 198, 255, 0.3))',
  };

  const getInputStyle = (fieldName) => ({
    padding: '15px',
    fontSize: '16px',
    borderRadius: '10px',
    border: focusedInput === fieldName ? '2px solid #00c6ff' : '2px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: focusedInput === fieldName ? '0 0 15px rgba(0, 198, 255, 0.5)' : 'none',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '15px' 
  });

  // Pink/Purple Gradient (Primary)
  const buttonStyle = {
    padding: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    backgroundImage: 'linear-gradient(to right, #00c6ff 0%, #ff0099 100%)',
    boxShadow: '0 10px 20px -10px rgba(255, 0, 153, 0.5)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    marginTop: '10px',
    width: '100%'
  };

  // Blue Gradient (Secondary - New for distinction)
  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    boxShadow: '0 10px 20px -10px rgba(0, 198, 255, 0.5)',
  };

  const linkStyle = {
    color: '#00c6ff', 
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease',
    marginTop: '20px',
    display: 'inline-block'
  };

  const successBoxStyle = {
    backgroundColor: 'rgba(0, 255, 127, 0.1)',
    border: '1px solid #00ff7f',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    marginTop: '10px'
  };

  const tempPassStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    color: '#00c6ff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '10px',
    borderRadius: '5px',
    margin: '15px 0',
    display: 'inline-block',
    border: '1px dashed #00c6ff'
  };

  const dividerStyle = {
    margin: '15px 0',
    color: '#aaa',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  const addHover = (e) => { 
    e.currentTarget.style.transform = 'translateY(-3px)'; 
    e.currentTarget.style.boxShadow = '0 15px 30px -10px rgba(255, 0, 153, 0.7)'; 
  }
  const removeHover = (e) => { 
    e.currentTarget.style.transform = 'translateY(0)'; 
    e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(255, 0, 153, 0.5)'; 
  }

  // --- RENDER ---
  return (
    <div style={pageContainerStyle}>
      <div style={loginBoxStyle}>
        <h2 style={titleStyle}>Reset Password</h2>
        
        {/* === VIEW 1: ENTER EMAIL & CHOOSE OPTION === */}
        {viewState === 'CHOICE' && (
          <>
            <p style={{ color: '#ccc', marginBottom: '25px', lineHeight: '1.5' }}>
              Enter your registered email address.<br/>Choose how you want to recover access.
            </p>
            
            <input 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                style={getInputStyle('email')}
            />

            <button 
                onClick={handleSendOTP}
                style={buttonStyle}
                onMouseOver={addHover} onMouseOut={removeHover}
                disabled={loading}
            >
                {loading ? 'PROCESSING...' : 'OPTION 1: RESET VIA OTP'}
            </button>

            <div style={dividerStyle}>— OR —</div>

            <button 
                onClick={handleTempPassword}
                style={secondaryButtonStyle}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)'; 
                    e.currentTarget.style.boxShadow = '0 15px 30px -10px rgba(0, 198, 255, 0.7)'; 
                }} 
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'; 
                    e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(0, 198, 255, 0.5)';
                }}
                disabled={loading}
            >
                {loading ? 'PROCESSING...' : 'OPTION 2: GET TEMP PASSWORD'}
            </button>
          </>
        )}

        {/* === VIEW 2: OTP VERIFICATION === */}
        {viewState === 'OTP_INPUT' && (
            <form onSubmit={handleVerifyReset}>
                <p style={{ color: '#00c6ff', marginBottom: '15px' }}>
                    Code sent to {email}
                </p>

                <input 
                    type="text" 
                    placeholder="Enter 8-digit OTP" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    onFocus={() => setFocusedInput('otp')}
                    onBlur={() => setFocusedInput(null)}
                    style={getInputStyle('otp')}
                    required
                />
                
                <input 
                    type="password" 
                    placeholder="Enter New Password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    onFocus={() => setFocusedInput('newpass')}
                    onBlur={() => setFocusedInput(null)}
                    style={getInputStyle('newpass')}
                    required
                />

                <button 
                    type="submit" 
                    style={buttonStyle}
                    onMouseOver={addHover} onMouseOut={removeHover}
                    disabled={loading}
                >
                    {loading ? 'VERIFYING...' : 'CONFIRM CHANGE'}
                </button>
                
                <div style={{...linkStyle, cursor:'pointer', fontSize: '0.9rem'}} onClick={() => setViewState('CHOICE')}>
                    Cancel
                </div>
            </form>
        )}

        {/* === VIEW 3: SUCCESS (TEMP PASSWORD) === */}
        {viewState === 'SUCCESS_TEMP' && (
           <div style={successBoxStyle}>
             <h3 style={{ color: '#00ff7f', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Check Email!</h3>
             <p style={{ margin: 0, fontSize: '0.9rem', color: '#ddd' }}>
                 We sent a temporary password to your email.
             </p>
             {/* If backend returns it directly, we show it, otherwise we tell them to check email */}
             {tempPassword && (
                 <div style={tempPassStyle}>{tempPassword}</div>
             )}
             <button 
               onClick={() => navigate('/login')} 
               style={{ ...buttonStyle, backgroundImage: 'linear-gradient(to right, #11998e 0%, #38ef7d 100%)', boxShadow: 'none' }}
             >
               LOGIN NOW
             </button>
           </div>
        )}

        {/* === VIEW 4: SUCCESS (RESET COMPLETE) === */}
        {viewState === 'SUCCESS_RESET' && (
           <div style={successBoxStyle}>
             <h3 style={{ color: '#00ff7f', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Success!</h3>
             <p style={{ margin: '15px 0', fontSize: '1rem', color: '#ddd' }}>
                 Your password has been reset successfully.
             </p>
             <button 
               onClick={() => navigate('/login')} 
               style={{ ...buttonStyle, backgroundImage: 'linear-gradient(to right, #11998e 0%, #38ef7d 100%)', boxShadow: 'none' }}
             >
               LOGIN WITH NEW PASSWORD
             </button>
           </div>
        )}

        {/* === ERROR MESSAGE === */}
        {error && (
          <div style={{ marginTop: '20px', color: '#ff4d4d', backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: '10px', borderRadius: '5px', border: '1px solid #ff4d4d' }}>
            {error}
          </div>
        )}

        {/* === BACK TO LOGIN LINK (Only show if not in success state) === */}
        {!['SUCCESS_TEMP', 'SUCCESS_RESET'].includes(viewState) && (
          <div>
            <Link 
              to="/login" 
              style={linkStyle}
              onMouseOver={(e) => e.target.style.color = '#fff'} 
              onMouseOut={(e) => e.target.style.color = '#00c6ff'}
            >
              Back to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;