import Dashboard from "@/app/components/Dashboard/Dashboard";
import { AuthProvider } from "@/app/components/Auth/AuthContext";
import { BackgroundProvider } from '@/app/Context/BackgroundContext';

export default function dashboardPage() {
    return (
        <BackgroundProvider>
            <AuthProvider>
                <Dashboard />
            </AuthProvider>
        </BackgroundProvider>
    )
}