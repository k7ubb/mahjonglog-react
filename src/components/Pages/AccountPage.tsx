import { useEffect, useState } from 'react';
import { useHandleAuth } from '../../usecase/useHandleAuth';
import { useHandleUser } from '../../usecase/useHandleUser';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';

export const AccountPage: React.FC = () => {
	const { user, updateProfile } = useHandleUser();
	const { logout } = useHandleAuth();
	const [accountID, setAccountID] = useState('');
	const [accountName, setAccountName] = useState('');
	const [profEditLoading, setProfEditLoading] = useState(false);
	const [profEditError, setProfEditError] = useState('');
	const [logoutLoading, setLogoutLoading] = useState(false);

	useEffect(() => {
		setAccountID(user?.accountID || '');
		setAccountName(user?.accountName || '');
	}, [user]);

	return (
		<AppWindow
			title={user?.accountName || ''}
			backTo="/app"
			authOnly={true}
			loading={profEditLoading || logoutLoading}
		>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					setProfEditLoading(true);
					try {
						await updateProfile(accountID, accountName);
					} catch (e) {
						setProfEditError((e as Error).message);
					} finally {
						setProfEditLoading(false);
					}
				}}
			>
				<ListGroup title="アカウント名">
					<ListItem>
						<input
							required
							type="text"
							placeholder="アカウント名を設定"
							value={accountName}
							onChange={(e) => setAccountName(e.target.value)}
						/>
					</ListItem>
				</ListGroup>

				<ListGroup
					title="アカウントID"
					description="ログイン時に使用します。必要に応じて、変更後のアカウントIDをメンバーに共有してください。"
				>
					<ListItem>
						<input
							required
							type="text"
							pattern="^[a-zA-Z0-9\-_]+$"
							placeholder="アカウントIDを設定"
							value={accountID}
							onChange={(e) => setAccountID(e.target.value)}
						/>
					</ListItem>
				</ListGroup>

				<ListGroup {...(profEditError && { error: profEditError })}>
					<ListItem>
						<button type="submit" disabled={profEditLoading}>
							変更を保存
						</button>
					</ListItem>
				</ListGroup>
			</form>
			<div style={{ height: '64px' }} />
			<ListGroup>
				<ListItem
					onClick={async () => {
						setLogoutLoading(true);
						await logout();
						setLogoutLoading(false);
					}}
					disabled={logoutLoading}
				>
					ログアウト
				</ListItem>
			</ListGroup>
		</AppWindow>
	);
};
