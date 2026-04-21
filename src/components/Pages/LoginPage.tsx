import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppWindow, ListGroup, ListButtonItem, ListInputItem } from '@/components/Templates';
import { useLoading } from '@/contexts/useLoading';
import { useAccount } from '@/usecase/useAccount';

export const LoginPage = () => {
	const navigate = useNavigate();
	const { login } = useAccount();
	const { loading, startLoading, endLoading } = useLoading();
	const [emailOrAccountID, setEmailOrAccountID] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	return (
		<AppWindow title='ログイン'>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					startLoading();
					login({
						emailOrAccountID,
						password,
					})
						.then(() => {
							navigate('/');
						})
						.catch((e) => {
							setError((e as Error).message);
						}).finally(() => {
							endLoading();
						});
				}}
			>
				<ListGroup>
					<ListInputItem
						required
						type='text'
						pattern='^[a-zA-Z0-9\-_@\.]+$'
						placeholder='アカウントID / メールアドレス'
						value={emailOrAccountID}
						onChange={(e) => setEmailOrAccountID(e.target.value)}
					/>
					<ListInputItem
						required
						type='password'
						placeholder='パスワード'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</ListGroup>

				<ListGroup {...(error && { error })}>
					<ListButtonItem type='submit' disabled={loading}>
						ログイン
					</ListButtonItem>
				</ListGroup>
			</form>
		</AppWindow>
	);
};
