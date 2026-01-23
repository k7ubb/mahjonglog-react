import { type ComponentPropsWithoutRef } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import ReactLoading from 'react-loading';
import { useNavigate, Link } from 'react-router-dom';
import { useHandleLog } from '../../usecase/useHandleLog';
import { useHandleUser } from '../../usecase/useHandleUser';
import { FilterForm } from '../Presenter/FilterForm';

type AppWindowProps = {
	title: string;
	backTo?: string;
	loading?: boolean;
	authOnly?: boolean;
	extraButtons?: React.ReactNode[];
};

export const AppWindow = (props: ComponentPropsWithoutRef<'div'> & AppWindowProps) => {
	const { title, backTo, children, loading, authOnly, extraButtons, className, ...rest } = props;
	const navigate = useNavigate();
	const { user, loading: userLoading } = useHandleUser();
	const { filter, setFilter } = useHandleLog();

	if (authOnly && !userLoading && !user) {
		setTimeout(() => navigate('/'), 1);
		return null;
	}

	return (
		<>
			<div className={`mx-auto p-4 pt-0 w-full box-border max-w-md bg-stone-100 overflow-y-auto h-full ${className}`} {...rest}>
				{!userLoading && (!authOnly || user) && (
					<>
						<div className="sticky top-0 z-10 -mx-4 px-2
														mb-8 h-12 bg-white border-b border-stone-300
														grid grid-cols-[1fr_auto_1fr] items-center">
							{backTo && (
								<Link to={backTo} className="flex items-center gap-1 text-lg text-green-600 hover:text-green-800">
									<FaChevronLeft />
									戻る
								</Link>
							)}

							<h1 className="col-start-2 text-xl">{title}</h1>

							<div className='flex justify-end'>
								{user && <FilterForm filter={filter} setFilter={setFilter} />}
								{extraButtons && extraButtons.map((button, i) => (
									<div key={i}>{button}</div>
								))}
							</div>
						</div>

						{children}
					</>
				)}
			</div>

			{(loading || userLoading) && (
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
					<ReactLoading type="spin" color="#999999" />
				</div>
			)}
		</>
	);
};
