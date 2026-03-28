import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Link } from "react-router-dom";
import "../../styles/reels.css";
import ReelFeed from "../../components/ReelFeed";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  // Autoplay behavior is handled inside ReelFeed

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
    api
      .get("/api/food")
      .then((response) => {
        console.log(response.data);

        setVideos(response.data.foodItems);
      })
      .catch(() => {
        /* noop: optionally handle error */
      });
  }, []);

  // Using local refs within ReelFeed; keeping map here for dependency parity if needed

  async function likeVideo(item) {
    try {
      const response = await api.post("/api/food/like", { foodId: item._id });

      if (response.data.like) {
        console.log("Video liked");
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v,
          ),
        );
      } else {
        console.log("Video unliked");
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v,
          ),
        );
      }
    } catch (error) {
      console.error("likeVideo error", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "Could not like/unlike this item. Please login as user.",
      );
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
            v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v,
          ),
        );
      }
    } catch (error) {
      console.error("saveVideo error", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "Could not save/unsave this item. Please login as user.",
      );
    }
  }

  return (
    <>
      {!isCheckingAuth && !isAuthenticated && (
        <div
          className="home-cta"
          style={{ textAlign: "center", margin: "24px 0" }}
        >
          <p style={{ marginBottom: "10px" }}>
            Welcome! To view the reel,Please first go to the login page.
          </p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "12px" }}
          >
            <Link
              to="/user/login"
              style={{
                padding: "10px 16px",
                borderRadius: "6px",
                backgroundColor: "#007bff",
                color: "white",
                textDecoration: "none",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                minWidth: "140px",
              }}
            >
              User Login
            </Link>

            <Link
              to="/food-partner/login"
              style={{
                padding: "10px 16px",
                borderRadius: "6px",
                backgroundColor: "#22c55e",
                color: "white",
                textDecoration: "none",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                minWidth: "170px",
              }}
            >
              Food Partner Login
            </Link>
          </div>
        </div>
      )}

      <ReelFeed
        items={videos}
        onLike={likeVideo}
        onSave={saveVideo}
        emptyMessage="No videos available."
      />
    </>
  );
};

export default Home;
