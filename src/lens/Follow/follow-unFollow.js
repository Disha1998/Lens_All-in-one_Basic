import { createFollowTypedData, createUnfollowTypdeData } from "./follow-typed-data";
import { pollUntilIndexed } from "../indexer/has-transaction-been-indexed";
import { getAddress, getSigner, signedTypeData, splitSignature } from "../../services/ethers-service";
import { lensHub } from "../../services/lens-hub";
import { ethers } from "ethers";
import { LENS_FOLLOW_NFT_ABI } from "../abi/abi";
export const follow = async (profileId) => {
    await profileId.login();
    const followRequest = [
        {
            profile: profileId.id,
        }
    ];

    const result = await createFollowTypedData(followRequest);
    const typedData = result.data.createFollowTypedData.typedData;

    const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);

    const { v, r, s } = splitSignature(signature);

    const tx = await lensHub.followWithSig({
        follower: getAddress(),
        profileIds: typedData.value.profileIds,
        datas: typedData.value.datas,
        sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
        },
    });

    const indexedResult = await pollUntilIndexed(tx.hash);
    const logs = indexedResult.txReceipt.logs;
    return logs;
};


export const unFollow = async (data) => {
    await data.login()

    const result = await createUnfollowTypdeData(data.id);

    const typedData = result.data.createUnfollowTypedData.typedData;
    const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);

    const { v, r, s } = splitSignature(signature);

    // load up the follower nft contract
    const followNftContract = new ethers.Contract(
        typedData.domain.verifyingContract,
        LENS_FOLLOW_NFT_ABI,
        getSigner()
    );
    const sig = {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
    };

    // force the tx to send
    const tx = await followNftContract.burnWithSig(typedData.value.tokenId, sig);
    const indexedResult = await pollUntilIndexed(tx.hash);
    return indexedResult;
}