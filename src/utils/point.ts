// 100点単位の点数を、ウマオカを反映したポイントに変換
export const calculatePoint = (rawPoints: number[]): number[] => [
	Math.round((rawPoints[0] + 100 - 1) / 10),
	Math.round((rawPoints[1] - 200 - 1) / 10),
	Math.round((rawPoints[2] - 400 - 1) / 10),
	Math.round((rawPoints[3] - 500 - 1) / 10),
];
