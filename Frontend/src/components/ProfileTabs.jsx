import React, { useState, useEffect } from "react";
import api from "../lib/api";

const ProfileTabs = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [saved, setSaved] = useState([]);
  const [likes, setLikes] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const loadTabData = async (tab) => {
    setIsLoading(true);
    try {
      switch (tab) {
        case "orders":
          // You'll need to create this endpoint in backend
          const ordersRes = await api.get("/api/user/orders");
          setOrders(ordersRes.data.orders || []);
          break;

        case "saved":
          const savedRes = await api.get("/api/food/save");
          setSaved(savedRes.data.savedFoods || []);
          break;

        case "likes":
          // You'll need to create this endpoint in backend
          const likesRes = await api.get("/api/user/likes");
          setLikes(likesRes.data.likes || []);
          break;

        case "following":
          // You'll need to create this endpoint in backend
          const followingRes = await api.get("/api/user/following");
          setFollowing(followingRes.data.following || []);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(`Error loading ${tab}:`, error);
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
                <div key={order._id} className="order-card">
                  <img src={order.food?.video} alt={order.food?.description} />
                  <p className="card-title">{order.food?.description}</p>
                  <p className="card-meta">Order ID: {order._id.slice(0, 8)}</p>
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
                  <video src={item.food?.video} muted />
                  <p className="card-title">{item.food?.description}</p>
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
                  <video src={item.food?.video} muted />
                  <p className="card-title">{item.food?.description}</p>
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
                    {partner.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="partner-info">
                    <p className="partner-name">{partner.name}</p>
                    <p className="partner-address">{partner.address}</p>
                  </div>
                  <button
                    className="unfollow-btn"
                    onClick={async () => {
                      try {
                        await api.post(`/api/follow/${partner._id}`);
                        // Reload following list after unfollow
                        loadTabData("following");
                      } catch (error) {
                        console.error(
                          "Error unfollowing:",
                          error.response?.data,
                        );
                        alert(
                          error.response?.data?.message || "Failed to unfollow",
                        );
                      }
                    }}
                  >
                    Following
                  </button>
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
