import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';
import { act } from 'react-dom/test-utils';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import App from '../App';

const createTestClient = () => {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'https://countries.trevorblades.com',
  });

  return client;
};

describe('TableView', () => {
  it('renders loading state', async () => {
    const client = createTestClient();
      render(
        <ApolloProvider client={client}>
          <App/>
        </ApolloProvider>
      );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders table with data', async () => {
    const client = createTestClient();

    
      render(
        <ApolloProvider client={client}>
          <App/>
        </ApolloProvider>
      );
    
      expect(screen.getByText('Country Code')).toBeInTheDocument();
      expect(screen.getByText('Country Name')).toBeInTheDocument();
      expect(screen.getByText('US')).toBeInTheDocument();
      expect(screen.getByText('United States')).toBeInTheDocument();
   
  });

  it('filters data based on input', async () => {
    const client = createTestClient();

    await act(async () => {
      render(
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      );
    });

    const input = screen.getByLabelText(/filter by country code/i);
    fireEvent.change(input, { target: { value: 'US' } });

    
      expect(screen.getByText('US')).toBeInTheDocument();
      expect(screen.getByText('United States')).toBeInTheDocument();
    
  });

  it('handles pagination correctly', async () => {
    const client = createTestClient();

    
      render(
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      );
    
    expect(screen.getByText('US')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next'));

  });
});
