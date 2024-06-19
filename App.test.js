import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('App Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        images: ['image1.jpg', 'image2.jpg']
      }
    });
    axios.post.mockResolvedValue({});
  });

  test('renders Image Comparison title', () => {
    render(
      <Router>
        <App />
      </Router>
    );
    expect(screen.getByText(/Image Comparison/i)).toBeInTheDocument();
  });

  test('starts and stops comparison', async () => {
    render(
      <Router>
        <App />
      </Router>
    );

    const startButton = screen.getByText(/Start/i);
    fireEvent.click(startButton);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/Stop/i)).toBeInTheDocument();

    fireEvent.click(startButton);
    expect(screen.getByText(/Start/i)).toBeInTheDocument();
  });

  test('fetches and displays images', async () => {
    render(
      <Router>
        <App />
      </Router>
    );
    fireEvent.click(screen.getByText(/Start/i));

    await waitFor(() => {
      expect(screen.getByAltText('Comparison 1')).toBeInTheDocument();
      expect(screen.getByAltText('Comparison 2')).toBeInTheDocument();
    });
  });

  test('handles image click and records choice', async () => {
    render(
      <Router>
        <App />
      </Router>
    );
    fireEvent.click(screen.getByText(/Start/i));

    await waitFor(() => {
      const img1 = screen.getByAltText('Comparison 1');
      fireEvent.click(img1);
    });

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  });

  test('displays preferences after stopping', async () => {
    render(
      <Router>
        <App />
      </Router>
    );
    fireEvent.click(screen.getByText(/Start/i));

    await waitFor(() => {
      const img1 = screen.getByAltText('Comparison 1');
      fireEvent.click(img1);
    });

    fireEvent.click(screen.getByText(/Stop/i));
    expect(screen.getByText(/Preferences/i)).toBeInTheDocument();
  });
});
