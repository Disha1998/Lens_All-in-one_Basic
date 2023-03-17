
import { gql } from '@apollo/client'
import { profileById } from '../context/query';
import { apolloClient } from '../services/ApolloClient'
import { signedTypeData } from '../services/ethers-service';
import { createBroadcast } from './Brodcast/brodcast';

const CREATE_POST_TYPED_DATA = `
  mutation($request: CreatePublicPostRequest!) { 
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
      }
    }
   }
 }
`
const CREATE_POST_VIA_DISPATCHER = `
mutation($request: CreatePublicPostRequest!) {
    createPostViaDispatcher(request: $request) {
      ... on RelayerResult {
        txHash
        txId
      }
      ... on RelayError {
        reason
      }
    }
  }
`;
export const createPostTypedData = (createPostTypedDataRequest) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_POST_TYPED_DATA),
    variables: {
      request: createPostTypedDataRequest
    },
  })
}


export const createPostByDis = (createPost) => { 
  return apolloClient.mutate({
      mutation: gql(CREATE_POST_VIA_DISPATCHER),
      variables: {
          request: createPost,
      },
  });
}

export const createPostByDispatcher = async (createPostRequest) => {

  const profileId = window.localStorage.getItem("profileId");
  const profileResult = await profileById(profileId); 
  if (!profileResult) {
      console.log('Could not find profile');
      return;
  }

  // this means it they have not setup the dispatcher, if its a no you must use broadcast
  if (profileResult?.dispatcher?.canUseRelay) { 
      const dispatcherResult = await createPostByDis(createPostRequest); 
      if (dispatcherResult?.data?.createPostViaDispatcher?.__typename !== 'RelayerResult') {
          
          console.log('create post via dispatcher: failed');
          return;
      }

      return dispatcherResult;
  } else {
      const result = await createPostTypedData(createPostRequest); 
      const typedData = result.data.createPostTypedData.typedData;
      const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
      
      const broadcastResult = await createBroadcast({
          id: result.id,
          signature: signature,
      }); 

      if (broadcastResult.__typename !== 'RelayerResult') { 
          console.log('create post via broadcast: failed');
          return;
      }

      return broadcastResult;
  }
}
