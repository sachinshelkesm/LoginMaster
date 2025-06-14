import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordFormData, User } from '../types';

const Dashboard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetForm, setResetForm] = useState<ResetPasswordFormData>({
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/');
      return;
    }
    setCurrentUser(JSON.parse(user));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    console.log("Handle reset password")
    e.preventDefault();
    
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    if (resetForm.newPassword.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters long', type: 'error' });
      return;
    }

    // In a real app, you would make an API call to update the password
    const updatedUser = { ...currentUser, password: resetForm.newPassword } as User;
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    
    setMessage({ text: 'Password updated successfully!', type: 'success' });
    setShowResetForm(false);
    setResetForm({ newPassword: '', confirmPassword: '' });
  };

  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Welcome, {currentUser.username}!</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
      
      <div style={styles.content}>
        <p>You have successfully logged in.</p>
        
        <button 
          onClick={() => setShowResetForm(!showResetForm)} 
          style={styles.resetButton}
        >
          {showResetForm ? 'Cancel' : 'Reset Password'}
        </button>
        
        {showResetForm && (
          <form onSubmit={handleResetPassword} style={styles.resetForm}>
            <h3>Reset Password</h3>
            {message && (
              <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>
                {message.text}
              </p>
            )}
            <div style={styles.formGroup}>
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={resetForm.newPassword}
                onChange={handleResetChange}
                required
                minLength={6}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm New Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={resetForm.confirmPassword}
                onChange={handleResetChange}
                required
                minLength={6}
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.submitButton}>
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
  },
  content: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  resetButton: {
    margin: '20px 0',
    padding: '10px 15px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  resetForm: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  submitButton: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Dashboard;
