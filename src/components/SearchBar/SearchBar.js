import React, { useState } from "react";
import './SearchBar.css'

function SearchBar({ onSearch }) {
    const [term, setTerm] = useState('')

    const handleSearch = () => {
        onSearch(term);
    }

    const handleTermChange = (e) => {
        setTerm(e.target.value);
    }

    return (
        <div className="SearchBar">
            <input placeholder="Enter A Song, Album, or Artist" onChange={handleTermChange} defaultValue={sessionStorage.getItem('term')} />
            <button className="SearchButton" onClick={handleSearch}>SEARCH</button>
        </div>
    )

}

export default SearchBar;