import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState({ loading: false, error: '' });

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    if (state.error) setState((previous) => ({ ...previous, error: '' }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, error: '' });

    try {
      await login(form.email.trim(), form.password);
      navigate('/admin', { replace: true });
    } catch (error) {
      setState({
        loading: false,
        error: getErrorMessage(error, 'Login failed.'),
      });
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#0b0908] px-5 text-stone-100">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#15110e] p-8 shadow-2xl">
        <div className="mb-8 flex items-center gap-4">
          <img
            className="h-14 w-14 rounded-full object-cover"
            src="/assets/lily-logo.jpg"
            alt="Lily"
          />
          <div>
            <h1 className="font-serif text-3xl">Lily Admin</h1>
            <p className="text-sm text-stone-500">Management console</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={submit}>
          <label className="block">
            <span className="mb-2 block text-sm text-stone-300">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-[#d9ad5f]"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-stone-300">Password</span>
            <span className="relative block">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 pr-12 outline-none transition focus:border-[#d9ad5f]"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-stone-500 transition hover:bg-white/5 hover:text-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d9ad5f]/40"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>

          {state.error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              {state.error}
            </p>
          )}

          <button
            disabled={state.loading}
            className="w-full rounded-xl bg-[#d9ad5f] px-4 py-3 font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
