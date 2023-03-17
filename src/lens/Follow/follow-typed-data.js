import { gql } from "@apollo/client";
import { apolloClient } from "../../services/ApolloClient";

const CREATE_FOLLOW_TYPED_DATA = `
  mutation($request: FollowRequest!) { 
    createFollowTypedData(request: $request) {
      id
      expiresAt
      typedData { 
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          FollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          datas
        }
      }
    }
 }
`;

const CREATE_UNFOLLOW_TYPE_DATA = `
mutation ($request: UnfollowRequest!) {
  createUnfollowTypedData(request: $request) {
    id
    expiresAt
    typedData {
      types {
        BurnWithSig {
          name
          type
        }
      }
      domain {
        version
        chainId
        name
        verifyingContract
      }
      value {
        nonce
        deadline
        tokenId
      }
    }
  }
} 
`
export const createUnfollowTypdeData = (id) => {
    return apolloClient.mutate({
        mutation: gql(CREATE_UNFOLLOW_TYPE_DATA),
        variables: {
            request: {
                profile: id,
            },
        },
    });
}

export const createFollowTypedData = (followRequestInfo) => {
    return apolloClient.mutate({
        mutation: gql(CREATE_FOLLOW_TYPED_DATA),
        variables: {
            request: {
                follow: followRequestInfo,
            },
        },
    });
}