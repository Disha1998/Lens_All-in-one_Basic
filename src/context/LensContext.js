import React, { useEffect, createContext, useRef, useState } from 'react';
import jwt_decode from "jwt-decode";
import { apolloClient } from '../services/ApolloClient';
import { getAddress, signText } from '../services/ethers-service';
import { gql } from '@apollo/client';
import { profileByAddress } from '../lens/profile/get-profile';
import { profileById } from './query';
import { collectedPubByAddress, getHasCollectedPublicationsRequest, publicationsByProfilId } from '../lens/getPost/get-post';
import { getPublicationByLatest } from '../lens/ExplorePublication/explorePublication';

export const LensAuthContext = createContext(undefined);


export const LensAuthContextProvider = (props) => {

    const [userAdd, setUserAdd] = useState("");
    const [update, setUpdate] = useState(false);
    const [profile, setProfile] = useState("");
    const [updatePro, setUpdatePro] = useState(false)
    const [publications, setPublications] = useState()
    console.log(publications );
    const [randomPublications, setRandomPublications] = useState()
    // console.log(randomPublications);
    const [collectedPubs, setCollectedPubs] = useState()

    // console.log(publications);
    const id = window.localStorage.getItem("profileId");


    useEffect(() => {
        async function getProfile() {
            if (id !== null) {
                // console.log(id, 'id in useefect..');
                let pubArry = [];
                const user = await profileById(id);
                const result = await publicationsByProfilId(id)

                for (let i = 0; i < result[0].length; i++) {
                    pubArry.push(result[0][i]);
                }
                let responce = await getPublicationByLatest();
                console.log(responce);
                console.log(responce.data.explorePublications.items);
                for (let i = 0; i < responce.data.explorePublications.items.length; i++) {
                    pubArry.push(responce.data.explorePublications.items[i]);
                }
                const res = await collectedPubByAddress(id);
                console.log(res);

                // const currensyResult = await enabledCurrencies();
                // console.log(currensyResult, 'currency result');
                setCollectedPubs(res);

                setProfile(user);
                setPublications(pubArry)
            }
        };
        getProfile();


    }, [userAdd, update, updatePro]);

   


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

    // const enabledCurrencies = async () => {
    //     const address = getAddress();
    //     // console.log('enabled currencies: address', address);

    //     await login(address);

    //     const result = await enabledCurrenciesRequest();

    //     console.log('enabled currencies: result', result);

    //     return result;
    // };


    const REFRESH_AUTHENTICATION = `
    mutation($request: RefreshRequest!) { 
      refresh(request: $request) {
        accessToken
        refreshToken
      }
   }
  `;

    const refreshAuth = (refreshToken) => {
        return apolloClient.mutate({
            mutation: gql(REFRESH_AUTHENTICATION),
            variables: {
                request: {
                    refreshToken,
                },
            },
        });
    };



    const GET_CHALLENGE = `
      query($request: ChallengeRequest!) {
        challenge(request: $request) { text }
      }
    `;

    const generateChallenge = (address) => {
        return apolloClient.query({
            query: gql(GET_CHALLENGE),
            variables: {
                request: {
                    address,
                },
            },
        });
    };

    const AUTHENTICATION = `
      mutation($request: SignedAuthChallenge!) { 
      authenticate(request: $request) {
      accessToken
      refreshToken
    }
 }
`;

    const authenticate = (address, signature) => {
        return apolloClient.mutate({
            mutation: gql(AUTHENTICATION),
            variables: {
                request: {
                    address,
                    signature,
                },
            },
        });
    };


    const refresh = async () => {
        const refreshToken = window.localStorage.getItem("refreshToken");
        const accessToken = window.localStorage.getItem("accessToken");
        if (accessToken === null || accessToken === "undefined") {
            return false;
        }

        let decodedRefresh = jwt_decode(refreshToken);
        let decodedAccess = jwt_decode(accessToken);

        //Check if the accessToken is expired or not
        if (decodedAccess.exp > Date.now() / 1000) {
            return true;
        }

        //Check if the RefreshToken is valid, if yes we refresh them.
        if (decodedRefresh.exp > Date.now() / 1000) {
            try {
                const newAccessToken = await refreshAuth(
                    refreshToken
                );
                window.localStorage.setItem("accessToken", newAccessToken.data.refresh.accessToken);
                window.localStorage.setItem("refreshToken", newAccessToken.data.refresh.refreshToken);
                return true;
            } catch (e) {
                console.error(e);
                console.log('in catch -- F');
                return false;
            }
        }
        return false;
    };

    const login = async () => {
        console.log('in login function');
        try {
            const address = await getAddress();
            setUserAdd(address);
            const isTokenValid = await refresh();
            console.log(isTokenValid, 't or f');
            if (isTokenValid) {
                console.log("login: already logged in");
                return;
            }
            const challengeResponse = await generateChallenge(address);
            const signature = await signText(challengeResponse.data.challenge.text);
            const accessTokens = await authenticate(address, signature);
            const profiles = await profileByAddress(address);
            if (profiles === undefined) {
                console.log("Please create a Profile");
                window.localStorage.removeItem("accessToken");
                window.localStorage.removeItem("refreshToken");
                window.localStorage.removeItem("profileId");
                setUpdate(!update)

            } else {
                window.localStorage.setItem("profileId", profiles?.id);
                setUpdate(!update)
                window.localStorage.setItem("accessToken", accessTokens.data.authenticate.accessToken);
                window.localStorage.setItem("refreshToken", accessTokens.data.authenticate.refreshToken);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const loginCreate = async () => {
        const address = await getAddress();
        const isTokenValid = await refresh();
        if (isTokenValid) {
            console.log("login: already logged in");
            return;
        }
        const challengeResponse = await generateChallenge(address);
        const signature = await signText(challengeResponse.data.challenge.text);
        const accessTokens = await authenticate(address, signature);
        window.localStorage.setItem("accessToken", accessTokens.data.authenticate.accessToken);
        window.localStorage.setItem("refreshToken", accessTokens.data.authenticate.refreshToken);

    };




    return (
        <LensAuthContext.Provider
            value={{
                login,
                updatePro,
                setUpdatePro,
                profile,
                update,
                setUpdate,
                loginCreate,
                publications,
                collectedPubs
            }}
            {...props}
        >
            {props.children}
        </LensAuthContext.Provider>
    )
}


