import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { LoginProps } from 'store/User/types';

export const login = async (cfg: LoginProps) => {
    const userCredential = await signInWithEmailAndPassword(getAuth(), cfg.email, cfg.password);
    const { user } = userCredential;

    return { data: { id: user.uid, email: user.email, role: { name: 'admin' } } };
};

export const logout = async () => {
    await signOut(getAuth());
    return { data: null };
};

export const currentUser = async () => {
    return new Promise((resolve) => {
        onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                resolve({ data: { id: user.uid, email: user.email, role: { name: 'admin' } } });
            } else {
                resolve({ data: null });
            }
        });
    });
};
