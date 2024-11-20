import { useNavigate, Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useHandleUser } from '../../usecase/useHandleUser';
import style from './AppWindow.module.css';

export const AppWindow = ({
	title,
	backTo,
	children,
	loading,
	authOnly,
}: {
	title: string;
	backTo?: string;
	children?: React.ReactNode;
	loading?: boolean;
	authOnly?: boolean;
}) => {
	const navigate = useNavigate();
	const { user, loading: userLoading } = useHandleUser();

	if (authOnly && !userLoading && !user) {
		navigate('/app');
	}

	return (
		<>
			<div className={style.appWindow}>
				{!userLoading && (!authOnly || user) && (
					<>
						<div className={style.header}>
							{backTo && (
								<Link to={backTo}>
									<FaChevronLeft />
									戻る
								</Link>
							)}
							<h1>{title}</h1>
						</div>
						{children}
					</>
				)}
			</div>
			{(loading || userLoading) && (
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
	children: React.ReactNode;
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
	disabled = false,
}: {
	linkTo?: string;
	onClick?: () => void;
	children?: React.ReactNode;
	disabled?: boolean;
}) => {
	return linkTo ? (
		<Link to={linkTo} className={style.listitem}>
			{children}
			<FaChevronRight />
		</Link>
	) : onClick ? (
		<div className={style.listitem}>
			<button onClick={onClick} disabled={disabled}>
				{children}
			</button>
		</div>
	) : (
		<div className={`${style.listitem}`}>{children}</div>
	);
};
