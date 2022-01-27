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
            console.log("test2", data.txId)
            resp = {"txlink":`https://explorer.stacks.co/txid/${data.txId.txid}?chain=testnet`, "txid":data.txId.txid, "status":200};
        },
    };
    await openContractCall(options)
    return resp;
};

export { issueNFT };