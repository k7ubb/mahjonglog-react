import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHandleAuth } from '../../usecase/useHandleAuth';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';

export const RegisterPage: React.FC = () => {
	const navigate = useNavigate();
	const { register } = useHandleAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordCheck, setPasswordCheck] = useState('');
	const [accountID, setAccountID] = useState('');
	const [accountName, setAccountName] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	return (
		<AppWindow title="新規登録" backTo="/app" loading={loading}>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					setLoading(true);
					try {
						await register({
							email,
							password,
							passwordCheck,
							accountID,
							accountName,
						});
						navigate('/app');
					} catch (e) {
						setError((e as Error).message);
					} finally {
						setLoading(false);
					}
				}}
			>
				<ListGroup title="メールアドレス">
					<ListItem>
						<input
							required
							type="email"
							placeholder="メールアドレス"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</ListItem>
				</ListGroup>

				<ListGroup title="パスワード">
					<ListItem>
						<input
							required
							type="password"
							placeholder="パスワード"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</ListItem>
					<ListItem>
						<input
							required
							type="password"
							placeholder="パスワード (確認)"
							value={passwordCheck}
							onChange={(e) => setPasswordCheck(e.target.value)}
						/>
					</ListItem>
				</ListGroup>

				<ListGroup title="アカウント設定">
					<ListItem>
						<input
							required
							type="text"
							pattern="^[a-zA-Z0-9\-_]+$"
							placeholder="アカウントID (半角英数のみ)"
							value={accountID}
							onChange={(e) => setAccountID(e.target.value)}
						/>
					</ListItem>
					<ListItem>
						<input
							required
							type="text"
							placeholder="アカウント名"
							value={accountName}
							onChange={(e) => setAccountName(e.target.value)}
						/>
					</ListItem>
				</ListGroup>

				<ListGroup {...(error && { error })}>
					<ListItem>
						<button type="submit" disabled={loading}>
							アカウント登録
						</button>
					</ListItem>
				</ListGroup>
			</form>
		</AppWindow>
	);
};
