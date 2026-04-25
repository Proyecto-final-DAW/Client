import { useLogin } from '../hooks/useLogin';
import { LoginBackground } from './login-sections/LoginBackground';
import { LoginErrorAlert } from './login-sections/LoginErrorAlert';
import { AuthSwitchLink } from './shared/AuthSwitchLink';
import { AuthTitle } from './shared/AuthTitle';
import { EmailField } from './shared/EmailField';
import { FormCard } from './shared/FormCard';
import { Nav } from './shared/Nav';
import { PasswordField } from './shared/PasswordField';

export const Login = (): React.JSX.Element => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    displayError,
    loading,
    onSubmit,
  } = useLogin();

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-[#e4e4e7] overflow-hidden">
      <LoginBackground />
      <Nav backTo="/" />
      <main className="relative z-10 flex items-center justify-center px-4 sm:px-6 py-8 min-h-[calc(100vh-6rem)]">
        <div className="w-full max-w-sm">
          <AuthTitle topText="CONTINUA TU" highlightText="AVENTURA" />
          <FormCard onSubmit={onSubmit} title="LOGIN">
            <EmailField value={email} onChange={setEmail} />
            <PasswordField value={password} onChange={setPassword} />
            <LoginErrorAlert error={displayError} />
            <button
              type="submit"
              disabled={loading}
              className="w-full font-['Press_Start_2P'] text-[10px] sm:text-xs bg-green-500 hover:bg-green-400 disabled:bg-[#1e1e2e] disabled:text-[#52525b] text-[#0a0a0f] px-6 py-3.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 disabled:border-b-0 disabled:active:mt-0 shadow-[0_0_16px_rgba(34,197,94,0.35)] disabled:shadow-none"
            >
              {loading ? 'CARGANDO...' : '▶ ENTRAR'}
            </button>
          </FormCard>
          <AuthSwitchLink
            question="¿NUEVO EN EL REINO?"
            cta="REGISTRATE"
            to="/register"
          />
        </div>
      </main>
    </div>
  );
};
