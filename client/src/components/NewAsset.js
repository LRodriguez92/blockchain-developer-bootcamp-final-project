import React, { useState } from 'react';

const NewAsset = (props) => {
    
    const [newAsset, setNewAsset] = useState({
        name: '',
        serial: 0,
        value: 0,
        uri: ''
      });

    const handleChange = (e) => {
        setNewAsset({
            ...newAsset,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting...");
        props.createAsset(newAsset);
    }

    return (
        <div>
            <h1>New Asset</h1>
            <form onSubmit={handleSubmit}>
                <input name="name" type="text" placeholder="Asset name" onChange={handleChange} />
                <input name="serial" type="number" placeholder="Serial #" onChange={handleChange} />
                <input name="value" type="number" placeholder="Value" onChange={handleChange} />
                <input name="uri" type="text" placeholder="Image URI" onChange={handleChange} />
                <input type="submit" value="Create Asset"/>
            </form>
        </div>
    )
}

export default NewAsset;