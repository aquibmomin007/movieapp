import { SetStateAction, Dispatch } from "react"

export type TMovie = {
  id: string
  name: string
  year: string
  image: string
  imdbRating: number;
}

export type TContext = {
  movie?: TMovie | undefined;
}

export type TAppContext = {
  ctx?: TContext;
  setCtx?: Dispatch<SetStateAction<TContext | undefined>>;
}

export type TMovieResponse = {
  aggregateRating: {
    ratingValue: number;
    ratingCount: number;
  };
  image: string;
  name: string;
  url: string;
  datePublished: string;
}[];