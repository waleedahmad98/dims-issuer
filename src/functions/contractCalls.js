import { openContractCall } from "@stacks/connect";
import {
    stringAsciiCV,
    standardPrincipalCV
} from "@stacks/transactions";


const issueNFT = async (owner, hash, degree, link, holderPubKey) => {
    let resp = {};

    const functionArgs = [
        standardPrincipalCV(owner),
        stringAsciiCV(hash),
        stringAsciiCV(degree),
        stringAsciiCV(link),
        stringAsciiCV(holderPubKey)
      ];

    const options = {
        contractAddress: "ST2Q13EZ2EJYQRPMS19N5JV7SG1Q4MMDN1HVWEP9",
        contractName: "degree-minter-3",
        functionName: "mint",
        functionArgs,
        appDetails: {
            name: "DIMS Issuer",
            icon: window.location.origin + "/my-app-logo.svg",
        },
        onFinish: (data) => {
            resp = {"txlink":`https://explorer.stacks.co/txid/${data.txId.txid}?chain=testnet`, "txid":data.txId.txid, "status":200};
        },
    };
    await openContractCall(options)
    return resp;
};

export { issueNFT };