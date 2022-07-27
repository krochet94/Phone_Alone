import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Search = () => {
  const [data, setData] = useState({
    keyword: ""
  });
  const navigate = useNavigate();
  const searchHandler = (e) => {
    e.preventDefault();
    data.currentPage = 1;
    if (data.keyword.trim()) {
      setData({ ...data });
      navigate(`/search/${data.keyword}`, { state: { ...data } });
    } else {
      navigate("/", { state: { ...data } });
    }

    /*  if (keyword.trim()) {
      navigate(`/search/${keyword}`, {state: keyword});
    } else {
      navigate("/", {state:''});
    } */
  };
  return (
    <form onSubmit={searchHandler}>
      <div class="input-group">
        <input
          type="text"
          id="search_field"
          class="form-control"
          placeholder="Search Product..."
          onChange={
            (e) => {
              data.keyword = e.target.value;
              setData({ ...data });
            } /* setKeyword(e.target.value) */
          }
        />
        <div class="input-group-append">
          <button id="search_btn" class="btn">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Search;
