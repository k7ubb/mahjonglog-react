import { FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import colors from 'tailwindcss/colors';
import { useLoading } from '@/contexts/useLoading';
import { useAccount } from '@/usecase/useAccount';

type FilterFormProps = {
	open: boolean;
};

export const AccountSwitchForm = (props: FilterFormProps) => {
	const { open } = props;
	const { users, changeUser } = useAccount();
	const { startLoading, endLoading } = useLoading();

	return (
		<div
			className={`absolute top-14 left-1/2 -translate-x-1/2 w-full max-w-100 rounded-2xl
									shadow-md bg-white overflow-clip
									transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
		>
			<ul className='flex flex-col'>
				{users.map((user) => (
					<li key={user.uid}>
						<button 
							disabled={user.current}
							onClick={() => {
								startLoading();
								void changeUser(user.uid).finally(() => endLoading());
							}}
							className='flex w-full px-4 py-4 align-middle items-center gap-2 hover:bg-green-50'
						>
							<FaUserCircle size={48} color={colors.stone[300]} />
							<div className='h-full flex flex-col text-left'>
								<div className='text-xl'>{user.accountName}</div>
								<div className='text-stone-400 text-sm'>@{user.accountID}</div>
							</div>
							<FaCheckCircle color={user.current ? 'green' : 'transparent'} className='ml-auto' />
						</button>
					</li>
				))}
			</ul>
			<ul className='border-t border-stone-100'>
				<li>
					<Link to='/login' className='flex w-full px-4 py-4 align-middle items-center gap-2 hover:bg-green-50'>
						既存のアカウントを追加
					</Link>
				</li>
				<li>
					<Link to='/register' className='flex w-full px-4 py-4 align-middle items-center gap-2 hover:bg-green-50'>
						アカウント登録
					</Link>
				</li>
			</ul>
		</div>
	);
};
