import { gql } from "@apollo/client"
import { apolloClient } from "../../services/ApolloClient"
import { getAddress } from "../../services/ethers-service"


// const APPROVE_AMOUNT_ALLOWANCE = `
// query approvedModuleAllowanceAmount($request: ApprovedModuleAllowanceAmountRequest!) {
//     approvedModuleAllowanceAmount(request: $request) {
//       currency
//       module
//       contractAddress
//       allowance
//     }
//   }
// `

const APPROVE_AMOUNT_ALLOWANCE = `
query ApprovedModuleAllowanceAmount {
    approvedModuleAllowanceAmount(request: {
      currencies: ["0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"],
      collectModules: [FeeCollectModule],
      followModules: [FeeFollowModule],
      referenceModules: [FollowerOnlyReferenceModule]
    }) {
      currency
      module
      contractAddress
      allowance
    }
  }
`

// const allowancerequest = async (request) => {
//     const result = await apolloClient.query({
//         query: gql(APPROVE_AMOUNT_ALLOWANCE),
//     })
// }

export const allowanceRequest = async (request) => {
    const result  = await apolloClient.query({
        query: gql(APPROVE_AMOUNT_ALLOWANCE),
    });
    return result;
}

// const allowanceRequest = async (request) => {
//     const result  = await apolloClient.query({
//         query: gql(APPROVE_AMOUNT_ALLOWANCE),
//         variables: { request }
//     });
//     return result;
// }
export const allowance = async () => {
    // const address = getAddress();

    // await login(address);
    try {
        const result = await allowanceRequest({
            currencies: ['0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'],
            collectModules: [
                "FeeCollectModule"
            ],
        })
        console.log(result, 'allowance result');

        return result;
    } catch (error) {
        console.log(error);
    }

}