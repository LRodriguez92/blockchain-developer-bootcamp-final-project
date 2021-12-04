import React, { useState } from 'react';

const FetchAsset = (props) => {
    
    const [serial, setSerial] = useState(0);

    const handleChange = (e) => {
        setSerial(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Fetching...");
        props.fetchAsset(serial);
    }

    return (
        <div>
            <h1>New Asset</h1>
            <form onSubmit={handleSubmit}>
                <input name="serial" type="number" placeholder="Serial #" onChange={handleChange} />
                <input type="submit" value="Fetch Asset"/>
            </form>
        </div>
    )
}

export default FetchAsset;