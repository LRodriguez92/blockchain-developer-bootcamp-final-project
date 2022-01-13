import React from 'react';

const CurrentAsset = (props) => {

    const handleBuy = () => {
        props.buyAsset(props.asset[1])
    }

    const handleReceive = () => {
        props.receiveAsset(props.asset[1])
    }

    return (
        // Checks is an asset was fetched
        props.asset !== null ? (
            <div>
                <p>Name: {props.asset[0]}</p>
                <p>Serial: {props.asset[1]}</p>
                <p>Value: {props.asset[2]}</p>
                <p>Buyer: {props.asset[3]}</p>
                <p>Owner: {props.asset[4]}</p>

                {/* Checks if the connected acount is not the owner of the asset and displays the buy button */}
                { props.account !== props.asset[4] ? <button onClick={handleBuy}>Buy Asset</button> : null}
                
                {/* TODO: Make sure only the buyer can see this AND the asset's state is "transferringOwnership*/}
                <button onClick={handleReceive}>Confirm you have received the asset</button>
            </div>)
    
        :
            null
    )
}

export default CurrentAsset;