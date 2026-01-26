import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHandleAuth } from '../../usecase/useHandleAuth';
import { AppWindow, ListGroup, ListButtonItem, ListInputItem } from '../Templates';

export const RegisterPage = () => {
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
					<ListInputItem
						required
						type="email"
						placeholder="メールアドレス"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</ListGroup>

				<ListGroup title="パスワード">
					<ListInputItem
						required
						type="password"
						placeholder="パスワード"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<ListInputItem
						required
						type="password"
						placeholder="パスワード (確認)"
						value={passwordCheck}
						onChange={(e) => setPasswordCheck(e.target.value)}
					/>
				</ListGroup>

				<ListGroup title="アカウント設定">
					<ListInputItem
						required
						type="text"
						pattern="^[a-zA-Z0-9\-_]+$"
						placeholder="アカウントID (半角英数のみ)"
						value={accountID}
						onChange={(e) => setAccountID(e.target.value)}
					/>
					<ListInputItem
						required
						type="text"
						placeholder="アカウント名"
						value={accountName}
						onChange={(e) => setAccountName(e.target.value)}
					/>
				</ListGroup>

				<ListGroup {...(error && { error })}>
					<ListButtonItem type="submit" disabled={loading}>
						アカウント登録
					</ListButtonItem>
				</ListGroup>
			</form>
		</AppWindow>
	);
};
