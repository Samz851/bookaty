import { AuthProvider } from "@refinedev/core";
import { notification } from "antd";
import { disableAutoLogin, enableAutoLogin } from "@/hooks";
import { Request } from "@/helpers/httpHelper";
import { loadState, removeState, saveState } from "@/helpers/localStorage";
import { getCookie } from "@/helpers/session";

type ACAuthProvider = AuthProvider & {
    RequestToken: () => void
}
export const TOKEN_KEY = "refine-auth";
export const XSRF_KEY = 'csrf-key';
export const API_KEY = "api-token"
export const XSRF_COOKIE = "XSRF-TOKEN";
export const IDENTITY_KEY = "identity"

export const authProvider: ACAuthProvider = {
    RequestToken: async () => {
        let AuthApp = await Request('GET', '/sanctum/csrf-cookie');
        saveState(XSRF_KEY, getCookie(XSRF_COOKIE));
    },
    login: async ({ email, password, remember }) => {

        try{
            await authProvider.RequestToken();
            let res = await Request('POST', "/users/login", {email, password, remember}, {"X-XSRF-TOKEN": getCookie(XSRF_COOKIE)});
            console.log('success', res)
            if ( res.data.success ) {
                saveState(API_KEY, {token: res.data.token.token});
                saveState(IDENTITY_KEY, res.data.identity);
            }
            return {
                success: true,
                redirectTo: res.data.redirectTo,
            };
        }catch(error){
             throw error;
        }
        // enableAutoLogin();
        // localStorage.setItem(TOKEN_KEY, `${email}-${password}`);
        // return {
        //     success: true,
        //     redirectTo: "/",
        // };
    },
    register: async ({ email, password }) => {
        try {
            await authProvider.login({ email, password });
            return {
                success: true,
                redirectTo: "/",
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: "Register failed",
                    name: "Invalid email or password",
                },
            };
        }
    },
    updatePassword: async () => {
        notification.success({
            message: "Updated Password",
            description: "Password updated successfully",
        });
        return {
            success: true,
        };
    },
    forgotPassword: async ({ email }) => {
        notification.success({
            message: "Reset Password",
            description: `Reset password link sent to "${email}"`,
        });
        return {
            success: true,
        };
    },
    logout: async () => {
        disableAutoLogin();
        removeState(API_KEY);
        removeState(XSRF_KEY);
        removeState(IDENTITY_KEY);
        return {
            success: true,
            redirectTo: "/login",
        };
    },
    onError: async (error) => {
        if (error.response?.status === 401) {
            return {
                logout: true,
            };
        }

        return { error };
    },
    check: async () => {

        try {
            const authenticated = await Request('GET', '/users/authenticated');
        // const token = loadState('api-token');
        
            if (authenticated.data.success) {
                console.log('authenticated');
                return {
                    authenticated: true,
                };
            }
            return {
                authenticated: false,
                error: {
                    message: "Check failed",
                    name: "Token not found",
                },
                logout: true,
                redirectTo: "/login",
            };
        } catch (error) {
            return {
                authenticated: false,
                error: {
                    message: "Check failed",
                    name: "Token not found",
                },
                logout: true,
                redirectTo: "/login",
            };
        }
        


    },
    getPermissions: async () => null,
    getIdentity: () => {
        const token = loadState(IDENTITY_KEY);
        if (!token) {
            return null;
        }

        return token;
    },
};
