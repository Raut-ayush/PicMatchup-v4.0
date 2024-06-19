import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ErrorBoundary from './ErrorBoundary';
import Login from './Login';
import Register from './Register';
import Footer from './Footer'; // Import the Footer component

const App = () => {
  const [images, setImages] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [choiceData, setChoiceData] = useState([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [eloList, setEloList] = useState([]);
  const [showEloList, setShowEloList] = useState(false);
  const [topEloRatings, setTopEloRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLogin, setShowLogin] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isAuthenticated && isRunning) {
      fetchImages();
      setShowPreferences(false);
      setShowEloList(false);
    } else if (isAuthenticated) {
      axios.post('http://localhost:3000/api/reset')
        .then(() => {
          setImages([]);
        })
        .catch(error => {
          console.error('Error resetting state:', error);
        });
    }
  }, [isAuthenticated, isRunning]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isRunning) {
        if (event.key === 'ArrowLeft') {
          handleImageClick(images[0]);
        } else if (event.key === 'ArrowRight') {
          handleImageClick(images[1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRunning, images]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/images');
      setImages(response.data.images);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
    }
  };

  const fetchEloList = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/elo');
      setEloList(response.data);
      setShowEloList(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ELO list:', error);
      setLoading(false);
    }
  };

  const fetchTopEloRatings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/elo');
      setTopEloRatings(response.data.slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching top ELO ratings:', error);
      setLoading(false);
    }
  };

  const handleStartStop = () => {
    if (isRunning) {
      setShowPreferences(true);
      fetchTopEloRatings();
    } else {
      setChoiceData([]);
    }
    setIsRunning(!isRunning);
  };

  const handleImageClick = (selectedImage) => {
    if (!isRunning) return;

    const otherImage = images.find(img => img !== selectedImage);
    const choice = { choice: selectedImage, other: otherImage };
    setChoiceData([...choiceData, choice]);

    axios.post('http://localhost:3000/api/images/choice', choice)
      .then(() => {
        fetchImages();
      })
      .catch(error => {
        console.error('Error recording choice:', error);
      });
  };

  const handleResetElo = () => {
    axios.post('http://localhost:3000/api/reset/elo')
      .then(() => {
        // Clear the ELO list and top ratings
        setEloList([]);
        setTopEloRatings([]);
        setShowEloList(false);
        setShowPreferences(false);
      })
      .catch(error => {
        console.error('Error resetting ELO scores:', error);
      });
  };

  const handleQuit = () => {
    setIsAuthenticated(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedEloList = eloList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!isAuthenticated) {
    return (
      <div className="auth-wrapper">
        {showLogin ? (
          <>
            <Login setIsAuthenticated={setIsAuthenticated} />
            <p>New to Image Comparison? <button onClick={() => setShowLogin(false)}>Register here</button></p>
          </>
        ) : (
          <Register setIsAuthenticated={setIsAuthenticated} />
        )}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <h1>Image Comparison</h1>
        {!isRunning && !showPreferences && !showEloList && (
          <>
            <button onClick={handleStartStop}>Start</button>
            <p>Click "Start" to begin the comparison.</p>
            <button onClick={handleQuit}>Quit</button>
          </>
        )}
        {isRunning && (
          <>
            {loading ? <p>Loading images...</p> : (
              <div className="image-container">
                {images.map((image, index) => (
                  <img key={index} src={`http://localhost:3000/images/${image}`} alt={`Comparison ${index + 1}`} onClick={() => handleImageClick(image)} />
                ))}
              </div>
            )}
            <button onClick={handleStartStop}>Stop</button>
          </>
        )}
        {showPreferences && !isRunning && (
          <>
            <div className="preferences">
              <h1>Preferences</h1>
              <ul>
                {choiceData.length === 0 ? (
                  <li>Make choices</li>
                ) : (
                  choiceData.map((choice, index) => (
                    <li key={index}>
                      <strong>Preferred:</strong> <img src={`http://localhost:3000/images/${choice.choice}`} alt={`Choice ${index + 1}`} width="100" />
                      <strong>Other:</strong> <img src={`http://localhost:3000/images/${choice.other}`} alt={`Other ${index + 1}`} width="100" />
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="top-elo">
              <h2>Top 3 ELO Rated Images</h2>
              <ul>
                {topEloRatings.length === 0 ? (
                  <li>Make choices</li>
                ) : (
                  topEloRatings.map((item, index) => (
                    <li key={index}>
                      <img src={`http://localhost:3000/images/${item.image}`} alt={`Top ELO ${index + 1}`} width="100" />
                      - ELO: {item.elo}
                    </li>
                  ))
                )}
              </ul>
              <button onClick={fetchEloList}>View List of ELO Rankings</button>
              <button onClick={handleResetElo}>Reset ELO Scores</button>
              <button onClick={handleStartStop}>Retake Test</button>
              <button onClick={handleQuit}>Quit</button>
            </div>
          </>
        )}
        {showEloList && (
          <div>
            <div className="elo-list">
              <h2>ELO Rankings</h2>
              {loading ? <p>Loading rankings...</p> : (
                <ul>
                  {paginatedEloList.length === 0 ? (
                    <li>Make choices</li>
                  ) : (
                    paginatedEloList.map((item, index) => (
                      <li key={index}>
                        <img src={`http://localhost:3000/images/${item.image}`} alt={`ELO ${index + 1}`} width="100" />
                        - ELO: {item.elo}
                      </li>
                    ))
                  )}
                </ul>
              )}
              <div className="pagination">
                {Array.from({ length: Math.ceil(eloList.length / itemsPerPage) }, (_, i) => (
                  <button key={i} onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                ))}
              </div>
            </div>
          </div>
        )}
        {showEloList && (
          <div className="buttons-below-elo-list">
            <button onClick={handleResetElo}>Reset ELO Scores</button>
            <button onClick={handleStartStop}>Retake Test</button>
            <button onClick={handleQuit}>Quit</button>
          </div>
        )}
        <Footer />  {/* Add the Footer component here */}
      </div>
    </ErrorBoundary>
  );
};

export default App;
