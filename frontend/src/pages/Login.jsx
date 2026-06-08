import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, confirmSignIn } from 'aws-amplify/auth';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const [userIdFocus, setUserIdFocus] = useState(false);
  const [accessKeyFocus, setAccessKeyFocus] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNewPasswordRequired, setIsNewPasswordRequired] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordFocus, setNewPasswordFocus] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        navigate('/dashboard');
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD') {
        setIsNewPasswordRequired(true);
      } else {
        setError(`ERR: Additional step required: ${nextStep.signInStep}`);
      }
    } catch (err) {
      console.error('Error signing in:', err);
      setError(`ERR: ${err.message || 'Authentication failed.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { isSignedIn, nextStep } = await confirmSignIn({
        challengeResponse: newPassword
      });

      if (isSignedIn) {
        navigate('/dashboard');
      } else {
        setError(`ERR: Additional step required: ${nextStep.signInStep}`);
      }
    } catch (err) {
      console.error('Error confirming new password:', err);
      setError(`ERR: ${err.message || 'Password update failed.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-body text-on-surface min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="scanline"></div>

      {/* TopNavBar */}
      <header className="bg-surface w-full border-b border-outline-variant z-10 sticky top-0">
        <div className="flex justify-between items-center w-full px-margin-desktop py-4 max-w-container-max mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">terminal</span>
            <span className="font-headline-md text-headline-md font-bold text-primary tracking-tighter">AttendSecure</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop z-10">
        <div className="w-full max-w-md bg-surface-container border border-outline-variant rounded shadow-[0_0_15px_rgba(203,166,247,0.05)] overflow-hidden">
          {/* Card Header */}
          <div className="bg-surface-container-high px-6 py-4 border-b border-outline-variant flex items-center justify-between">
            <h1 className="font-headline-md text-headline-md text-primary">SECURE TERMINAL ACCESS</h1>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-error"></div>
              <div className="w-2 h-2 rounded-full bg-tertiary"></div>
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <p className="font-code-inline text-code-inline text-on-surface-variant">System ready. Awaiting authentication.</p>

              {error && (
                <div className="bg-error/10 border border-error text-error px-4 py-3 rounded font-code-inline text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  {error}
                </div>
              )}

              {/* Form */}
              {!isNewPasswordRequired ? (
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div className="space-y-2 relative group">
                    <label className="block font-label-md text-label-md text-on-surface uppercase" htmlFor="email">USER_ID</label>
                    <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 group-focus-within:border-primary transition-colors">
                      <span className="text-primary mr-2">&gt;</span>
                      <input
                        className="terminal-input bg-transparent border-none outline-none w-full text-on-surface font-code-inline text-code-inline focus:ring-0 p-0 placeholder-on-surface-variant/50"
                        id="email"
                        placeholder="admin@attendsecure.sys"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setUserIdFocus(true)}
                        onBlur={() => setUserIdFocus(false)}
                      />
                      <span className={`cursor w-2 h-4 bg-primary ml-1 ${userIdFocus ? 'inline-block animate-blink' : 'hidden'}`}></span>
                    </div>
                  </div>

                  <div className="space-y-2 relative group">
                    <label className="block font-label-md text-label-md text-on-surface uppercase" htmlFor="password">ACCESS_KEY</label>
                    <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 group-focus-within:border-primary transition-colors">
                      <span className="text-primary mr-2">&gt;</span>
                      <input
                        className="terminal-input bg-transparent border-none outline-none w-full text-on-surface font-code-inline text-code-inline focus:ring-0 p-0 placeholder-on-surface-variant/50"
                        id="password"
                        placeholder="••••••••••••"
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setAccessKeyFocus(true)}
                        onBlur={() => setAccessKeyFocus(false)}
                      />
                      <span className={`cursor w-2 h-4 bg-primary ml-1 ${accessKeyFocus ? 'inline-block animate-blink' : 'hidden'}`}></span>
                    </div>
                  </div>

                  <button 
                    className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 px-4 rounded hover:bg-primary-fixed transition-colors uppercase tracking-widest shadow-[0_0_10px_rgba(203,166,247,0.3)] hover:shadow-[0_0_20px_rgba(203,166,247,0.5)] flex items-center justify-center gap-2" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? <span className="material-symbols-outlined animate-spin text-[18px]">sync</span> : null}
                    INITIATE SESSION
                  </button>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={handleNewPasswordSubmit}>
                  <div className="bg-tertiary/10 border border-tertiary text-tertiary px-4 py-3 rounded font-code-inline text-sm flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[18px]">info</span>
                    Password change required for first-time login.
                  </div>
                  <div className="space-y-2 relative group">
                    <label className="block font-label-md text-label-md text-on-surface uppercase" htmlFor="newPassword">NEW_ACCESS_KEY</label>
                    <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 group-focus-within:border-primary transition-colors">
                      <span className="text-primary mr-2">&gt;</span>
                      <input
                        className="terminal-input bg-transparent border-none outline-none w-full text-on-surface font-code-inline text-code-inline focus:ring-0 p-0 placeholder-on-surface-variant/50"
                        id="newPassword"
                        placeholder="••••••••••••"
                        required
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={() => setNewPasswordFocus(true)}
                        onBlur={() => setNewPasswordFocus(false)}
                      />
                      <span className={`cursor w-2 h-4 bg-primary ml-1 ${newPasswordFocus ? 'inline-block animate-blink' : 'hidden'}`}></span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 font-code-inline">Must contain uppercase, number, and symbol.</p>
                  </div>
                  <button 
                    className="w-full bg-tertiary text-on-tertiary font-label-md text-label-md py-3 px-4 rounded hover:bg-tertiary-fixed transition-colors uppercase tracking-widest shadow-[0_0_10px_rgba(168,230,207,0.3)] hover:shadow-[0_0_20px_rgba(168,230,207,0.5)] flex items-center justify-center gap-2" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? <span className="material-symbols-outlined animate-spin text-[18px]">sync</span> : null}
                    UPDATE & PROCEED
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto w-full z-10">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-4 max-w-container-max mx-auto gap-4 md:gap-0">
          <div className="font-label-md text-label-md text-outline text-center md:text-left">
            © 2026 AttendSecure.
          </div>
        </div>
      </footer>
    </div>
  );
}
