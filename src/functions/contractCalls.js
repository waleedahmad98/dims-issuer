import { openContractCall } from "@stacks/connect";
import {
    uintCV,
    intCV,
    bufferCV,
    stringAsciiCV,
    stringUtf8CV,
    standardPrincipalCV,
    trueCV,
} from "@stacks/transactions";


const issueNFT = async (owner, link, hash, degree) => {
    const resp = null;

    const functionArgs = [
        standardPrincipalCV(owner),
        bufferCV(Buffer.from(hash)),
        stringAsciiCV(degree),
        stringAsciiCV(link)
      ];

    const options = {
        contractAddress: "ST3NXW8T49WPYFX9R3XVJE748HFSGR2VT9ETSBBB5",
        contractName: "degree-minter",
        functionName: "mint",
        functionArgs,
        appDetails: {
            name: "DIMS Issuer",
            icon: window.location.origin + "/my-app-logo.svg",
        },
        onFinish: (data) => {
            resp = data;
            console.log("Stacks Transaction:", data.stacksTransaction);
            console.log("Transaction ID:", data.txId);
            console.log("Raw transaction:", data.txRaw);
        },
    };
    await openContractCall(options);

    return resp;
};

export { issueNFT };