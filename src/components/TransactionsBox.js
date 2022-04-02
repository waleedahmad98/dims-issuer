import React from 'react';

export default function TransactionsBox(props) {
    return (
        <div>
            <div className='content-container'>

                <div>
                    <h3 className='mb-4'>Issuing History</h3>
                    <h5>View all transactions made here. Click on any transaction to view its details on Stacks Explorer.</h5>

                    <div className='content-container' style={{ backgroundColor: "white" }}>
                        {console.log(props)}
                        <table>
                            <tbody>
                                {props.data.map((t) => <tr>
                                    <td>
                                        {t.details !== undefined ? t.details.function_args[0].repr : <></>}
                                    </td>
                                    <td>
                                    {t.details !== undefined ? t.details.function_args[2].repr : <></>}
                                    </td>
                                    <td>
                                        <button className='btn1 btn-sm' onClick={()=>window.open(t.txlink, "_blank")}>View on Explorer</button>
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
        </div>);
}
