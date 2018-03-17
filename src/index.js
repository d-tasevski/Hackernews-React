import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloLink, split } from 'apollo-client-preset';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloProvider } from 'react-apollo';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { BrowserRouter } from 'react-router-dom';
import { AUTH_TOKEN } from './constants';
import './styles/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

// connect ApolloClient instance with the GraphQL API;
// GraphQL server will be running on http://localhost:4000.
const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

// Apollo provides a nice way for authenticating all requests by using the concept of middleware, implemented as an Apollo Link.
// This middleware will be invoked every time ApolloClient sends a request to the server.
const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  const authorizationHeader = token ? `Bearer ${token}` : null;
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  });
  return forward(operation);
});

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);

// https://www.howtographql.com/react-apollo/8-subscriptions/
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLinkWithAuthToken
);

// instantiate ApolloClient by passing in the httpLink and a new instance of an InMemoryCache.
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
