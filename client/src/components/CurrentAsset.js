import React from 'react';

const CurrentAsset = (props) => {
    return (
        // Checks is an asset was fetched
        props.asset !== null ? (
            <div>
                <p>Name: {props.asset[0]}</p>
                <p>Serial: {props.asset[1]}</p>
                <p>Value: {props.asset[2]}</p>
                <p>Buyer: {props.asset[3]}</p>
                <p>Owner: {props.asset[4]}</p>

                {/* Checks if the connected acount is not the owner of the asset */}
                { props.account !== props.asset[4] ? <button>Buy Asset</button> : null}
            </div>)
    
        :
            null
    )
}

export default CurrentAsset;