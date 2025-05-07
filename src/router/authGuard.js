import { useAuthStore } from 'src/pages/auth/store'; // Corrigido o caminho relativo
import { getLocalToken } from 'src/pages/auth/store/storage';

const authGuard = async (to, from, next) => {
  const auth = useAuthStore();

  const pageTitle = to.meta.title ? `${to.meta.title} - EduMaster` : 'EduMaster';
  document.title = pageTitle;

  if (to.name !== 'login' && !auth.isAuthenticated) {
    try {
      await auth.ActionCheckToken();
      next({ path: to.path });
    } catch (err) {
      next({ name: 'login' });
    }
  } else {
    if (to.name === 'login' && auth.isAuthenticated) {
      next({ name: 'home' });
    } else {
      next();
    }
  }
};


export default authGuard;
