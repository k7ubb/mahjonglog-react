import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { FaUserCircle } from 'react-icons/fa';
import { useHandleUser } from '../../usecase/useHandleUser';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';

export const HomePage: React.FC = () => {
	const { user } = useHandleUser();

	return (
		<AppWindow title="麻雀戦績共有アプリ">
			{user ? (
				<>
					<ListGroup>
						<ListItem linkTo="/app/account" style={{ height: '64px' }}>
							<div style={{ width: '64px' }}>
								<FaUserCircle
									size={48}
									color="#999"
									style={{ marginTop: '16px' }}
								/>
							</div>
							<div style={{ lineHeight: '1.6em' }}>
								<span style={{ fontSize: '20px' }}>{user.accountName}</span>
								<br />
								<span style={{ color: '#999', fontSize: '14px' }}>
									@{user.accountID}
								</span>
							</div>
						</ListItem>
					</ListGroup>
					<ListGroup title={`${user.accountName} さん`}>
						<ListItem linkTo="/app/log/add">新規登録</ListItem>
						<ListItem linkTo="/app/log">ログ表示</ListItem>
						<ListItem linkTo="/app/player">個人記録</ListItem>
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
