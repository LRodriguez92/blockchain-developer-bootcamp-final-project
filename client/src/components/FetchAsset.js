import React, { useState } from 'react';

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
        <div>
            <h1>Fetch Asset</h1>
            <form onSubmit={handleSubmit}>
                <input name="token" type="number" placeholder="Token ID #" onChange={handleChange} />
                <input type="submit" value="Fetch Asset"/>
            </form>
        </div>
    )
}

export default FetchAsset;