import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [userIdFocus, setUserIdFocus] = useState(false);
  const [accessKeyFocus, setAccessKeyFocus] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const emailLower = email.toLowerCase();
    
    // Simple mock routing logic
    if (emailLower.startsWith('admin')) {
      localStorage.setItem('mockRole', 'super-admin');
      navigate('/admin');
    } else if (emailLower.startsWith('manager')) {
      localStorage.setItem('mockRole', 'manager');
      navigate('/manager');
    } else {
      localStorage.setItem('mockRole', 'employee');
      navigate('/employee');
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

              {/* Form */}
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

                <button className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 px-4 rounded hover:bg-primary-fixed transition-colors uppercase tracking-widest shadow-[0_0_10px_rgba(203,166,247,0.3)] hover:shadow-[0_0_20px_rgba(203,166,247,0.5)]" type="submit">
                  INITIATE SESSION
                </button>
              </form>
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
