import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";
import "../../styles/reels.css";
import ReelFeed from "../../components/ReelFeed";
import { useToast } from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [savedVideos, setSavedVideos] = useState(new Set());
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

  const likeVideo = async (item) => {
    if (!user) {
      showError("Please login to like videos");
      return;
    }

    try {
      const response = await api.post("/api/food/like", { foodId: item._id });
      const { like, likeCount } = response.data;

      setVideos((prev) =>
        prev.map((v) => (v._id === item._id ? { ...v, likeCount } : v)),
      );

      setLikedVideos((prev) => {
        const newSet = new Set(prev);
        if (like) {
          newSet.add(item._id);
        } else {
          newSet.delete(item._id);
        }
        return newSet;
      });
    } catch (error) {
      console.error("Error liking video:", error);
      showError("Failed to like video");
    }
  };

  const saveVideo = async (item) => {
    if (!user) {
      showError("Please login to save videos");
      return;
    }

    try {
      const response = await api.post("/api/food/save", { foodId: item._id });
      const { save, savesCount } = response.data;

      setVideos((prev) =>
        prev.map((v) => (v._id === item._id ? { ...v, savesCount } : v)),
      );

      setSavedVideos((prev) => {
        const newSet = new Set(prev);
        if (save) {
          newSet.add(item._id);
        } else {
          newSet.delete(item._id);
        }
        return newSet;
      });
    } catch (error) {
      console.error("Error saving video:", error);
      showError("Failed to save video");
    }
  };

  const handleVisitStore = (foodPartnerId) => {
    navigate(`/food-partner/${foodPartnerId}`);
  };

  // Pass liked/saved status to ReelFeed
  const videosWithStatus = videos.map((video) => ({
    ...video,
    isLiked: likedVideos.has(video._id),
    isSaved: savedVideos.has(video._id),
  }));

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
      items={videosWithStatus}
      onLike={likeVideo}
      onSave={saveVideo}
      onVisitStore={handleVisitStore}
      emptyMessage="No videos available. Check back soon!"
    />
  );
};

export default Home;
