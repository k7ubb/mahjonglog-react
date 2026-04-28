import { type ComponentPropsWithoutRef } from 'react';

type ListGroupProps = {
	title?: string;
	description?: string;
	error?: string;
};

export const ListGroup = (props: ComponentPropsWithoutRef<'div'> & ListGroupProps) => {
	const { title, description, error, children, className, ...rest } = props;
	return (
		<>
			{title && <div className='ml-4 text-sm font-bold text-stone-500 whitespace-pre'>{title}</div>}
			{error && <div className='ml-4 text-sm font-bold text-red-600 whitespace-pre'>{error}</div>}

			<div className={`mt-1 mb-8 rounded-2xl bg-white overflow-hidden ${className}`} {...rest}>
				{children}
			</div>

			{description && (
				<div className='ml-4 -mt-7 mb-8 text-sm font-normal text-stone-500 whitespace-pre'>{description}</div>
			)}
		</>
	);
};
