import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client'

const API_URL = 'https://api-mumbai.lens.dev/';


const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  }


// `httpLink` our gateway to the Lens GraphQL API. It lets us request for data from the API and passes it forward
const httpLink = new HttpLink({ uri: API_URL });

/* `authLink` takes care of passing on the access token along with all of our requests. We will be using session storage to store our access token. 
 
The reason why we have to account for an access token is that that's what the Lens API uses to authenticate users. This is the token you'll get back when someone successfully signs in. We need to pass this token along with all the requests we made to the API that *need* authentication.
*/
const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('accessToken');
// console.log(token);
    operation.setContext({
        headers: {
            'x-access-token': token ? `Bearer ${token}` : '',
        },
    });

    return forward(operation);
});

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    onError: ({ networkError, graphQLErrors }) => {
        console.log('networkError', networkError)
      },
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions
});





