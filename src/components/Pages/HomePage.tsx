import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { FaUserCircle, FaDatabase } from 'react-icons/fa';
import { IoMdCreate } from 'react-icons/io';
import { MdPeople } from 'react-icons/md';
import { useHandleUser } from '../../usecase/useHandleUser';
import { AppWindow, ListGroup, ListItem } from '../Templates/AppWindow';

export const HomePage: React.FC = () => {
	const { user } = useHandleUser();

	return (
		<AppWindow title="麻雀戦績共有アプリ">
			{user ? (
				<>
					<ListGroup>
						<ListItem
							linkTo="/app/account"
							style={{ height: '64px', lineHeight: '1.5em' }}
							iconElement={
								<FaUserCircle
									size={48}
									color="#999"
									style={{ marginLeft: '-4px' }}
								/>
							}
						>
							<span style={{ fontSize: '20px' }}>{user.accountName}</span>
							<br />
							<span style={{ color: '#999', fontSize: '14px' }}>
								@{user.accountID}
							</span>
						</ListItem>
					</ListGroup>
					<ListGroup>
						<ListItem
							linkTo="/app/log/add"
							iconElement={<IoMdCreate size={20} color="#FF375F" />}
						>
							新規ログ作成
						</ListItem>
						<ListItem
							linkTo="/app/log"
							iconElement={<FaDatabase size={20} color="#007AFF" />}
						>
							対局ログ一覧
						</ListItem>
						<ListItem
							linkTo="/app/player"
							iconElement={<MdPeople size={20} color="#34C759" />}
						>
							プレイヤー成績
						</ListItem>
					</ListGroup>
				</>
			) : (
				<>
					<ListGroup title={'アカウント'}>
						<ListItem linkTo="/app/login">ログイン</ListItem>
						<ListItem linkTo="/app/register">アカウント登録</ListItem>
					</ListGroup>
				</>
			)}
			<div style={{ height: '64px' }} />
			<ListGroup>
				<ListItem linkTo="/" iconElement={<FaArrowUpRightFromSquare />}>
					本アプリについて
				</ListItem>
			</ListGroup>
		</AppWindow>
	);
};
