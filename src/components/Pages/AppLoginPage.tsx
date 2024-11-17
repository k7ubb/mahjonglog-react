import { useState } from 'react';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';

export const AppLoginPage: React.FC = () => {
	const [emailOrAccountId, setEmailOrAccountId] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [disabled, setDisabled] = useState(false);

	return (
		<>
			<AppWindow title="ログイン" backTo="/app">
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setDisabled(true);
						try {
							await new Promise((resolve) => setTimeout(resolve, 1000));
						} catch (e) {
							setError((e as Error).message);
						} finally {
							setDisabled(false);
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
							<button type="submit" disabled={disabled}>
								ログイン
							</button>
						</ListItem>
					</ListGroup>
				</form>
			</AppWindow>
		</>
	);
};
