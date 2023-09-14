import "./App.css";

import {
    ApolloClient,
    ApolloProvider,
    createHttpLink,
    InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Outlet } from "react-router-dom";
import Header from "./components/header.jsx";
import { UserProvider } from "./utils/userContext.jsx"

const httpLink = createHttpLink({
    uri: "/graphql",
});

const AuthLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("id_token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const client = new ApolloClient({
    link: AuthLink.concat(httpLink),
    cache: new InMemoryCache(),
});

function App() {
    return (
        <ApolloProvider client={client}>
            <UserProvider>
            <>
                <Header />
                <Outlet />
            </>
            </UserProvider>
        </ApolloProvider>
    );
}

export default App;
