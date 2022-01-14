import React, { Component } from 'react';
import { useConnect } from "@stacks/connect-react";

export const Signin = () => {
  const { doOpenAuth } = useConnect();

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <h1 className="landing-heading mt-5">Welcome to the Digital Identity Management System Issuing Portal!</h1>
      <p className="lead">
        <button
          className="btn btn-primary btn-lg mt-5"
          id="signin-button"
          onClick={() => doOpenAuth()}
        >
          Sign In with Blockstack
        </button>
      </p>
    </div>
  );
}

export default Signin;
