import React from "react";
import { Authenticated, CanAccess, Refine } from "@refinedev/core";
import { RefineKbarProvider } from "@refinedev/kbar";
import {
    useNotificationProvider,
    ErrorComponent,
} from "@refinedev/antd";
import routerProvider, {
    CatchAllNavigate,
    NavigateToResource,
    UnsavedChangesNotifier,
    DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import jsonServerDataProvider from "@refinedev/simple-rest";
import { authProvider } from "./providers/authProvider";

import "dayjs/locale/de";

import { AuthPage } from "./pages/auth";
import { useTranslation } from "react-i18next";
import { ThemedLayoutV2, Header, Title } from "./components";
import { ConfigProvider } from "./context";
import { useAutoLoginForDemo } from "./hooks";

import "@refinedev/antd/dist/reset.css";
import { resources } from "./config/resources";
import { routes } from "./config/routes";
import { loadState } from "./helpers/localStorage";
import { getCookie } from "./helpers/session";
import * as monaco from "monaco-editor";

const App: React.FC = () => {
    // This hook is used to automatically login the user.
    // We use this hook to skip the login page and demonstrate the application more quickly.
    // const { loading } = useAutoLoginForDemo();
    const { PROD, VITE_DEV_APP_URL, VITE_PROD_APP_URL} = import.meta.env;
    const API_URL = "https://api.finefoods.refine.dev";
    const LARAVEL_API_URL = `${ PROD 
                                ? VITE_PROD_APP_URL
                                : window.location.origin
                            }/api`;
    console.log(LARAVEL_API_URL, PROD, VITE_PROD_APP_URL, VITE_DEV_APP_URL, window.location);
    const laravelDataProvider = jsonServerDataProvider(LARAVEL_API_URL);
    const dataProvider = jsonServerDataProvider(API_URL);

    const { t, i18n } = useTranslation();

    const i18nProvider = {
        translate: (key: string) => t(key),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };


    // monaco.languages.register({ id: "formula-language" });

    // monaco.languages.setMonarchTokensProvider("formula-language", {
    //     tokenizer: {
    //         root: [
    //             [/[A-Za-z_]\w*/, "identifier"], // Identifies valid field names or variables
    //             [/[+\-*/=]/, "operator"],       // Recognizes operators
    //             [/\d+/, "number"],              // Matches numbers
    //             [/\(/, "delimiter.parenthesis"], // Matches opening parenthesis
    //             [/\)/, "delimiter.parenthesis"], // Matches closing parenthesis
    //         ],
    //     },
    // });
    
    // // Add autocomplete suggestions for the formula editor
    // monaco.languages.registerCompletionItemProvider("formula-language", {
    //     provideCompletionItems: (): monaco.languages.CompletionList => {
    //         const suggestions: monaco.languages.CompletionItem[] = [
    //             {
    //                 label: "SUM",
    //                 kind: monaco.languages.CompletionItemKind.Function,
    //                 insertText: "SUM()",
    //                 documentation: "Calculates the sum of a range of numbers.",
    //                 range: {
    //                     startLineNumber: 1,
    //                     startColumn: 1,
    //                     endLineNumber: 1,
    //                     endColumn: 4,
    //                 }
    //             },
    //             {
    //                 label: "IF",
    //                 kind: monaco.languages.CompletionItemKind.Function,
    //                 insertText: "IF(condition, trueValue, falseValue)",
    //                 documentation: "Returns a value based on a condition.",
    //                 range: {
    //                     startLineNumber: 1,
    //                     startColumn: 1,
    //                     endLineNumber: 1,
    //                     endColumn: 4,
    //                 }
    //             },
    //             {
    //                 label: "AccountBalance",
    //                 kind: monaco.languages.CompletionItemKind.Variable,
    //                 insertText: "AccountBalance",
    //                 documentation: "The current balance of the account.",
    //                 range: {
    //                     startLineNumber: 1,
    //                     startColumn: 1,
    //                     endLineNumber: 1,
    //                     endColumn: 4,
    //                 }
    //             },
    //         ];
    
    //         return { suggestions };
    //     },
    // });


    // if (loading) {
    //     return null;
    // }

    return (
        <DndProvider backend={HTML5Backend}>
            <BrowserRouter>
                <ConfigProvider>
                    <RefineKbarProvider>
                        <Refine
                            routerProvider={routerProvider}
                            dataProvider={{
                                default: dataProvider,
                                laravel: laravelDataProvider
                            }}
                            authProvider={authProvider}
                            i18nProvider={i18nProvider}
                            accessControlProvider={{
                                can: async ({ resource, action, params }) => {
                                    const accessCookie = getCookie('X-ACCOUNTAK-ONBOARDING');
                                    const canAccess = !accessCookie || resource === undefined;
                                    if ( !canAccess ) {
                                        return {can: false};
                                    }
                                //   if (identity?.organization?.setup === 0 && resource === undefined) {
                                //     return {
                                //       can: false,
                                //     };
                                //   
                                  return { can: true };
                                },
                                options: {
                                  buttons: {
                                    enableAccessControl: true,
                                    hideIfUnauthorized: true,
                                  },
                                  queryOptions: {
                                    // ... default global query options
                                  },
                                },
                              }}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                            }}
                            notificationProvider={useNotificationProvider}
                            resources={resources}
                        >
                            <Routes>
                                <Route
                                    element={
                                        <Authenticated
                                            key="authenticated-routes"
                                            fallback={
                                                <CatchAllNavigate to="/login" />
                                            }
                                        >
                                            <ThemedLayoutV2
                                                Header={Header}
                                                Title={Title}
                                            >
                                                {/* <div
                                                    style={{
                                                        // maxWidth: "1200px",
                                                        marginLeft: "auto",
                                                        marginRight: "auto",
                                                    }}
                                                > */}
                                                <CanAccess fallback={
                                                    <CatchAllNavigate to="/options/onboard" />
                                                }>
                                                    <Outlet />

                                                </CanAccess>
                                                {/* </div> */}
                                            </ThemedLayoutV2>
                                        </Authenticated>
                                    }
                                >

                                    {...routes}
                                </Route>

                                <Route
                                    element={
                                        <Authenticated
                                            key="auth-pages"
                                            fallback={<Outlet />}
                                        >
                                            <NavigateToResource resource="dashboard" />
                                        </Authenticated>
                                    }
                                >
                                    <Route
                                        path="/login"
                                        element={
                                            <AuthPage
                                                type="login"
                                                formProps={{
                                                    initialValues: {
                                                        email: "samer@example.com",
                                                        password: "password",
                                                    },
                                                }}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/register"
                                        element={
                                            <AuthPage
                                                type="register"
                                                formProps={{
                                                    initialValues: {
                                                        email: "demo@refine.dev",
                                                        password: "demodemo",
                                                    },
                                                }}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/forgot-password"
                                        element={<AuthPage type="forgotPassword" />}
                                    />
                                    <Route
                                        path="/update-password"
                                        element={<AuthPage type="updatePassword" />}
                                    />
                                </Route>

                                <Route
                                    element={
                                        <Authenticated key="catch-all">
                                            <ThemedLayoutV2
                                                Header={Header}
                                                Title={Title}
                                            >
                                                <Outlet />
                                            </ThemedLayoutV2>
                                        </Authenticated>
                                    }
                                >
                                    <Route path="*" element={<ErrorComponent />} />
                                </Route>
                            </Routes>
                            <UnsavedChangesNotifier />
                            <DocumentTitleHandler />
                        </Refine>
                    </RefineKbarProvider>
                </ConfigProvider>
            </BrowserRouter>
        </DndProvider>
    );
};

export default App;
