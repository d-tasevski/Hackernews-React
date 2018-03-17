import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import './styles/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

// connect ApolloClient instance with the GraphQL API;
// GraphQL server will be running on http://localhost:4000.
const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

// instantiate ApolloClient by passing in the httpLink and a new instance of an InMemoryCache.
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
registerServiceWorker();
