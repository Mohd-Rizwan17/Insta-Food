import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";
import "../../styles/reels.css";
import ReelFeed from "../../components/ReelFeed";
import { useToast } from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { showError } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsCheckingAuth(false);
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      loadVideos();
    }
  }, [isAuthenticated]);

  const loadVideos = async () => {
    try {
      const response = await api.get("/api/food");
      if (response.data.foodItems) {
        setVideos(response.data.foodItems);
      }
    } catch (error) {
      console.error("Error loading videos:", error);
      showError("Failed to load videos");
    }
  };

  const likeVideo = (item) => {
    if (!user) {
      showError("Please login to like videos");
      return;
    }

    // Note: Like functionality requires backend API support
    console.log("Like video:", item._id);
  };

  const saveVideo = (item) => {
    if (!user) {
      showError("Please login to save videos");
      return;
    }

    // Note: Save functionality requires backend API support
    console.log("Save video:", item._id);
  };

  const handleVisitStore = (foodPartnerId) => {
    navigate(`/food-partner/${foodPartnerId}`);
  };

  if (isCheckingAuth) {
    return (
      <div className="reels-page">
        <div className="empty-state">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="reels-page">
        <div className="empty-state">
          <div className="home-cta">
            <h2>Welcome to Insta Food! 🍕</h2>
            <p>Discover delicious food from amazing restaurants</p>
            <div className="auth-buttons">
              <button
                onClick={() => navigate("/user/login")}
                className="auth-btn primary"
              >
                User Login
              </button>
              <button
                onClick={() => navigate("/food-partner/login")}
                className="auth-btn secondary"
              >
                Partner Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ReelFeed
      items={videos}
      onLike={likeVideo}
      onSave={saveVideo}
      onVisitStore={handleVisitStore}
      emptyMessage="No videos available. Check back soon!"
    />
  );
};

export default Home;
