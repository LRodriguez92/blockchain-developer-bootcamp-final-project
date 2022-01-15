import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";

const FetchAsset = (props) => {
    
    const [token, setToken] = useState(0);

    const handleChange = (e) => {
        setToken(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Fetching...");
        props.fetchAsset(token);
    }

    return (
        <div className="fetch-asset">
            <h1>Search Assets</h1>
            <form className="form" onSubmit={handleSubmit}>
                <input className="form-input" name="token" type="number" placeholder="Token ID #" onChange={handleChange} />
                <input className="form-button" type="submit" value="Search"/>
            </form>
        </div>
    )
}

export default FetchAsset;