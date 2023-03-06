import React from 'react';
import logo from './logo.svg';
import './App.css';
import Sample from './Sample';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Sample />
    </ApolloProvider>
  );
}

export default App;
