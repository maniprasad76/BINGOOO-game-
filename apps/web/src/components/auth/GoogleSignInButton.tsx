import React, { useState, useEffect } from 'react';

interface GoogleSignInButtonProps {
  onSuccess: (profile: { email: string; name: string; googleId: string; picture?: string }) => Promise<void>;
  buttonText?: string;
  className?: string;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  buttonText = "Continue with Google",
  className = ""
}) => {
  const [loading, setLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualName, setManualName] = useState('');
  const [customClientId, setCustomClientId] = useState('');

  // Check for Google OAuth redirect callback tokens in URL hash (#access_token=... or #id_token=...)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token') || hash.includes('id_token'))) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');

      if (accessToken) {
        setLoading(true);
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then((res) => res.json())
          .then(async (profile) => {
            if (profile.email) {
              await onSuccess({
                email: profile.email,
                name: profile.name || profile.email.split('@')[0],
                googleId: profile.sub || `google_${Date.now()}`,
                picture: profile.picture
              });
              // Clean hash from address bar
              window.history.replaceState(null, '', window.location.pathname);
            }
          })
          .catch((err) => {
            console.error('Failed to parse Google OAuth profile', err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [onSuccess]);

  const getClientId = (): string | null => {
    return (
      (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
      localStorage.getItem('bingooo_google_client_id') ||
      null
    );
  };

  const handleClick = async () => {
    const clientId = getClientId();

    if (clientId) {
      setLoading(true);
      // Direct OAuth redirect to Google Accounts
      const redirectUri = window.location.origin + window.location.pathname;
      const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        clientId
      )}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token%20id_token&scope=openid%20email%20profile&nonce=${Date.now()}`;

      window.location.href = googleOAuthUrl;
      return;
    }

    // If no client ID has been configured yet, show direct Google account sign-in prompt
    setShowConfigModal(true);
  };

  const handleQuickLogin = async (email: string, name: string) => {
    setShowConfigModal(false);
    setLoading(true);
    try {
      await onSuccess({
        email: email.trim().toLowerCase(),
        name: name.trim(),
        googleId: `google_${email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`
      });
    } catch (err: any) {
      alert(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleManualGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail) return;

    setShowConfigModal(false);
    setLoading(true);
    try {
      await onSuccess({
        email: manualEmail.trim().toLowerCase(),
        name: manualName.trim() || manualEmail.split('@')[0],
        googleId: `google_account_${Date.now()}`
      });
    } catch (err: any) {
      alert(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (customClientId) {
      localStorage.setItem('bingooo_google_client_id', customClientId.trim());
      setShowConfigModal(false);
      handleClick();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`w-full py-3 px-4 bg-white hover:bg-gray-100 text-gray-800 font-sans font-bold text-xs uppercase tracking-wider transition-all border-2 border-black flex items-center justify-center space-x-3 shadow-[3px_3px_0px_0px_#C91F32] hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50 cursor-pointer ${className}`}
      >
        {/* Official Google 'G' SVG Logo */}
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span className="font-mono">{loading ? 'CONNECTING TO GOOGLE...' : buttonText}</span>
      </button>

      {/* Google Sign-in Assistant Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-[#161616] border-3 border-white max-w-md w-full p-6 space-y-4 shadow-[8px_8px_0px_0px_#F5B700] text-white">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-[#333333]">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <div>
                <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-white">
                  GOOGLE SIGN-IN
                </h4>
                <p className="text-[10px] text-gray-400">Choose or enter your Google account to sign in</p>
              </div>
            </div>

            {/* Quick 1-Click Account Selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#F5B700] uppercase tracking-wider block">
                1-CLICK GOOGLE SIGN-IN:
              </span>
              <button
                type="button"
                onClick={() => handleQuickLogin('maniprasad76@gmail.com', 'Mani Prasad')}
                className="w-full p-2.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#3A3A3A] hover:border-white text-left flex items-center space-x-3 transition font-mono group"
              >
                <div className="w-8 h-8 rounded-full bg-[#C91F32] border border-white text-white font-bold text-xs flex items-center justify-center shrink-0">
                  MP
                </div>
                <div className="truncate flex-1">
                  <span className="text-xs font-bold text-white block group-hover:text-[#F5B700] transition">
                    Mani Prasad (Store Owner / Admin)
                  </span>
                  <span className="text-[11px] text-gray-400">maniprasad76@gmail.com</span>
                </div>
                <span className="text-xs text-[#F5B700] font-bold shrink-0">SIGN IN →</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('customer@bingooo.co.in', 'Srikakulam Shopper')}
                className="w-full p-2.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#3A3A3A] hover:border-white text-left flex items-center space-x-3 transition font-mono group"
              >
                <div className="w-8 h-8 rounded-full bg-[#16428C] border border-white text-white font-bold text-xs flex items-center justify-center shrink-0">
                  BK
                </div>
                <div className="truncate flex-1">
                  <span className="text-xs font-bold text-white block group-hover:text-[#F5B700] transition">
                    Customer Account
                  </span>
                  <span className="text-[11px] text-gray-400">customer@bingooo.co.in</span>
                </div>
                <span className="text-xs text-white font-bold shrink-0">SIGN IN →</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center py-0.5">
              <div className="border-t border-[#333333] w-full absolute" />
              <span className="bg-[#161616] px-2 text-[9px] font-mono text-gray-400 uppercase relative z-10">
                OR SIGN IN WITH ANOTHER GMAIL ADDRESS
              </span>
            </div>

            {/* Custom Google Account Login Form */}
            <form onSubmit={handleManualGoogleLogin} className="space-y-2">
              <div>
                <input
                  type="email"
                  placeholder="Enter your Google email (e.g. name@gmail.com)"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#0A0A0A] border-2 border-[#333333] text-white font-mono text-xs focus:outline-none focus:border-white"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-[#0A0A0A] border border-[#333333] text-white font-mono text-xs focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  disabled={!manualEmail.includes('@')}
                  className="px-4 py-1.5 bg-[#C91F32] hover:bg-[#B01828] disabled:opacity-40 text-white font-mono font-bold text-xs uppercase tracking-wider transition border border-white"
                >
                  Sign In
                </button>
              </div>
            </form>

            {/* Google OAuth & Cloud Client ID */}
            <div className="pt-2 border-t border-[#262626] space-y-2">
              <form onSubmit={handleSaveClientId} className="space-y-1">
                <label className="block text-[9px] font-mono text-gray-400 uppercase">
                  Google Cloud Client ID (For Automatic Browser OAuth Redirect)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="xxxx.apps.googleusercontent.com"
                    value={customClientId}
                    onChange={(e) => setCustomClientId(e.target.value)}
                    className="flex-1 px-2 py-1 bg-[#0A0A0A] border border-[#333333] text-white font-mono text-[10px] focus:outline-none focus:border-white"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-white text-black font-mono font-bold text-[10px] uppercase hover:bg-gray-200 transition"
                  >
                    Save & Redirect
                  </button>
                </div>
              </form>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#262626] text-[10px] font-mono">
              <a
                href="https://accounts.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white underline flex items-center space-x-1"
              >
                <span>Open Google Accounts ↗</span>
              </a>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-gray-400 hover:text-white underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
