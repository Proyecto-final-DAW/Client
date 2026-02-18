import { useLogin } from '../hooks/useLogin';

export const Login = (): React.JSX.Element => {
   const {
      email,
      setEmail,
      password,
      setPassword,
      error,
      loading,
      handleSubmit,
   } = useLogin();

   return (
      <div>
         <form onSubmit={handleSubmit}>
            <input
               type="email"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
               autoComplete="email"
            />
            <input
               type="password"
               placeholder="Password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
               autoComplete="current-password"
            />
            {error && <p role="alert">{error}</p>}
            <button type="submit" disabled={loading}>
               {loading ? 'Logging in...' : 'Login'}
            </button>
         </form>
      </div>
   );
};
