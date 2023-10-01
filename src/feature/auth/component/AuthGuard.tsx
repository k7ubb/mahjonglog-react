import { useAuthContext } from 'feature/auth/provider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode
};

export const AuthGuard = ({ children }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuthContext()
  
  if (user === null) {
    navigate("/app/");
    return null;
  }
  else if (user !== undefined) {
    return <>{children}</>;
  }
  else {
    return null;
  }
};

