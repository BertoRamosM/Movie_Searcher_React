import { useRef } from "react";
import { searchMovies } from "../services/movies";
import { useState, useMemo } from "react";

export function useMovies({ search , sort}) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const previousSearch = useRef(search)



  const getMovies = async () => {
    if (search === previousSearch.current) return
    try {
      setLoading(true);
      setError(null);

      const newMovies = await searchMovies({ search });
      setMovies(newMovies);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

/* without useMemo <--
  const sortedMovies = sort
    ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
    : movies */
  
  //useMemo its used to memorize the result of the sort and keep it save to avoid re render the component on every little change
  const sortedMovies = useMemo(() => {
    console.log("sorted movies")
    return sort 
    ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
    :movies
  },[sort, movies])

    return { movies: sortedMovies, getMovies, loading  };
}
