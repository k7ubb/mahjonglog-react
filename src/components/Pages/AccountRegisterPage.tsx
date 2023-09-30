import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from 'feature/auth/provider/AuthProvider';
import { firestoreSet } from 'lib/firebase/firestore';

export const AccountRegisterPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const uid = user?.uid;
  
  const registerUser = async () => {
    if (uid && location.state.accountID) {
      await firestoreSet("account", uid, {
        email: location.state.email,
        accountID: location.state.accountID,
        accountName: location.state.accountName
      });
      navigate("/app");
    }
  };
  registerUser();

  return null;
};
