import { useNavigation, type PageType } from '../contexts/PageContext';
import ReactLoading from 'react-loading';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useHandleUser } from '../../usecase/useHandleUser';
import { useHandleLog } from '../../usecase/useHandleLog';
import { FilterForm } from '../Presenter/FilterForm';
import styles from './AppWindow.module.css';

export const AppWindow = ({
	title,
	children,
	loading,
	authOnly,
	extraButton,
}: {
	title: string;
	children?: React.ReactNode;
	loading?: boolean;
	authOnly?: boolean;
	extraButton?: React.ReactNode;
}) => {
  const { navigateTo, goBack, canGoBack } = useNavigation();
	const { user, loading: userLoading } = useHandleUser();
	const { filter, setFilter } = useHandleLog();

	if (authOnly && !userLoading && !user) {
		setTimeout(() => navigateTo({ type: 'index' }), 1);
		return <></>;
	}

	return (
		<>
			<div className={styles.appWindow}>
				{!userLoading && (!authOnly || user) && (
					<>
						<div className={styles.header}>
							{canGoBack && (
								<button className={styles.back} onClick={() => goBack()}>
									<FaChevronLeft />
									戻る
								</button>
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
	destination,
	onClick,
	children,
	disabled = false,
	iconElement,
	style,
}: {
	destination?: PageType;
	onClick?: () => void;
	children?: React.ReactNode;
	disabled?: boolean;
	iconElement?: JSX.Element;
	style?: React.CSSProperties;
}) => {
  const { navigateTo } = useNavigation();
	return destination ? (
		<button onClick={() => navigateTo(destination)} className={styles.listitem} {...(style && { style })}>
			{iconElement}
			<div style={{ flexGrow: 1 }}>{children}</div>
			<FaChevronRight />
		</button>
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
