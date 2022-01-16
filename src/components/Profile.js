import React, { Component } from 'react';
import { Storage } from "@stacks/storage";
import { useState } from 'react';
import {
  Person,
} from 'blockstack';
import { issueNFT } from '../functions/contractCalls';
import sha256 from 'crypto-js/sha256';

export const Profile = ({ userData, userSession, handleSignOut }) => {
  const [issuingMode, setIssuingMode] = useState(0);
  const [file, setFile] = useState("");
  const [degree, setDegree] = useState("");
  const [owner, setOwner] = useState("");

  const person = new Person(userData.profile);
  const storage = new Storage({ userSession });

  const issueCredential = (e) => {
    e.preventDefault();

    if (owner === "" || degree === "" || file === "") {
      console.log(process.env.REACT_APP_TEST)
      alert("Field's can not be empty!");
    }
    else {
      const options = {
        encrypt: false,
      };

      let fileUrl = storage
        .putFile(file.name, file, options)
        .then((r) => {
          console.log(r)
        });


      console.log(owner, degree)
      console.log(sha256(file).toString())
      let resp = issueNFT(owner, "test", sha256(file).toString(), degree)
      console.log(resp)

    }


    // console.log(fileUrl)
  }

  return (
    <div className="container text-start">
      <div className='d-flex flex-row justify-content-between mt-5'>
        <h3 className='osb'>Welcome, {person._profile.stxAddress.mainnet}</h3>
        <button type="button" className='btn btn-primary ms-2' onClick={handleSignOut}> Sign Out</button>
      </div>

      <div className='content-container'>
        {console.log(userData)}
        {console.log(person)}
        <div>
          {issuingMode === 0 ?
            <>
              <h3>Issue a new credential.</h3>
              <h5>By issuing a credential through DIMS, you take advantage of safe and distributed cloud platforms which help store the information you wish to share with your clients in a much secure manner than many traditional methods out there.</h5>
              <button className='btn btn-primary mt-5' type="button" data-bs-toggle="modal" data-bs-target="#uploadModal" onClick={() => {
                if (issuingMode === 0)
                  setIssuingMode(1)
              }}>Issue a new credential</button> </> :
            <>
              <h5>Pick the credential you want to upload from your local storage.</h5>


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
                <button type="submit" className='btn btn-primary mt-5'>Issue</button>
                <button className='btn btn-danger mt-5 ms-3' type="button" onClick={() => {
                  if (issuingMode === 1)
                    setIssuingMode(0)
                }}>Cancel</button>
              </form>

            </>

          }

        </div>
      </div>
    </div>
  );
}

export default Profile
