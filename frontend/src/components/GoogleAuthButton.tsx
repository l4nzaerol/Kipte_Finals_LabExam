import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import useAuthStore from '../store/useAuthStore';

const GoogleAuthButton = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, user, error } = useAuthStore();

  // Navigate when user is set after Google login
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      console.error('No credential received from Google');
      return;
    }

    try {
      await loginWithGoogle(response.credential);
      // Navigation will happen via useEffect when user is set
    } catch (error: any) {
      console.error('Google login error:', error);
      // Error is already set in the store by loginWithGoogle
    }
  };

  const handleError = () => {
    console.error('Google login failed - user cancelled or error occurred');
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="filled_black"
        shape="pill"
        text="continue_with"
      />
      {error && (
        <p style={{ color: '#666666', marginTop: '0.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default GoogleAuthButton;

