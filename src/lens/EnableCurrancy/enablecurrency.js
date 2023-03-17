import { gql } from "@apollo/client";
import { apolloClient } from "../../services/ApolloClient";

const ENABLE_CURRANCY_MOUDLE = `
query EnabledModuleCurrencies {
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
  }
  `

const enabledCurrenciesRequest = async () => {
  const result = await apolloClient.query({
    query: gql(ENABLE_CURRANCY_MOUDLE),
  });

  return result;
};

export const enabledCurrencies = async () => {
  // const address = getAddress();
  // console.log('enabled currencies: address', address);

  // await login(address);

  const result = await enabledCurrenciesRequest();

  console.log('enabled currencies: result', result);

  return result;
};