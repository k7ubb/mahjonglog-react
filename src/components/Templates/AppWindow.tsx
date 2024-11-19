import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ReactLoading from 'react-loading';
import { useHandleUser } from '../../usecase/useHandleUser';
import style from './AppWindow.module.css';

export const AppWindow = ({
	title,
	backTo,
	children,
	loading,
}: {
	title: string;
	backTo?: string;
	children?: React.ReactNode;
	loading?: boolean;
}) => {
	const { user } = useHandleUser();

	return (
		<>
			<div className={style.appWindow}>
				<div className={style.header}>
					{backTo && (
						<Link to={backTo}>
							<FaChevronLeft />
							戻る
						</Link>
					)}
					<h1>
						{title} {user ? `${user.accountID}さん` : ''}
					</h1>
				</div>
				{children}
			</div>
			{loading && (
				<div className={style.loading}>
					<ReactLoading type="spin" color="#999999" />
				</div>
			)}
		</>
	);
};

export const ListGroup = ({
	title,
	error,
	children,
}: {
	title?: string;
	error?: string;
	children?: React.ReactNode;
}) => {
	return (
		<>
			{title && <div className={style.listtitle}>{title}</div>}
			{error && (
				<div className={style.listtitle} style={{ color: '#f00' }}>
					{error}
				</div>
			)}
			<div className={style.listgroup}>{children}</div>
		</>
	);
};

export const ListItem = ({
	linkTo,
	onClick,
	children,
}: {
	linkTo?: string;
	onClick?: () => void;
	children?: React.ReactNode;
}) => {
	return linkTo ? (
		<Link to={linkTo} className={style.listitem}>
			{children}
			<FaChevronRight />
		</Link>
	) : onClick ? (
		<div className={`${style.listitem} ${style.button}`} onClick={onClick}>
			{children}
		</div>
	) : (
		<div className={`${style.listitem}`}>{children}</div>
	);
};
