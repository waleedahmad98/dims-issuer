import React, { useState } from 'react';
import Fuse from 'fuse.js';
import { getAddressFromPrivateKey } from '@blockstack/stacks-transactions';

export default function TransactionsBox(props) {
    const [searches, setSearches] = useState(props.data)
    const [searchText, setSearchText] = useState("")
    const [displayMode, setDisplayMode] = useState(0)

    const fuzzySearch = (query) => {
        const fuse = new Fuse(props.data, {
            keys: ["txid", "details.function_args.repr", "time"]
        });
        const result = fuse.search(query);
        setSearches(result)
    }

    const getDateTime = (date) => {
        if (date === "")
            return 'Mining in Progress'
        var localDate = new Date(date).toString()
        localDate = localDate.split(" ")
        return `${localDate[1]} ${localDate[2]} ${localDate[3]} (${localDate[4]})`
    }

    return (
        <div>
            <div className='content-container'>
                <div>
                    <h3 className='mb-4' style={{ fontWeight: "700" }}>Issuing History</h3>
                    <h5>View all transactions made here. Click on any transaction to view its details on Stacks Explorer.</h5>

                    <input className='searchbar' type="text" placeholder='Search transactions' value={searchText} onChange={(e) => {
                        setSearchText(e.target.value)
                        if (e.target.value === "") {
                            setDisplayMode(0)
                        }
                        else {
                            setDisplayMode(1)
                            fuzzySearch(e.target.value)
                        }
                    }} />
                    <div className='content-container' style={{ backgroundColor: "white" }}>
                        {console.log("test", searches)}

                        <table className='table'>
                            <thead>
                                <tr>
                                    <th scope="col">Receiver Address</th>
                                    <th scope="col">Credential Name</th>
                                    <th scope="col">Time of Transaction</th>
                                    <th scope="col">Blockchain Link</th>
                                </tr>
                            </thead>
                            {displayMode === 0 ? <tbody>
                                {props.data.map((t) => <tr>
                                    <td>
                                        {t.details !== undefined ? t.details.function_args[0].repr : <></>}
                                    </td>
                                    <td>
                                        {t.details !== undefined ? t.details.function_args[2].repr.replace('"', '').replace('"','') : <></>}
                                    </td>
                                    <td>
                                        {t.time !== undefined ? getDateTime(t.time) : <></>}
                                    </td>
                                    <td>
                                        <button className='btn1 btn-sm' onClick={() => window.open(t.txlink, "_blank")}>View on Explorer</button>
                                    </td>
                                </tr>)}
                            </tbody> :
                                <tbody>
                                    {searches.map((t) => <tr>
                                        <td>
                                            {t.item.details !== undefined ? t.item.details.function_args[0].repr : <></>}
                                        </td>
                                        <td>
                                            {t.item.details !== undefined ? t.item.details.function_args[2].repr.replace('"', '').replace('"','') : <></>}
                                        </td>
                                        <td>
                                            {t.item.time !== undefined ? getDateTime(t.item.time) : <></>}
                                        </td>
                                        <td>
                                            <button className='btn1 btn-sm' onClick={() => window.open(t.item.txlink, "_blank")}>View on Explorer</button>
                                        </td>
                                    </tr>)}
                                </tbody>}

                        </table>

                    </div>

                </div>
            </div>
        </div>);
}
