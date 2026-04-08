import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";
import "../../styles/reels.css";
import ReelFeed from "../../components/ReelFeed";
import { useToast } from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";
import {
  toggleLike,
  toggleSave,
  getTotalLikeCount,
  getTotalSaveCount,
  hasUserLiked,
  hasUserSaved,
} from "../../lib/likesSaves";

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
      setIsCheckingAuth(false);
    } else {
      setIsAuthenticated(false);
      setIsCheckingAuth(false);
    }
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
        // Add like/save state for current user
        const videosWithState = response.data.foodItems.map((video) => ({
          ...video,
          userLiked: hasUserLiked(user?._id, video._id),
          userSaved: hasUserSaved(user?._id, video._id),
          totalLikes: getTotalLikeCount(video._id),
          totalSaves: getTotalSaveCount(video._id),
        }));
        setVideos(videosWithState);
      }
    } catch (error) {
      console.error("Error loading videos:", error);
    }
  };

  const likeVideo = (item) => {
    if (!user?._id) {
      showError("Please login to like videos");
      return;
    }

    try {
      const wasLiked = toggleLike(user._id, item._id);
      const newTotalLikes = getTotalLikeCount(item._id);

      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? {
                ...v,
                userLiked: wasLiked,
                totalLikes: newTotalLikes,
                likeCount: newTotalLikes,
              }
            : v,
        ),
      );
    } catch (error) {
      console.error("likeVideo error", error);
      showError("Could not like/unlike this item.");
    }
  };

  const saveVideo = (item) => {
    if (!user?._id) {
      showError("Please login to save videos");
      return;
    }

    try {
      const wasSaved = toggleSave(user._id, item._id);
      const newTotalSaves = getTotalSaveCount(item._id);

      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? {
                ...v,
                userSaved: wasSaved,
                totalSaves: newTotalSaves,
                savesCount: newTotalSaves,
              }
            : v,
        ),
      );
    } catch (error) {
      console.error("saveVideo error", error);
      showError("Could not save/unsave this item.");
    }
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
