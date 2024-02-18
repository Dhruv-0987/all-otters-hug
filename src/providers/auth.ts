import { AuthBindings } from "@refinedev/core";
import { API_URL, dataProvider } from "./data";

export const authCredentials = {
  email: "micheal.scott@dundermifflin.com",
  password: "demo",
};

export const authProvider: AuthBindings = {
  login: async ({ email }) => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          rawQuery: `mutation Login( $email: String! ){
                    login(loginInput: {email: $email}){
                        accessToken
                    }
                }`,
        },
      });
      localStorage.setItem("access_token", data?.login.accessToken);

      return {
        success: true,
        redirectTo: `/`,
      };
    } catch (e) {
      console.error("Login error:", e);
      const error = e as Error;

      return {
        success: false,
        error: error,
      };
    }
  },

  logout: async () => {
    localStorage.removeItem("access_token");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  onError: async (error) => {
    if (error.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
        ...error,
      };
    }

    return { error };
  },

  check: async () => {
    const accessToken = localStorage.getItem("access_token");

    try {
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        meta: {
          rawQuery: `   query Me {
                    me {
                      name
                    }
                  }`,
        },
      });

      return {
        authenticated: true,
        redirectTo: "/",
      };
    } catch (e) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  register: async ({ email, password }) => {
    try {
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email, password },
          rawQuery: `mutation register($email: String!, $password: String!) {
                    register(registerInput: {
                      email: $email
                        password: $password
                    }) {
                        id
                        email
                    }
                  }`,
        },
      });

      return {
        success: true,
        redirectTo: `/login?email=${email}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Register failed",
          name: "name" in error ? error.name : "Invalid email or password",
        },
      };
    }
  },

  getIdentity: async () => {
    const accessToken = localStorage.getItem("access_token");
    
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        meta: {
          rawQuery: ` query Me {
                    me {
                        id,
                        name,
                        email,
                        phone,
                        jobTitle,
                        timezone
                        avatarUrl
                    }
                  }`,
        },
      });

      return data.me;
    } catch (error) {
      return {
        message: error,
      };
    }
  },
};
