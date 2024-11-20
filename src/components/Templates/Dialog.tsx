import style from './Dialog.module.css';

export const Dialog = ({
	open,
	onClose,
	children,
}: {
	open: boolean;
	onClose: any;
	children?: React.ReactNode;
}) => {
	return (
		<div
			className={open ? style.open : style.close}
			onClick={(e) => {
				if (e.currentTarget === e.target) {
					onClose();
				}
			}}
		>
			<div>{children}</div>
		</div>
	);
};
