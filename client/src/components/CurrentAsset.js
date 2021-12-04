import React from 'react';

const CurrentAsset = (props) => {
    return (
        props.asset !== null ? (
            <div>
                <p>Name: {props.asset[0]}</p>
                <p>Serial: {props.asset[1]}</p>
                <p>Value: {props.asset[2]}</p>
                <p>Buyer: {props.asset[3]}</p>
                <p>Owner: {props.asset[4]}</p>
            </div>)
    
            : null
    )
}

export default CurrentAsset;