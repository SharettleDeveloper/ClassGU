import Class from "../components/Class/Class";
import { AuthProvider } from "../components/Auth/AuthContext"; // AuthProviderをインポート

export default function ShowClass() {
  return (
    <AuthProvider> {/* AuthProviderでClassをラップ */}
      <Class />
    </AuthProvider>
  );
}
