import { Link } from 'react-router-dom';
import { FaChevronLeft } from "react-icons/fa";
import style from './AppWindow.module.css';

type Props = {
	title: string;
  backTo?: string;
	children?: React.ReactNode;
};

export const AppWindow = ({ title, backTo, children }: Props) => {
	return (
		<div className={style.appWindow}>
			<div className={style.header}>
        {backTo && <Link to={backTo}><FaChevronLeft />戻る</Link>}
				<h1>{title}</h1>
			</div>
			{children}
		</div>
	);
};
