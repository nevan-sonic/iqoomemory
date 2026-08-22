import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#08090C',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#12141C',
            border: '1px solid rgba(255, 222, 0, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '360px',
            width: '100%'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#FFDE00',
              color: '#08090C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '18px',
              margin: '0 auto 16px auto'
            }}>
              !
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
              App Reload Required
            </h2>
            <p style={{ fontSize: '12px', color: '#8F92A1', marginBottom: '20px', lineHeight: '1.4' }}>
              A temporary local storage conflict occurred. Click below to refresh memory.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#FFDE00',
                color: '#08090C',
                border: 'none',
                borderRadius: '9999px',
                padding: '10px 20px',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer',
                width: '100%',
                textTransform: 'uppercase'
              }}
            >
              Reset & Reload Memory
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
