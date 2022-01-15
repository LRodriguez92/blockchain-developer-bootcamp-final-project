import React from 'react';
import { FaEthereum } from "react-icons/fa";

const CurrentAsset = (props) => {

    const handleBuy = () => {
        props.buyAsset(props.asset[0])
    }

    const handleReceive = () => {
        props.receiveAsset(props.asset[0])
    }

    const handleShip = () => {
        props.shipAsset(props.asset[0]);
    }

    const handleBurn = () => {
        props.burnAsset(props.asset[0])
    }

    return (
        // Checks if an asset was fetched
        

        props.asset !== null ? (
            <div className="asset-container">
                <div className="asset">
                    <img src={props.asset[7]}/>
                    <div className="description">
                        <div className="name-value">
                            <h3>{props.asset[1]}</h3>
                            <h3>{props.asset[3]} <FaEthereum /></h3>
                        </div>
                        <div className="serial-state">
                            <h3>Serial #: {props.asset[2]}</h3>
                            <h3>{
                                props.asset[6] === '0' ? 'In Possession' : 
                                props.asset[6] === '1' ? 'Awaiting Shipment' : 
                                props.asset[6] === '2' ? 'Shipped' : 
                                props.asset[6] === '3' ? 'Reported lost or stolen' : 
                                null
                            }</h3>
                        </div>
                        <div className="owner-buyer">
                            <h3>Owner: {props.asset[5]}</h3>
                            <h3>{props.asset[4] !== "0x0000000000000000000000000000000000000000" ? 'Buyer: ' +  props.asset[4] : null}</h3>
                        </div>
                    </div>
                    

                    {/* Checks if the connected acount is not the owner of the asset and displays the buy button */}
                    { props.account !== props.asset[5] && props.asset[6] === '0' ? <button className="asset-button" onClick={handleBuy}>Purchase</button> : null}

                    {/* Only the owner can see this AND the asset's state is "PendingTransfer*/}
                    {props.account === props.asset[5] && props.asset[6] === '1' ? <button className="asset-button" onClick={handleShip}>Confirm Shipment</button> : null}
                    
                    {/* Only the buyer can see this AND the asset's state is "TransferringOwnership*/}
                    {props.account === props.asset[4] && props.asset[6] === '2' ? <button className="asset-button" onClick={handleReceive}>Confirm you have received the asset</button> : null}
                
                    {/* Only the owner can see this AND the asset's state is "InPosession*/}
                    {props.account === props.asset[5] && props.asset[6] === '0' ? <button className="asset-button" onClick={handleBurn}>Burn Asset</button> : null}
                </div>

            </div>)
    
        :
            null
    )
}

export default CurrentAsset;