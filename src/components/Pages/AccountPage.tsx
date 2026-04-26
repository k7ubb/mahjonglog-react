import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppWindow, ListGroup, ListButtonItem, ListInputItem } from '@/components/Templates';
import { useLoading } from '@/contexts/useLoading';
import { useAuthUserData } from '@/contexts/useUserData';
import { useAccount } from '@/usecase/useAccount';

export const AccountPage = () => {
	const navigate = useNavigate();
	const { loading, startLoading, endLoading } = useLoading();
	const { accountName: initialAccountName, updateAccountName } = useAuthUserData();
	const { logout } = useAccount();
	const [accountName, setAccountName] = useState(initialAccountName);
	const [error, setError] = useState('');

	return (
		<AppWindow title='アカウント設定'>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					startLoading();
					updateAccountName(accountName)
						.then(() => {
							navigate('/');
						})
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
