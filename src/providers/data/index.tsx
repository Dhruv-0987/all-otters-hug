import graphqlDataProvider, { GraphQLClient, liveProvider as graphqlLiveProvider } from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";
import { createClient } from "graphql-ws";

export const API_BASE_URL = "https://api.crm.refine.dev";
export const API_URL = `${API_BASE_URL}/graphql`;
export const WS_URL = 'wss://api.crm.refine.dev/graphql';

export const gqClient = new GraphQLClient(API_URL, {
    fetch: (url: string, options: RequestInit) => {
        try{
            return fetchWrapper(url, options);
        }catch(e){
            return Promise.reject(e as Error);
        }
    }
})

export const wsClient = typeof window !== 'undefined'
? createClient(
   {
    url: WS_URL,
    connectionParams: () => {
        const accesToken = localStorage.getItem('access_token');

        return {
            headers:{
                Authorization: `Bearer ${accesToken}`
            }
        }
    }
   }
) : undefined;

export const dataProvider = graphqlDataProvider(gqClient);
export const liveProvider =  wsClient ? graphqlLiveProvider(wsClient) : undefined;