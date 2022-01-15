import React, { useState } from 'react';

const NewAsset = (props) => {
    
    const [newAsset, setNewAsset] = useState({
        name: '',
        serial: 0,
        value: '',
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
        console.log("Submitting...", typeof newAsset.value);
        // newAsset.value = parseFloat(newAsset.value);

        // console.log("float value: ", newAsset.value);

        if (isNaN(newAsset.value)) {
            console.error("The value you entered is not a number!")
        }
        props.createAsset(newAsset);
    }

    return (
        <div>
            <h1>New Asset</h1>
            <form onSubmit={handleSubmit}>
                <input name="name" type="text" placeholder="Asset name" onChange={handleChange} />
                <input name="serial" type="number" placeholder="Serial #" onChange={handleChange} />
                <input name="value" type="text" placeholder="Value" onChange={handleChange} />
                <input name="uri" type="text" placeholder="Image URI" onChange={handleChange} />
                <input type="submit" value="Create Asset"/>
            </form>
        </div>
    )
}

export default NewAsset;