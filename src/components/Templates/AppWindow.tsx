import { type ComponentPropsWithoutRef } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { type IconType } from 'react-icons/lib';
import { MdFilterAlt, MdFilterAltOff } from 'react-icons/md';
import { TbReload } from 'react-icons/tb';
import { useLocation, Link } from 'react-router-dom';
import colors from 'tailwindcss/colors';
import { FilterForm } from '@/components/Presenter/FilterForm';
import { useAppData } from '@/contexts/useAppData';
import { useUserData } from '@/contexts/useUserData';
import { useVersion } from '@/usecase/useVersion';

type AppWindowProps = {
	title: string;
	backTo?: string;
	extraButtons?: ({
		icon: IconType;
		iconColor?: string;
	} & ComponentPropsWithoutRef<'button'>)[];
	// アカウント切り替えボタン専用、戻るボタンと併用は想定しない
	headerLeftButton?: ({
		icon: IconType;
		iconColor?: string;
	} & ComponentPropsWithoutRef<'button'>);
};

const currentVersion = '1.0.0';

export const AppWindow = (props: ComponentPropsWithoutRef<'div'> & AppWindowProps) => {
	const { title, backTo, children, extraButtons, headerLeftButton, className, ...rest } = props;
	const { status } = useUserData();
	const { isFilterEnabled, isFilterDialogOpen, update, openFilterDialog, closeFilterDialog } = useAppData();
	const { version } = useVersion();
	const location = useLocation();
	
	const calculatedBackTo = backTo || (location.pathname === '/' ? undefined : (location.pathname.slice(0, location.pathname.lastIndexOf('/')) || '/'));
	
	const handleUpdate = async () => {
		if ('caches' in window) {
			const cacheNames = await caches.keys();
			await Promise.all(cacheNames.map(name => caches.delete(name)));
		}
		window.location.reload();
	};

	const appDataUpdateButton = {
		icon: TbReload,
		iconColor: colors.green[600],
		onClick: update,
	};

	const filterDialogButton = {
		icon: isFilterEnabled ? MdFilterAlt : MdFilterAltOff,
		iconColor: isFilterEnabled ? colors.green[600] : colors.stone[600],
		onClick: () => isFilterDialogOpen ? closeFilterDialog() : openFilterDialog(),
	};

	if (version > currentVersion) {
		return (
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
		);
	}

	return (
		<div className={`mx-auto p-4 pt-0 w-full box-border max-w-md bg-stone-100 overflow-y-auto h-full ${className}`} {...rest}>
			<div className='sticky top-0 z-10 -mx-4 px-2
											mb-8 h-12 bg-white border-b border-stone-300
											grid grid-cols-[1fr_auto_1fr] items-center'>
				{calculatedBackTo && (
					<Link to={calculatedBackTo} className='flex items-center gap-1 text-lg text-green-600 hover:text-green-800'>
						<FaChevronLeft />
						戻る
					</Link>
				)}
				{headerLeftButton && (
					<div className='flex pl-1 gap-1'>
						{(() => {
							const { icon: Icon, iconColor, ...buttonProps } = headerLeftButton;
							return (
								<button {...buttonProps}>
									<Icon size={24} color={iconColor} />
								</button>
							);
						})()}
					</div>
				)}

				<h1 className='col-start-2 text-xl'>{title}</h1>

				<div className='flex flex-row-reverse pr-2 gap-1'>
					{[
						...(status === 'login' ? [filterDialogButton, appDataUpdateButton] : []),
						...(extraButtons ?? []),
					].map(({ icon: Icon, iconColor, ...buttonProps }, i) => (
						<button key={i} className='ml-2' {...buttonProps}><Icon size={24} color={iconColor} /></button>
					))}
				</div>
			</div>
			{children}
			{isFilterDialogOpen && (
				<div
					className='fixed inset-0'
					onClick={closeFilterDialog}
				/>
			)}
			{status === 'login' && <FilterForm open={isFilterDialogOpen} />}
		</div>
	);
};
