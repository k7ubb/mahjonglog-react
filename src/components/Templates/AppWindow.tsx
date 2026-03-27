import { useEffect, type ComponentPropsWithoutRef } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { type IconType } from 'react-icons/lib';
import { MdFilterAlt, MdFilterAltOff } from 'react-icons/md';
import ReactLoading from 'react-loading';
import { useNavigate, Link } from 'react-router-dom';
import colors from 'tailwindcss/colors';
import { FilterForm } from '@/components/Presenter/FilterForm';
import { useHandleLog } from '@/usecase/useHandleLog';
import { useHandleUser } from '@/usecase/useHandleUser';
import { useHandleVersion } from '@/usecase/useHandleVersion';

type AppWindowProps = {
	title: string;
	backTo?: string;
	loading?: boolean;
	authOnly?: boolean;
	extraButtons?: ({
		icon: IconType;
		iconColor?: string;
	} & ComponentPropsWithoutRef<'button'>)[]
};

const currentVersion = '1.0.0';

export const AppWindow = (props: ComponentPropsWithoutRef<'div'> & AppWindowProps) => {
	const { title, backTo, children, loading, authOnly, extraButtons, className, ...rest } = props;
	const navigate = useNavigate();
	const { user, loading: userLoading } = useHandleUser();
	const { filter, filterDialogOpen, setFilterDialogOpen } = useHandleLog();
	const { version, loading: versionLoading } = useHandleVersion();

	const handleUpdate = async () => {
		if ('caches' in window) {
			const cacheNames = await caches.keys();
			await Promise.all(cacheNames.map(name => caches.delete(name)));
		}
		window.location.reload();
	};

	const filterDialogButton = {
		icon: (filter.from && filter.to) ? MdFilterAlt : MdFilterAltOff,
		iconColor: (filter.from && filter.to) ? colors.green[600] : colors.stone[600],
		onClick: () => setFilterDialogOpen(!filterDialogOpen),
	};

	useEffect(() => {
		if (authOnly && !userLoading && !user) {
			navigate('/');
		}
	}, [authOnly, userLoading, user, navigate]);

	return (
		<>
			{(loading || userLoading || versionLoading) ? (
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'>
					<ReactLoading type='spin' color='#999999' />
				</div>
			) : (version > currentVersion) ? (
				<div className='mx-auto p-4 pt-0 w-full max-w-md bg-stone-100 h-full flex items-center justify-center text-center box-border'>
					<div className='bg-white m-4 rounded-2xl'>
						<p className='px-8 pt-6'>アプリの利用にはアップデートが必要です。</p>
						<p className='text-sm py-6'>
							現在のバージョン: {currentVersion} <br />
							利用可能なバージョン: {version}
						</p>
						<button
							className='w-full py-4 center border-t border-stone-200 text-green-600 hover:bg-green-50'
							onClick={() => void handleUpdate()}
						>
							アップデートして再読み込み
						</button>
					</div>
				</div>
			): (
				<div className={`mx-auto p-4 pt-0 w-full box-border max-w-md bg-stone-100 overflow-y-auto h-full ${className}`} {...rest}>
					{!userLoading && (!authOnly || user) && (
						<>
							<div className='sticky top-0 z-10 -mx-4 px-2
															mb-8 h-12 bg-white border-b border-stone-300
															grid grid-cols-[1fr_auto_1fr] items-center'>
								{backTo && (
									<Link to={backTo} className='flex items-center gap-1 text-lg text-green-600 hover:text-green-800'>
										<FaChevronLeft />
										戻る
									</Link>
								)}

								<h1 className='col-start-2 text-xl'>{title}</h1>

								<div className='flex flex-row-reverse pr-2 gap-1'>
									{[
										...(user ? [filterDialogButton] : []),
										...(extraButtons ?? []),
									].map(({ icon: Icon, iconColor, ...buttonProps }, i) => (
										<button key={i} className='ml-2' {...buttonProps}><Icon size={24} color={iconColor} /></button>
									))}
								</div>
							</div>
							{children}
							{user && <FilterForm open={filterDialogOpen} />}
						</>
					)}
				</div>
			)}
		</>
	);
};
