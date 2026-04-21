export const parseScore = [
	(point: number) => Math.round((point + 100 - 1) / 10),
	(point: number) => Math.round((point - 200 - 1) / 10),
	(point: number) => Math.round((point - 400 - 1) / 10),
	(point: number) => Math.round((point - 500 - 1) / 10),
];
