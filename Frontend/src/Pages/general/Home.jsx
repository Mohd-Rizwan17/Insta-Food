import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";
import "../../styles/reels.css";
import ReelFeed from "../../components/ReelFeed";
import { useToast } from "../../components/Toast";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/auth/session")
      .then((response) => {
        setIsAuthenticated(Boolean(response.data?.authenticated));
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsCheckingAuth(false);
      });
  }, []);

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
    }
  };

  async function likeVideo(item) {
    try {
      const response = await api.post("/api/food/like", { foodId: item._id });

      if (response.data.like) {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v,
          ),
        );
      } else {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id
              ? { ...v, likeCount: Math.max(0, v.likeCount - 1) }
              : v,
          ),
        );
      }
    } catch (error) {
      console.error("likeVideo error", error.response?.data || error.message);
      showError("Could not like/unlike this item. Please login as user.");
    }
  }

  async function saveVideo(item) {
    try {
      const response = await api.post("/api/food/save", { foodId: item._id });

      if (response.data.save) {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v,
          ),
        );
      } else {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id
              ? { ...v, savesCount: Math.max(0, v.savesCount - 1) }
              : v,
          ),
        );
      }
    } catch (error) {
      console.error("saveVideo error", error.response?.data || error.message);
      showError("Could not save/unsave this item. Please login as user.");
    }
  }

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
