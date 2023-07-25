import { TMovie } from "./types";

export const FavouriteStorage = {
  get(): TMovie[] {
    if (sessionStorage.getItem("_fm")) {
      const storedFavMovies: TMovie[] = JSON.parse(sessionStorage.getItem("_fm") as string)
       if (Array.isArray(storedFavMovies)) {
         return storedFavMovies
       }
    }
    return []
  },
  remove(movie: TMovie) {
    const storedFavMovies: TMovie[] = JSON.parse(sessionStorage.getItem("_fm") as string) || []
    sessionStorage.setItem("_fm", JSON.stringify([...storedFavMovies.filter(s => s.id !== movie.id)]))
  },
  add(movie: TMovie) {
    const storedFavMovies: TMovie[] = JSON.parse(sessionStorage.getItem("_fm") as string) || []
    sessionStorage.setItem("_fm", JSON.stringify([...storedFavMovies, movie]))
  }
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());