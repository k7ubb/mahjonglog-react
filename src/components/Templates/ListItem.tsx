import { type ComponentPropsWithoutRef } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { type IconType } from 'react-icons/lib';
import { Link } from 'react-router-dom';

type IconProps = {
	icon: IconType;
	iconSize?: number;
	iconColor?: string;
	iconClassName?: string;
};

const Icon = (props: IconProps) => {
	const { icon: Icon, iconSize, iconColor, iconClassName } = props;
	return (
		<div className='min-w-5'>
			<Icon size={iconSize ?? 20} color={iconColor} className={iconClassName} />
		</div>
	);
};

const listItemBaseClass =
	`flex gap-2 items-center px-4
	 w-full h-12 border-stone-100 border-t first:border-t-0`;

export const ListItem = (props: ComponentPropsWithoutRef<'div'> & Partial<IconProps>) => {
	const { icon, iconSize, iconColor, iconClassName, className, children, ...rest } = props;

	return (
		<div className={`${listItemBaseClass} ${className}`} {...rest}>
			{icon && <Icon icon={icon} iconSize={iconSize} iconColor={iconColor} iconClassName={iconClassName} />}
			<div className="grow h-full flex items-center py-1">{children}</div>
		</div>
	);
};

export const ListLinkItem = (props: ComponentPropsWithoutRef<typeof Link> & Partial<IconProps>) => {
	const { icon, iconSize, iconColor, iconClassName, className, children, ...rest } = props;
	return (
		<Link className={`${listItemBaseClass} ${className} hover:bg-green-50`} {...rest}>
			{icon && <Icon icon={icon} iconSize={iconSize} iconColor={iconColor} iconClassName={iconClassName} />}
			<div className="grow h-full flex items-center py-1">{children}</div>
			<div className="ml-auto">
				<FaChevronRight />
			</div>
		</Link>
	);
};

export const ListButtonItem = (props: ComponentPropsWithoutRef<'button'> & Partial<IconProps>) => {
	const { icon, iconSize, iconColor, iconClassName, className, disabled, children, ...rest } = props;
	return (
		<button
			className={`${listItemBaseClass} ${className} text-left ${disabled ? 'text-stone-500 line-through' : 'text-green-600 hover:bg-green-50'}`}
			{...rest}
		>
			{icon && <Icon icon={icon} iconSize={iconSize} iconColor={iconColor} iconClassName={iconClassName} />}
			<div className="grow h-full flex items-center py-1 ">{children}</div>
		</button>
	);
};

export const ListInputItem = (props: ComponentPropsWithoutRef<'input'> & Partial<IconProps>) => {
	const { icon, iconSize, iconColor, iconClassName, className, ...rest } = props;
	return (
		<ListItem icon={icon} iconSize={iconSize} iconColor={iconColor} iconClassName={iconClassName}>
			<input className={`block w-full h-full ${className}`} {...rest} />
		</ListItem>
	);
};
