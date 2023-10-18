export type MJscore = {
  player: string;
  point: number;
}

export type MJlog = {
  date: number;
  date_str: string;
  score: MJscore[];
};

  