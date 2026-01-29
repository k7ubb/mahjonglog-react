import { useEffect, useState } from 'react';
import { AppWindow, ListGroup, ListButtonItem, ListInputItem } from '@/components/Templates';
import { useHandleAuth } from '@/usecase/useHandleAuth';
import { useHandleUser } from '@/usecase/useHandleUser';

export const AccountPage = () => {
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
			title="アカウント設定"
			backTo="/app"
			authOnly={true}
			loading={profEditLoading || logoutLoading}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					setProfEditLoading(true);
					updateProfile(accountID, accountName)
						.catch((e) => setProfEditError((e as Error).message))
						.finally(() => setProfEditLoading(false));
				}}
			>
				<ListGroup title="アカウント名">
					<ListInputItem
						required
						type="text"
						placeholder="アカウント名を設定"
						value={accountName}
						onChange={(e) => setAccountName(e.target.value)}
					/>
				</ListGroup>

				<ListGroup
					title="アカウントID"
					description="ログイン時に使用します。必要に応じて、変更後のアカウントIDをメンバーに共有してください。"
				>
					<ListInputItem
						required
						type="text"
						pattern="^[a-zA-Z0-9\-_]+$"
						placeholder="アカウントIDを設定"
						value={accountID}
						onChange={(e) => setAccountID(e.target.value)}
					/>
				</ListGroup>

				<ListGroup {...(profEditError && { error: profEditError })}>
					<ListButtonItem
						type="submit"
						disabled={profEditLoading}
					>
						変更を保存
					</ListButtonItem>
				</ListGroup>
			</form>
			<div className='h-16' />
			<ListGroup>
				<ListButtonItem
					onClick={() => {
						setLogoutLoading(true);
						void logout().finally(() => setLogoutLoading(false));
					}}
					disabled={logoutLoading}
					className='text-red-600 hover:bg-red-50'
				>
					ログアウト
				</ListButtonItem>
			</ListGroup>
		</AppWindow>
	);
};
