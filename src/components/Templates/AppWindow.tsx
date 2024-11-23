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
		setTimeout(() => navigate('/app'), 1);
		return <></>;
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
	description?: string | React.ReactNode;
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
	iconElement,
	style,
}: {
	linkTo?: string;
	onClick?: () => void;
	children?: React.ReactNode;
	disabled?: boolean;
	iconElement?: JSX.Element;
	style?: React.CSSProperties;
}) => {
	return linkTo ? (
		<Link to={linkTo} className={styles.listitem} {...(style && { style })}>
			{iconElement}
			<div style={{ flexGrow: 1 }}>{children}</div>
			<FaChevronRight />
		</Link>
	) : onClick ? (
		<input
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={styles.listitem}
			value={String(children)}
			{...(style && { style })}
		></input>
	) : (
		<div className={`${styles.listitem}`} {...(style && { style })}>
			{iconElement}
			<div style={{ flexGrow: 1 }}>{children}</div>
		</div>
	);
};
