import { useNavigate, Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useHandleUser } from '../../usecase/useHandleUser';
import styles from './AppWindow.module.css';

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
			<div className={styles.appWindow}>
				{!userLoading && (!authOnly || user) && (
					<>
						<div className={styles.header}>
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
				<div className={styles.loading}>
					<ReactLoading type="spin" color="#999999" />
				</div>
			)}
		</>
	);
};

export const ListGroup = ({
	title,
	description,
	error,
	children,
}: {
	title?: string;
	description?: string;
	error?: string;
	children: React.ReactNode;
}) => {
	return (
		<>
			{title && <div className={styles.listtitle}>{title}</div>}
			{error && (
				<div className={styles.listtitle} style={{ color: '#f00' }}>
					{error}
				</div>
			)}
			<div className={styles.listgroup}>{children}</div>
			{description && (
				<div
					className={styles.listtitle}
					style={{
						marginTop: '-28px',
						marginBottom: '32px',
						fontWeight: 'normal',
					}}
				>
					{description}
				</div>
			)}
		</>
	);
};

export const ListItem = ({
	linkTo,
	onClick,
	children,
	disabled = false,
	style,
}: {
	linkTo?: string;
	onClick?: () => void;
	children?: React.ReactNode;
	disabled?: boolean;
	style?: React.CSSProperties;
}) => {
	return linkTo ? (
		<Link to={linkTo} className={styles.listitem} {...(style && { style })}>
			{children}
			<FaChevronRight />
		</Link>
	) : onClick ? (
		<div className={styles.listitem} {...(style && { style })}>
			<button onClick={onClick} disabled={disabled}>
				{children}
			</button>
		</div>
	) : (
		<div className={`${styles.listitem}`} {...(style && { style })}>
			{children}
		</div>
	);
};
