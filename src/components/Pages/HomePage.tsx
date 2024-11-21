import { useState } from 'react';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { useHandleAuth } from '../../usecase/useHandleAuth';
import { useHandleUser } from '../../usecase/useHandleUser';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';

export const HomePage: React.FC = () => {
	const { user } = useHandleUser();
	const { logout } = useHandleAuth();
	const [loading, setLoading] = useState(false);

	return (
		<AppWindow title="麻雀戦績共有アプリ">
			{user ? (
				<>
					<ListGroup title={`${user.accountName} さん`}>
						<ListItem linkTo="/app/log/add">新規登録</ListItem>
						<ListItem linkTo="/app/log">ログ表示</ListItem>
						<ListItem linkTo="/app/player">個人記録</ListItem>
					</ListGroup>
					<ListGroup>
						<ListItem
							onClick={async () => {
								setLoading(true);
								await logout();
								setLoading(false);
							}}
							disabled={loading}
						>
							ログアウト
						</ListItem>
					</ListGroup>
				</>
			) : (
				<>
					<ListGroup title={'アカウント'}>
						<ListItem linkTo="/app/login">ログイン</ListItem>
						<ListItem linkTo="/app/register">新規登録</ListItem>
					</ListGroup>
				</>
			)}
			<div style={{ height: '64px' }} />
			<ListGroup>
				<ListItem linkTo="/">
					<FaArrowUpRightFromSquare
						style={{ marginLeft: 0, padding: '14px 8px 18px 0' }}
					/>
					本アプリについて
				</ListItem>
			</ListGroup>
		</AppWindow>
	);
};
