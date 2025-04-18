import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Phone, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../utils/api';

export function Create() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [cpass, setCpass] = useState('');

  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  function validateEmail(email: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone: string) {
    const re = /^\d{11}$/;
    return re.test(phone);
  }

  function validatePassword(password: string) {
    // Minimum 8 characters
    return password.length >= 8;
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value) ? '' : 'Invalid email format');
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPhone(value);
    setPhoneError(validatePhone(value) ? '' : 'Phone number must be 11 digits');
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPass(value);
    setPasswordError(validatePassword(value) ? '' : 'Password must be at least 8 characters long');
  }

  function handleConfirmPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setCpass(value);
    setConfirmPasswordError(value === pass ? '' : 'Passwords do not match');
  }

  async function handleClick() {
    try {
      if (emailError || phoneError || passwordError || confirmPasswordError) {
        toast.error('Please fix the errors before submitting');
        return;
      }

      setIsLoading(true);
      const userData = {
        name: name,
        email: email,
        phone: phone,
        username: username,
        password: pass,
        profile_picture: ''
      };

      const data = await authApi.register(userData);
      toast.success(data.message || 'Registration successful');
      setName('');
      setEmail('');
      setPass('');
      setPhone('');
      setCpass('');
      setUsername('');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">Create an Account</h2>
          <p className="mt-2 text-center text-gray-600">Join us today</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4" />
                Full Name
              </div>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4" />
                Email
              </div>
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4" />
                Phone
              </div>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
            {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4" />
                Username
              </div>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4" />
                Password
              </div>
            </label>
            <input
              type="password"
              value={pass}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a password"
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4" />
                Confirm Password
              </div>
            </label>
            <input
              type="password"
              value={cpass}
              onChange={handleConfirmPasswordChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
            />
            {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
          </div>

          <button
            onClick={handleClick}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}