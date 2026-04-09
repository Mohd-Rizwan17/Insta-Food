import React, { useState, useEffect } from "react";
import { useToast } from "./Toast";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const ProfileTabs = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("orders");
  const [saved, setSaved] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useToast();
  const { orders, following } = useAuth();

  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const loadTabData = async (tab) => {
    setIsLoading(true);
    try {
      switch (tab) {
        case "saved": {
          const response = await api.get("/api/food/save");
          const savedFoods = response.data.savedFoods.map((item) => ({
            _id: item.food._id,
            video: item.food.video,
            description: item.food.description,
            likeCount: item.food.likeCount,
            savesCount: item.food.savesCount,
            foodPartner: item.food.foodPartner,
          }));
          setSaved(savedFoods);
          break;
        }

        case "likes": {
          const response = await api.get("/api/food/like");
          const likedFoods = response.data.likedFoods.map((item) => ({
            _id: item.food._id,
            video: item.food.video,
            description: item.food.description,
            likeCount: item.food.likeCount,
            savesCount: item.food.savesCount,
            foodPartner: item.food.foodPartner,
          }));
          setLikes(likedFoods);
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.error(`Error loading ${tab}:`, error);
      showError("Could not load profile section");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-tabs-container">
      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === "orders" ? "is-active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          <span>Orders</span>
          <span className="tab-count">{orders.length}</span>
        </button>
        <button
          className={`profile-tab ${activeTab === "saved" ? "is-active" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          <span>Saved</span>
          <span className="tab-count">{saved.length}</span>
        </button>
        <button
          className={`profile-tab ${activeTab === "likes" ? "is-active" : ""}`}
          onClick={() => setActiveTab("likes")}
        >
          <span>Likes</span>
          <span className="tab-count">{likes.length}</span>
        </button>
        <button
          className={`profile-tab ${activeTab === "following" ? "is-active" : ""}`}
          onClick={() => setActiveTab("following")}
        >
          <span>Following</span>
          <span className="tab-count">{following.length}</span>
        </button>
      </div>

      <div className="profile-tab-content">
        {isLoading && <div className="loading-spinner">Loading...</div>}

        {activeTab === "orders" && !isLoading && (
          <div className="orders-grid">
            {orders.length === 0 ? (
              <p className="empty-tab">No orders yet</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-card-placeholder" />
                  <p className="card-title">{order.foodName}</p>
                  <p className="card-meta">Order ID: {order.id.slice(0, 8)}</p>
                  <p className="card-meta">₹{order.price}</p>
                  <p className="card-meta">Partner: {order.partnerId}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "saved" && !isLoading && (
          <div className="saved-grid">
            {saved.length === 0 ? (
              <p className="empty-tab">No saved items yet</p>
            ) : (
              saved.map((item) => (
                <div key={item._id} className="saved-card">
                  <video src={item.video} muted />
                  <p className="card-title">{item.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "likes" && !isLoading && (
          <div className="likes-grid">
            {likes.length === 0 ? (
              <p className="empty-tab">No liked items yet</p>
            ) : (
              likes.map((item) => (
                <div key={item._id} className="like-card">
                  <video src={item.video} muted />
                  <p className="card-title">{item.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "following" && !isLoading && (
          <div className="following-list">
            {following.length === 0 ? (
              <p className="empty-tab">Not following anyone yet</p>
            ) : (
              following.map((partner) => (
                <div key={partner._id} className="following-card">
                  <div className="partner-avatar">
                    {partner.name ? partner.name.charAt(0).toUpperCase() : "P"}
                  </div>
                  <div className="partner-info">
                    <p className="partner-name">{partner.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
