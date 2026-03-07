import { FaUserCircle, FaDatabase } from 'react-icons/fa';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { IoMdCreate } from 'react-icons/io';
import { IoMdDownload } from 'react-icons/io';
import { IoAnalytics } from 'react-icons/io5';
import { MdPeople } from 'react-icons/md';
import colors from 'tailwindcss/colors';
import { AppWindow, ListGroup, ListLinkItem } from '@/components/Templates';
import { useHandleUser } from '@/usecase/useHandleUser';

export const HomePage = () => {
	const { user } = useHandleUser();
	const indexPageUrl = import.meta.env.VITE_APP_INDEX_PAGE_URL;

	return (
		<AppWindow title='麻雀戦績共有アプリ'>
			{user ? (
				<>
					<ListGroup>
						<ListLinkItem
							to='/account'
							className='py-8'
							icon={FaUserCircle}
							iconSize={48}
							iconColor={colors.stone[300]}
						>
							<div className='h-full flex flex-col justify-center'>
								<div className='text-xl'>{user.accountName}</div>
								<div className='text-stone-400 text-sm'>@{user.accountID}</div>
							</div>
						</ListLinkItem>
					</ListGroup>
					<ListGroup>
						<ListLinkItem
							to='/log/add'
							icon={IoMdCreate}
							iconColor={colors.red[400]}
						>
							新規ログ作成
						</ListLinkItem>
						<ListLinkItem
							to='/log'
							icon={FaDatabase}
							iconColor={colors.blue[400]}
						>
							対局ログ一覧
						</ListLinkItem>
						<ListLinkItem
							to='/player'
							icon={MdPeople}
							iconColor={colors.green[400]}
						>
							プレイヤー成績
						</ListLinkItem>
						<ListLinkItem
							to='/analysis'
							icon={IoAnalytics}
							iconColor={colors.orange[400]}
						>
							詳細分析β
						</ListLinkItem>
					</ListGroup>
					<ListGroup>
						<ListLinkItem
							to='/export'
							icon={IoMdDownload}
							iconColor={colors.stone[600]}
						>
							CSVエクスポート
						</ListLinkItem>
					</ListGroup>
				</>
			) : (
				<>
					<ListGroup title={'アカウント'}>
						<ListLinkItem to='/login'>ログイン</ListLinkItem>
						<ListLinkItem to='/register'>アカウント登録</ListLinkItem>
					</ListGroup>
				</>
			)}
			{indexPageUrl && <>
				<div style={{ height: '64px' }} />
				<ListGroup>
					<ListLinkItem to={indexPageUrl} icon={FaArrowUpRightFromSquare} iconSize={16} iconColor={colors.stone[600]}>
						本アプリについて
					</ListLinkItem>
				</ListGroup>
			</>}
		</AppWindow>
	);
};
