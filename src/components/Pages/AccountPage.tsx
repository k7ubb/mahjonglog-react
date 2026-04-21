import { useState } from 'react';
import { AppWindow, ListGroup, ListButtonItem, ListInputItem } from '@/components/Templates';
import { useLoading } from '@/contexts/useLoading';
import { useAuthUserData } from '@/contexts/useUserData';
import { useAccount } from '@/usecase/useAccount';

export const AccountPage = () => {
	const { loading, startLoading, endLoading } = useLoading();
	const { accountID: initialAccountID, accountName: initialAccountName, updateProfile } = useAuthUserData();
	const { logout } = useAccount();
	const [accountID, setAccountID] = useState(initialAccountID);
	const [accountName, setAccountName] = useState(initialAccountName);
	const [error, setError] = useState('');

	return (
		<AppWindow title='アカウント設定'>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					startLoading();
					updateProfile(accountID, accountName)
						.catch((e) => setError((e as Error).message))
						.finally(() => endLoading());
				}}
			>
				<ListGroup title='アカウント名'>
					<ListInputItem
						required
						type='text'
						placeholder='アカウント名を設定'
						value={accountName}
						onChange={(e) => setAccountName(e.target.value)}
					/>
				</ListGroup>

				<ListGroup
					title='アカウントID'
					description='ログイン時に使用します。必要に応じて、変更後のアカウントIDをメンバーに共有してください。'
				>
					<ListInputItem
						required
						type='text'
						pattern='^[a-zA-Z0-9\-_]+$'
						placeholder='アカウントIDを設定'
						value={accountID}
						onChange={(e) => setAccountID(e.target.value)}
					/>
				</ListGroup>

				<ListGroup error={error}>
					<ListButtonItem
						type='submit'
						disabled={loading}
					>
						変更を保存
					</ListButtonItem>
				</ListGroup>
			</form>
			<div className='h-16' />
			<ListGroup>
				<ListButtonItem
					onClick={() => {
						startLoading();
						void logout().finally(() => endLoading());
					}}
					disabled={loading}
					className='text-red-600 hover:bg-red-50'
				>
					ログアウト
				</ListButtonItem>
			</ListGroup>
		</AppWindow>
	);
};
