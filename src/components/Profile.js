import React from 'react';
import { Storage } from "@stacks/storage";
import { useState, useEffect } from 'react';
import {
  Person, transactions,
} from 'blockstack';
import { issueNFT } from '../functions/contractCalls';
import MD5 from 'crypto-js/md5';
import TransactionsBox from './TransactionsBox';
import { BASE_API_URL, CHAIN_TYPE } from '../config';
import axios from 'axios';

export const Profile = ({ userData, userSession, handleSignOut }) => {
  const [issuingMode, setIssuingMode] = useState(0);
  const [file, setFile] = useState("");
  const [degree, setDegree] = useState("");
  const [owner, setOwner] = useState("");
  const [issuingAlert, setIssuingAlert] = useState("");
  const [allTransactions, setAllTransactions] = useState([]);
  const [stx, setStx] = useState("")
  const [reveal, setReveal] = useState(0)

  const person = new Person(userData.profile);
  const storage = new Storage({ userSession });

  const setCustomAlert = (setter, type, text) => {
    let customClass = `alert alert-${type} alert-dismissible fade show`;
    setter(<div class={customClass} role="alert">
      {text}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => { setter("") }}></button>
    </div>)
  }

  useEffect(() => {
    try {
      let principal = null;
      if (CHAIN_TYPE === 'testnet')
        principal = person._profile.stxAddress.testnet
      else
        principal = person._profile.stxAddress.mainnet

      axios.get(`${BASE_API_URL}/extended/v1/address/${principal}/transactions?unanchored=true`).then((res) => {
        axios.get(`${BASE_API_URL}/extended/v1/address/${principal}/transactions?limit=${res.data.total}&unanchored=true`).then((res)=>{
          console.log(res.data)
          let transactions = res.data.results.map(r=>{
            return {"txid":r.tx_id, "txlink":`https://explorer.stacks.co/txid/${r.tx_id}?chain=${CHAIN_TYPE}`, "time":r.burn_block_time_iso,"details":r.contract_call}
          })
          setAllTransactions(transactions)
        })
      })
    }
    catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    try {
      let principal = null;
      if (CHAIN_TYPE === 'testnet')
        principal = person._profile.stxAddress.testnet
      else
        principal = person._profile.stxAddress.mainnet

      axios.get(`${BASE_API_URL}/extended/v1/address/${principal}/stx`).then((res) => {
        setStx((parseInt(res.data.balance)/1000000).toString())
      })
    }
    catch (err) {
      console.log(err)
    }
  }, [])

  const issueCredential = (e) => {
    e.preventDefault();

    if (owner === "" || degree === "" || file === "") {
      setCustomAlert(setIssuingAlert, 'danger', 'Fields can not be empty!')
    }
    else {
      const options = {
        encrypt: false,
      };
      storage
        .putFile(file.name, file, options)
        .then(async (r) => {
          let fileText = await file.text()
          let resp = await issueNFT(owner, MD5(fileText).toString(), degree, r)
          if (resp.status === 200) {
            setCustomAlert(setIssuingAlert, 'success', 'The document has successfully been stored and secured on the Blockchain as a Non-Fungible Token.')
          }
          else {
            setCustomAlert(setIssuingAlert, 'danger', 'There was a problem in issuing the document.')
          }

        });

    }
  }

  return (
    <div className="container text-start">
      <div className='d-flex flex-row justify-content-between mt-5'>
        {reveal === 0 ? <button className='reveal-btn' onClick={()=>{setReveal(1)}}>REVEAL ADDRESS</button> : <button className='reveal-btn' onClick={()=>{
          setReveal(0);
          
          }}> {CHAIN_TYPE === "testnet" ? person._profile.stxAddress.testnet : person._profile.stxAddress.mainnet} </button>}
        {/* <h3>Welcome, {CHAIN_TYPE === "testnet" ? person._profile.stxAddress.testnet : person._profile.stxAddress.mainnet}</h3> */}
        <div>
        <button className='reveal-btn' disabled>STX Balance: {stx}</button>
        <button type="button" className='btn1 btn-md ms-2' onClick={handleSignOut}> Sign Out</button>
        </div>
        
      </div>

      <div className='content-container'>
        {console.log(userData)}
        {console.log(person)}
        {issuingAlert !== "" ? <>{issuingAlert}</> : <></>}
        <div>
          {issuingMode === 0 ?
            <>
              <h3 style={{fontWeight:"700"}}>Issue a new credential</h3>
              <h4 className='mt-4' style={{fontWeight:"600"}}>What's this?</h4>
              <h5>By issuing a credential through DIMS, you take advantage of safe and distributed cloud platforms which help store the information you wish to share with your clients in a much secure manner than many traditional methods out there.</h5>
              <button className='btn1 btn-md mt-5' type="button" data-bs-toggle="modal" data-bs-target="#uploadModal" onClick={() => {
                if (issuingMode === 0)
                  setIssuingMode(1)
              }}>Issue a new credential</button> </> :
            <>
              <h6>Enter the following details and pick the credential you want to upload from your local storage.</h6>


              <form onSubmit={issueCredential}>
                <div className="mb-3">
                  <label htmlFor="owner" className="form-label">Owner's Address</label>
                  <input type="text" className="form-control" id="owner" value={owner} onChange={(e) => { setOwner(e.target.value) }} />
                </div>
                <div className="mb-3">
                  <label htmlFor="degree" className="form-label">Degree Name</label>
                  <input type="text" className="form-control" id="degree" value={degree} onChange={(e) => { setDegree(e.target.value) }} />
                </div>

                <input type="file" id="file" onChange={(e) => { setFile(e.target.files[0]) }} /><br />
                <button type="submit" className='btn1 btn-sm mt-5'>Issue</button>
                <button className='btn1 btn-sm mt-5 ms-3' style={{backgroundColor:"maroon"}} type="button" onClick={() => {
                  if (issuingMode === 1)
                    setIssuingMode(0)
                  setIssuingAlert("")
                }}>Cancel</button>
              </form>

            </>

          }

        </div>
      </div>

      <TransactionsBox data={allTransactions} />
    </div>
  );
}

export default Profile
