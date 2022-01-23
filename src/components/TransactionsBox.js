import React from 'react';

export default function TransactionsBox(props) {
    return (
        <div>
            <div className='content-container'>

                <div>
                    <h3 className='mb-4'>Issuing History</h3>
                    <h5>View all transactions made here. Click on any transaction to view its details on Stacks Explorer.</h5>

                    <div className='content-container' style={{ backgroundColor: "white" }}>

                        {props.data.map((t, i) => <a  style={{color: "black"}} href={t.txlink} target="_blank">{t.txid}<br/></a>)}

                    </div>

                </div>
            </div>
        </div>);
}
