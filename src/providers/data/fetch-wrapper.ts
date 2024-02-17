import { GraphQLFormattedError } from "graphql";

type Error = {
    message: string;
    statusCode: string;
}

const customFetch = async (url: string, options: RequestInit) => {
    const accessToken = localStorage.getItem("access_Token");
    
    const headers = options.headers as Record<string, string>;

    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorization || `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        }
    })
}

const getGraphQLErrors = (body: Record<'errors', GraphQLFormattedError[] | undefined>): Error | null => {
    if (!body){
        return {
            message: 'Unknown Error',
            statusCode: "INTERNAL_SERVER_ERROR"
        }
    }

    if("erros" in body){
        const errors = body.errors;

        const message = errors?.map((error) => error.message).join('\n');
        const code = errors?.[0]?.extensions?.code as string;

        return {
            message: message || JSON.stringify(errors),
            statusCode: code || `500`
        }
    }

    return null;
}

export const fetchWrapper = async (url: string, options: RequestInit) => {
    const response = await customFetch(url, options);
    const responseClone = response.clone();
    const body = await responseClone.json();
    const error = await getGraphQLErrors(body);
    return error !== null ? error : body;
}