import React from 'react';

const CurrentAsset = (props) => {

    const handleBuy = () => {
        props.buyAsset(props.asset[0])
    }

    const handleReceive = () => {
        props.receiveAsset(props.asset[0])
    }

    const handleShip = () => {
        props.shipAsset(props.asset[0])
    }

    return (
        // Checks if an asset was fetched
        

        props.asset !== null ? (
            <div>
                <img src={props.asset[7]}/>
                <p>Token ID: {props.asset[0]}</p>
                <p>Name: {props.asset[1]}</p>
                <p>Serial: {props.asset[2]}</p>
                <p>Value: {props.asset[3]}</p>
                <p>Buyer: {props.asset[4]}</p>
                <p>Owner: {props.asset[5]}</p>
                <p>State: {props.asset[6]}</p>
                

                {/* Checks if the connected acount is not the owner of the asset and displays the buy button */}
                { props.account !== props.asset[5] && props.asset[6] === '0' ? <button onClick={handleBuy}>Purchase</button> : null}

                {/* Only the owner can see this AND the asset's state is "PendingTransfer*/}
                {props.account === props.asset[5] && props.asset[6] === '1' ? <button onClick={handleShip}>Confirm Shipment</button> : null}
                
                {/* Only the buyer can see this AND the asset's state is "TransferringOwnership*/}
                {props.account === props.asset[4] && props.asset[6] === '2' ? <button onClick={handleReceive}>Confirm you have received the asset</button> : null}
            

            </div>)
    
        :
            null
    )
}

export default CurrentAsset;