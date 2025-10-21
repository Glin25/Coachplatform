import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function Probe() {
  const { user, profile, loading } = useAuth();
  return (
    <pre style={{ padding: 24, fontFamily: 'monospace' }}>
      Auth probe ✅{"\n"}
      loading: {String(loading)}{"\n"}
      user: {user ? 'JA' : 'NEE'}{"\n"}
      role: {profile?.role ?? '-'}
    </pre>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Probe />
      </AuthProvider>
    </BrowserRouter>
  );
}