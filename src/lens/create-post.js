
import { signedTypeData, splitSignature, getAddress } from '../services/ethers-service';
import { createPostByDispatcher, createPostTypedData } from './create-post-type-data';
import { lensHub } from '../services/lens-hub';
import { v4 as uuidv4 } from 'uuid';
import { pollUntilIndexed } from './indexer/has-transaction-been-indexed';
import { BigNumber, utils } from 'ethers';
import uploadIpfs from '../services/ipfs'
// import { createPostByDispatcher } from './dispatcher/post-despatcher';

export const createPost = async (postData) => {

    try {
        const profileId = window.localStorage.getItem("profileId");
        // hard coded to make the code example clear
        console.log(profileId);
        if (!profileId) {
            console.log('erroer')
            return;
        }

        const address = await getAddress();
        console.log(address);
        await postData.login(address);

        var ipfsData;

        ipfsData = JSON.stringify({
            version: '2.0.0',
            metadata_id: uuidv4(),
            description: postData.description,
            content: postData.title,
            locale: 'en-US',
            external_url: null,
            mainContentFocus: "IMAGE",
            image: null,
            imageMimeType: null,
            name: postData.name ? postData.name : postData.handle,
            attributes: [],
            media: [
                {
                    item: postData.photo,
                    type: 'image/jpeg'
                }
            ],
            appId: 'drvlens',
        });


        const ipfsResult = await uploadIpfs(ipfsData);

        const createPostRequest = {
            profileId,
            contentURI: `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`,
            collectModule: {
                limitedFeeCollectModule: {
                    collectLimit:postData.number,
                    amount: {
                        currency: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
                        value: postData.amount
                    },
                    recipient: address,
                    referralFee: 0,
                    followerOnly: false
                }
            },
            referenceModule: {
                followerOnlyReferenceModule: false
            }
        };
        const result = await createPostTypedData(createPostRequest);

        const typedData = result.data.createPostTypedData.typedData;
        console.log('typedData', typedData);
        const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);

        const { v, r, s } = splitSignature(signature);

        const tx = await lensHub.postWithSig({
            profileId: typedData.value.profileId,
            contentURI: typedData.value.contentURI,
            collectModule: typedData.value.collectModule,
            collectModuleInitData: typedData.value.collectModuleInitData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline,
            },
        });
        const indexedResult = await pollUntilIndexed(tx.hash);
        console.log(indexedResult);
        const logs = indexedResult.txReceipt.logs;
        const topicId = utils.id(
            'PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)'
        );

        const profileCreatedLog = logs.find((l) => l.topics[0] === topicId);

        let profileCreatedEventLog = profileCreatedLog.topics;
        const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0];

        return result.data;

    } catch (error) {
        console.log('error------->>', error);
    }

}

export const createPostViaDispatcher = async (postData) => {
    try {
        const profileId = window.localStorage.getItem("profileId");
        // hard coded to make the code example clear
        if (!profileId) {
            console.log('Please login first!');
            return;
        }

        const address = await getAddress();

        var ipfsData;

        await postData.login(address);
        ipfsData = JSON.stringify({
            version: '2.0.0',
            metadata_id: uuidv4(),
            description: postData.description,
            content: postData.title,
            locale: 'en-US',
            external_url: null,
            contentWarning: null,
            tags: postData.tags,
            image: null,
            imageMimeType: null,
            name: postData.name ? postData.name : postData.handle,
            attributes: [],
            mainContentFocus: "IMAGE",
            media: [
                {
                    item: postData.photo,
                    type: 'image/jpeg'
                }
            ],
            appId: 'drvlens',
            animation_url: null,
        });

        const ipfsResult = await uploadIpfs(ipfsData);

        const createPostRequest = {
            profileId,
            contentURI: `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`,
            collectModule: {
                limitedFeeCollectModule: {
                    collectLimit:postData.number,
                    amount: {
                        currency: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
                        value: postData.amount
                    },
                    recipient: address,
                    referralFee: 0,
                    followerOnly: false
                }
            },
            referenceModule: {
                followerOnlyReferenceModule: false
            }
        };
        const result = await createPostByDispatcher(createPostRequest);
        const indexedResult = await pollUntilIndexed(result?.data?.createPostViaDispatcher?.txHash);
        console.log(indexedResult, "indexedResult");
        const logs = indexedResult.txReceipt.logs;
        const topicId = utils.id(
            'PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)'
        );
        const profileCreatedLog = logs.find((l) => l.topics[0] === topicId);
        let profileCreatedEventLog = profileCreatedLog.topics;
        const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0];
        return result;
    } catch (err) {
        return err;
    }
}