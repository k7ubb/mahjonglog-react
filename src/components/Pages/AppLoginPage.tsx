import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHandleAuth } from '../../usecase/useHandleAuth';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';

export const AppLoginPage: React.FC = () => {
	const navigate = useNavigate();
	const { login } = useHandleAuth();
	const [emailOrAccountId, setEmailOrAccountId] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	return (
		<AppWindow title="ログイン" backTo="/app" loading={loading}>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					setLoading(true);
					try {
						await login({
							emailOrAccountId,
							password,
						});
						navigate('/app');
					} catch (e) {
						setError((e as Error).message);
					} finally {
						setLoading(false);
					}
				}}
			>
				<ListGroup>
					<ListItem>
						<input
							required
							type="text"
							pattern="^[a-zA-Z0-9\-_@\.]+$"
							placeholder="アカウントID / メールアドレス"
							value={emailOrAccountId}
							onChange={(e) => setEmailOrAccountId(e.target.value)}
						/>
					</ListItem>
					<ListItem>
						<input
							required
							type="password"
							placeholder="パスワード"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</ListItem>
				</ListGroup>

				<ListGroup {...(error && { error })}>
					<ListItem>
						<button type="submit" disabled={loading}>
							ログイン
						</button>
					</ListItem>
				</ListGroup>
			</form>
		</AppWindow>
	);
};
