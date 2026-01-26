export const ColoredNumber = ({ point }: { point: number }) => {
	return <span className={
		point > 0 ? 'text-blue-600' : point < 0 ? 'text-red-600' : ''
	}>{point}</span>;
};
