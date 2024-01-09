import { useState } from "react";
import "./App.css";
import { Movies } from "./components/Movies";
import { useMovies } from "./hooks/useMovies";
import { useEffect, useRef } from "react";

function useSearch() {
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  useEffect(() => {
    //if empty first time dont show error
    if (isFirstInput.current) {
      isFirstInput.current = search === "";
      return;
    }
    //if empty
    if (search === "") {
      setError("No searching parameters");
      return;
    }
    //if first char its space, avoid
    if (search.startsWith(" ")) return;
    //if too short
    if (search.length < 3) {
      setError("Finish typing the name of the movie");
      return;
    }
    //if only numbers
    if (search.match(/^(?![0-9]+$).*$/)) {
      setError("Only numbers not allowed");
    }
    setError(null);
    return;
  }, [search]);

  return { search, updateSearch, error };
}

function App() {
  const [sort, setSort] = useState(false);
  const { search, updateSearch, error } = useSearch();
  const { movies, getMovies, loading } = useMovies({ search, sort });

  const handleSort = () => {
    setSort(!sort);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //store the value of the input fields of the form, without the need of use hooks like useRef  <----
    //const { query } = Object.fromEntries(
    //new window.FormData(e.target)
    //)
    getMovies();
  };

  //set the value of the state as the change in the input field of the form, this way its slower because it searches on every change of the state, so on EVERY single keyboard tap of the user
  const handleChange = (e) => {
    updateSearch(e.target.value);

    //this is from the useEffect. the code would work too, but here we are using the state, that its async, so the value could be stored not in time. To fix this we could declare a new variable, for example, newQuery and not the state itself
    /* if (query === "") {
        setError("No searching parameters");
        return;
      }
      if (query.length < 3) {
        setError("Finish typing the name of the movie");
      }
      if (query.match(/^(?![0-9]+$).*$/)) {
        setError("Only numbers not allowed");
      }
      setError(null); */
  };

  //controlled way of deal with form

  return (
    <div className="page">
      <header>
        <h1>Movie Searcher</h1>
        <form onSubmit={handleSubmit} className="form">
          <input
            //to use the handlesubmit from above, we need to set a name for the input we want to store
            name="query"
            value={search}
            onChange={handleChange}
            type="text"
            placeholder="The Matrix, Pulp Fiction..."
          />
          <input type="checkbox" onChange={handleSort} checked={sort} />
          <button type="submit">Search</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </header>

      <main>{loading ? <p>Loading...</p> : <Movies movies={movies} />}</main>
    </div>
  );
}

export default App;
