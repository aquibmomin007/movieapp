import { NextResponse, NextRequest } from "next/server";
import querystring from 'querystring';
import url from 'url';
import fetch from 'node-fetch';
import { TMovieResponse, TMovie } from "../../types";

export async function GET(req: NextRequest) {
  const query = url.parse(req.url).query
  const pairs = querystring.parse(query as string)
  
  const movieid = pairs["id"]
  if (movieid) {
    return NextResponse.json({})
  }

  const resp = await fetch(`https://raw.githubusercontent.com/movie-monk-b0t/top250/master/top250.json`)
  const data = await resp.json();
  
  const result: TMovie[] = (data as TMovieResponse).map(t => ({
    id: t.url.slice(1).replace("/", "-"),
    name: t.name,
    year: t.datePublished.split('-')[0],
    image: t.image,
    imdbRating: t.aggregateRating.ratingValue
  }))
  return NextResponse.json(result)
}