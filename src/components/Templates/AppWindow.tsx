import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ReactLoading from 'react-loading';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AppWindow.module.css';
import { useHandleLog } from '../../usecase/useHandleLog';
import { useHandleUser } from '../../usecase/useHandleUser';
import { FilterForm } from '../Presenter/FilterForm';

export const AppWindow = ({
	title,
	backTo,
	children,
	loading,
	authOnly,
	extraButton,
}: {
	title: string;
	backTo?: string;
	children?: React.ReactNode;
	loading?: boolean;
	authOnly?: boolean;
	extraButton?: React.ReactNode;
}) => {
	const navigate = useNavigate();
	const { user, loading: userLoading } = useHandleUser();
	const { filter, setFilter } = useHandleLog();

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
							{user && <FilterForm filter={filter} setFilter={setFilter} />}
							{extraButton}
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
