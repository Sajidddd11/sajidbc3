import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, ArrowLeft, LogOut, MessageCircle, ExternalLink, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { userApi, telegramApi } from '../utils/api';

interface Profile {
  name: string;
  email: string;
  phone: string;
  username: string;
  profile_picture: string;
}

interface TelegramStatus {
  linked: boolean;
  linkInfo?: {
    chatId: string;
    linkedAt: string;
  };
}

export function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Profile | null>(null);
  const [stats, setStats] = useState({
    totalTodos: 0,
    completedTodos: 0,
    efficiency: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Telegram integration states
  const [telegramStatus, setTelegramStatus] = useState<TelegramStatus | null>(null);
  const [telegramToken, setTelegramToken] = useState('');
  const [isLinkingTelegram, setIsLinkingTelegram] = useState(false);
  const [isUnlinkingTelegram, setIsUnlinkingTelegram] = useState(false);
  const [telegramStatusLoading, setTelegramStatusLoading] = useState(false);

  useEffect(() => {
    fetchUserDetails();
    fetchTelegramStatus();
  }, []);

  async function fetchUserDetails() {
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        navigate('/login');
        return;
      }

      setIsLoading(true);
      const data = await userApi.getProfile();
      
      if (data.user) {
        setProfile(data.user);
        setEditForm({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          username: data.user.username || '',
          profile_picture: data.user.profile_picture || ''
        });

        // Set statistics if available
        if (data.statistics) {
          setStats({
            totalTodos: data.statistics.totalTodos || 0,
            completedTodos: data.statistics.completedTodos || 0,
            efficiency: data.statistics.efficiency || 0
          });
        }
      }
    } catch (error) {
      toast.error('Failed to fetch user details');
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchTelegramStatus() {
    try {
      setTelegramStatusLoading(true);
      const response = await telegramApi.getStatus();
      if (response.success) {
        setTelegramStatus({
          linked: response.linked,
          linkInfo: response.linkInfo
        });
      }
    } catch (error) {
      console.error('Failed to fetch Telegram status:', error);
      setTelegramStatus({ linked: false });
    } finally {
      setTelegramStatusLoading(false);
    }
  }

  async function handleUpdateProfile() {
    try {
      if (!editForm) return;

      setIsLoading(true);
      await userApi.updateProfile({
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        profile_picture: editForm.profile_picture
      });
      
      toast.success('Profile updated successfully');
      fetchUserDetails();
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLinkTelegram() {
    if (!telegramToken || telegramToken.length !== 6 || !/^\d+$/.test(telegramToken)) {
      toast.error('Please enter a valid 6-digit token');
      return;
    }

    try {
      setIsLinkingTelegram(true);
      const response = await telegramApi.linkAccount(telegramToken);
      if (response.success) {
        toast.success('Telegram account linked successfully');
        fetchTelegramStatus();
        setTelegramToken('');
      }
    } catch (error) {
      toast.error('Failed to link Telegram account. Please check your token and try again.');
    } finally {
      setIsLinkingTelegram(false);
    }
  }

  async function handleUnlinkTelegram() {
    try {
      setIsUnlinkingTelegram(true);
      const response = await telegramApi.unlinkAccount();
      if (response.message) {
        toast.success('Telegram account unlinked successfully');
        fetchTelegramStatus();
      }
    } catch (error) {
      toast.error('Failed to unlink Telegram account');
    } finally {
      setIsUnlinkingTelegram(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    navigate('/');
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row sm:justify-between gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm sm:text-base"
            >
              <Edit2 className="w-4 h-4" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm?.name}
                  onChange={(e) => setEditForm({ ...editForm!, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm?.email}
                  onChange={(e) => setEditForm({ ...editForm!, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editForm?.phone}
                  onChange={(e) => setEditForm({ ...editForm!, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                <input
                  type="text"
                  value={editForm?.profile_picture}
                  onChange={(e) => setEditForm({ ...editForm!, profile_picture: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleUpdateProfile}
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  {profile.profile_picture ? (
                    <img
                      src={profile.profile_picture}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl text-gray-400">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Name</label>
                  <p className="text-lg">{profile.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Username</label>
                  <p className="text-lg">{profile.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg">{profile.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-lg">{profile.phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Telegram Integration Section */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
          <div className="flex items-center mb-4 sm:mb-6">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Telegram Integration</h2>
          </div>
          
          {telegramStatusLoading ? (
            <div className="flex justify-center py-6">
              <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : telegramStatus?.linked ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <Check className="w-5 h-5" />
                Your account is linked to Telegram
              </div>
              
              {telegramStatus.linkInfo && (
                <div className="text-sm text-gray-600">
                  <p>Linked on: {new Date(telegramStatus.linkInfo.linkedAt).toLocaleString()}</p>
                </div>
              )}
              
              <button
                onClick={handleUnlinkTelegram}
                disabled={isUnlinkingTelegram}
                className="mt-4 w-full sm:w-auto py-2 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isUnlinkingTelegram ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Unlinking...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Unlink Telegram Account
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-yellow-600">
                <X className="w-5 h-5" />
                Your account is not linked to Telegram
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Link your account:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
                  <li>Open Telegram</li>
                  <li>Start a chat with our bot <a href="https://t.me/bctodobot" target="_blank" rel="noopener noreferrer" className="text-blue-600 inline-flex items-center gap-1">@bctodobot <ExternalLink className="w-3 h-3" /></a></li>
                  <li>Send the <span className="font-mono bg-gray-100 px-1 rounded">/start</span> command</li>
                  <li>Enter the received 6-digit code below</li>
                </ol>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={telegramToken}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setTelegramToken(value);
                    }}
                    placeholder="6-digit code"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleLinkTelegram}
                    disabled={isLinkingTelegram || telegramToken.length !== 6}
                    className="w-full sm:w-auto py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {isLinkingTelegram ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Linking...
                      </>
                    ) : (
                      'Link Account'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}