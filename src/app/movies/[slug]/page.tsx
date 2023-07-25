"use client";

import { useContext, useState } from "react"
import Header from "../../components/header"
import { StarIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { AppContext } from "../../layout"
import { useRouter } from "next/navigation";
import { TMovie } from "../../types";
import { useEffect } from "react";
import { FavouriteStorage } from "../../utils";

type Tag = {
  key: keyof TMovie;
  label: string;
  icon?: React.ReactNode;
}

const displayAttributes: Tag[] = [
  { key: "id", label: "ID"},
  { key: "name", label: "Title"},
  { key: "year", label: "Year"},
  { key: "imdbRating", label: "Rating", icon: StarIcon},
]

export default function Page() {
  const [isFavourite, setIsFavourite] = useState(false)
  const { ctx } = useContext(AppContext)
  const { movie } = ctx || {};
  const router = useRouter()

  if (!movie) {
    router.push("/")
    return
  }

  useEffect(() => {
    setIsFavourite(FavouriteStorage.get().some(m => m.id === movie.id))
  })

  const toggleFavourite = () => {
    if (isFavourite) {
      FavouriteStorage.remove(movie)
    } else {
      FavouriteStorage.add(movie)
    }
    setIsFavourite(!isFavourite)
  }

  return (
    <>
      <Header disabled={false}>
        <div className="flex text-lg justify-between w-full items-center">
          <div>{movie.name}</div>
          <div className="w-6 h-6 cursor-pointer" onClick={() => router.back()}><XMarkIcon /></div>
        </div>
      </Header>
      <section className="flex flex-col self-start w-full py-8 h-screen items-center">
        <div className="bg-white w-full py-8 h-screen mt-16 flex flex-col items-center">
          <img src={movie.image} alt={movie.name} className="h-48 w-32" />
          <table className="table-auto mt-8">
            <tbody>
              {
                displayAttributes.map(da => (
                  <tr key={da.key}>
                    <td><strong>{da.label}</strong></td>
                    <td className="px-8 flex flex-row items-center">
                      {da.icon ? <da.icon className="pr-1 h-6 w-6 text-yellow-500" /> : null}
                      {movie[da.key]}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          <button onClick={() => toggleFavourite()} className="mt-4 bg-rose-200 hover:bg-rose-300 text-rose-800 font-bold py-2 px-4 rounded inline-flex items-center">
            {isFavourite ? `Remove from` : `Add to`} Favourites
          </button>
        </div>
      </section>
    </>
  )
}