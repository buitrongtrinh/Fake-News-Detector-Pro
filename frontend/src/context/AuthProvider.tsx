import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);  // bắt đầu đang load

    // Giữ đăng nhập sau khi F5
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);  // khi Firebase trả kết quả, dừng loading
        });

        return () => unsubscribe();
    }, []);

    const login = (User: User) => setUser(User);
    const logout = () => {
        signOut(auth); // Firebase sign out
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthProvider;