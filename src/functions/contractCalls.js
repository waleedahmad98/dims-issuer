import { openContractCall } from "@stacks/connect";
import {
    stringAsciiCV,
    standardPrincipalCV
} from "@stacks/transactions";


const issueNFT = async (owner, hash, degree, link) => {
    let resp = {};

    const functionArgs = [
        standardPrincipalCV(owner),
        stringAsciiCV(hash),
        stringAsciiCV(degree),
        stringAsciiCV(link)
      ];

    const options = {
        contractAddress: "ST3NXW8T49WPYFX9R3XVJE748HFSGR2VT9ETSBBB5",
        contractName: "degree-minter-2",
        functionName: "mint",
        functionArgs,
        appDetails: {
            name: "DIMS Issuer",
            icon: window.location.origin + "/my-app-logo.svg",
        },
        onFinish: (data) => {
            resp = {"txlink":`https://explorer.stacks.co/txid/${data.txId}?chain=testnet`, "txid":data.txId, "status":200};
        },
    };
    await openContractCall(options)
    console.log(resp)
    return resp;
};

export { issueNFT };