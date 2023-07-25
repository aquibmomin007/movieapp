"use client";

import { useState, useEffect } from "react";
import { HeartIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/solid';
import useSWR from 'swr';
import { TMovie } from "./types";
import { useRouter } from "next/navigation";
import Header from "./components/header";
import { useContext } from "react";
import { AppContext } from "./layout";
import { FavouriteStorage, fetcher } from "./utils";
import Loader from "./components/loader";
import SorryNotFoundIllustration from "../../public/sorry-item-not-found.png"
import Image from "next/image"
import Menu from "./components/menu";

type SorterAttributes = {
  selected: string;
}

export default function Home() {
  const [favouriteSelected, setFavouriteSelected] = useState(false);
  const [movies, setMovies] = useState<TMovie[]>([])
  const [favouritemovies, setFavouriteMovies] = useState<TMovie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<TMovie | undefined>();
  const [openYear, setOpenYear] = useState(false)
  const [openRating, setOpenRating] = useState(false)
  const [openTitle, setOpenTitle] = useState(false)
  const [_sort, setSort] = useState<Record<string, string>>({})
  
  const { data, error, isLoading } = useSWR<TMovie[]>(`/api/movies`, fetcher);

  const router = useRouter()
  const appContext = useContext(AppContext)
  
  useEffect(() => {
    if (data) {
      setMovies(data as TMovie[])
    }
  }, [data])

  useEffect(() => {
    if (selectedMovie) {
      router.push(`/movies/${selectedMovie.id}`);
    }
  }, [selectedMovie])

  useEffect(() => {
    if (favouriteSelected) {
      setFavouriteMovies(FavouriteStorage.get())
    } else {
      setFavouriteMovies([])
    }
  }, [favouriteSelected])

  const handleMovieSelection = (e: React.MouseEvent<HTMLDivElement>, _movie: TMovie) => {
    e.preventDefault()
    setSelectedMovie(_movie)
    appContext.setCtx && appContext.setCtx({
      ...appContext.ctx,
      movie: _movie
    })
  }

  const _movies = (favouriteSelected ? favouritemovies : movies)

  const renderContent = () => (
    <section className="grid grid-cols-3 gap-4 pt-24 w-full px-8">
      {!_movies || !_movies.length ? (
        <div className="w-full flex flex-col items-center justify-center col-span-3">
          <Image src={SorryNotFoundIllustration} alt="sorry not found" width={350} />
          <span>No data to show</span>
        </div>
      ) : _movies.map(movie => (
        <div onClick={e => handleMovieSelection(e, movie)} key={movie.id} className={`w-full border ${favouriteSelected ? "border-rose-400" : "border-gray-400"} flex flex-col bg-white cursor-pointer justify-center items-center`}>
          <img src={movie.image} alt={movie.name} className="h-48 w-32 mt-4" />
          <div className="text-center px-2 py-1">{movie.name} ({movie.year})</div>
          <div className="text-center px-2 py-1 flex"><StarIcon className="h-6 w-6 px-1 text-yellow-500" /> {movie.imdbRating}</div>
        </div>
      ))}
    </section>
  )

  const renderError = () => (
    <section className="text-center">
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 bg-red-100 text-red-600" role="alert">
        <span className="font-medium">Oops!</span> We encountered a hiccup and couldn't fulfill your request at the moment.
      </div>
      <button className="mt-4 bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold py-2 px-4 rounded inline-flex items-center">
        <span onClick={() => window.location.reload()}>Refresh</span>
      </button>
    </section>
  )

  const setOpen = (attr: string) => {
    switch(attr) {
      case "year":
        setOpenYear(!openYear)
        setOpenRating(false)
        setOpenTitle(false)
        break;
      case "title":
        setOpenYear(false)
        setOpenRating(false)
        setOpenTitle(!openTitle)
        break
      case "rating":
        setOpenYear(false)
        setOpenRating(!openRating)
        setOpenTitle(false)
        break;
    }
  }

  const handleSortSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault()
    const selected = e.target.value;
    const parts = selected.split("-")
    const attr = parts[0]

    setSort({
      [attr]: selected
    })
  }

  const filter = (selected: string) => {
    const isDesc = _sort[selected] && _sort[selected].includes("desc")
    switch (selected) {
      case "year":
        const mov = [...movies]
        mov.sort((m1, m2) => {
          return isDesc ? parseInt(m2.year, 10) - parseInt(m1.year, 10) : parseInt(m1.year, 10) - parseInt(m2.year, 10)
        })
        setMovies(mov)
        break;
      case "title":
        console.log({isDesc})
        const mov1 = [...movies]
        mov1.sort((m1, m2) => {
          return isDesc ? m2.name.localeCompare(m1.name) : m1.name.localeCompare(m2.name)
        })
        setMovies(mov1)
        break;
      case "rating":
        const mov3 = [...movies]
        mov3.sort((m1, m2) => {
          return isDesc ? m2.imdbRating - m1.imdbRating : m1.imdbRating - m2.imdbRating
        })
        setMovies(mov3)
        break;
    }
    setOpen(selected)
  }

  const Sorter = ({ selected }: SorterAttributes) => (
    <div>
      <select value={_sort[selected]} onChange={handleSortSelection}>
        <option value={`${selected}-asc`}>Ascending</option>
        <option value={`${selected}-desc`}>Descending</option>
      </select>
      <button onClick={() => filter(selected)} type="button" className={`mt-2 bg-slate-300 hover:bg-slate-300 text-slate-800 py-2 px-4 rounded flex items-center h-8 text-xs`}>Apply Filter</button>
    </div>
  )

  return (
    <>
      <Header disabled={isLoading}>
        <span className="flex text-lg items-center">{favouriteSelected ? "My Favourites" : "Top 250 movies"}</span>
        <div className="flex flex-row">
          {favouriteSelected ? 
            <div className="w-6 h-6 cursor-pointer" onClick={() => setFavouriteSelected(false)}><XMarkIcon /></div> :
            <button type="button" className={`bg-rose-200 hover:bg-rose-300 text-rose-800 font-bold py-2 px-4 rounded flex items-center h-12 ${favouriteSelected ? "border-2 border-rose-400" : "border border-rose-300"} px-4 cursor-pointer hover:bg-rose-300`} onClick={() => setFavouriteSelected(!favouriteSelected)}>
              Favourites
              <HeartIcon className="px-2 h-11 w-11" />
            </button>
          }
          {!favouriteSelected && (
            <div className="ml-2 flex flex-row items-center">
              <Menu title="Year" show={openYear} onClick={() => setOpen("year")}>
                <Sorter selected="year" />
              </Menu>
              <Menu title="Title" show={openTitle} onClick={() => setOpen("title")}>
                <Sorter selected="title" />
              </Menu>
              <Menu title="Rating" show={openRating} onClick={() => setOpen("rating")}>
                <Sorter selected="rating" />
              </Menu>
            </div>
          )}
        </div>
      </Header>
      { isLoading ? <Loader /> : error ? renderError() : renderContent()}
    </>
  )
}
