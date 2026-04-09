import React, { useState, useEffect } from "react";
import "../../styles/food-partner-profile.css";
import { useParams } from "react-router-dom";
import api from "../../lib/api";
import { useToast } from "../../components/Toast";
import FollowButton from "../../components/FollowButton";

const Profile = ({ orders, setOrders, following, setFollowing }) => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("menu");
  const [orderedItems, setOrderedItems] = useState(new Set());
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadProfile();
    // Track ordered items from shared state
    const orderedIds = new Set(orders.map((order) => order.foodId || order.id));
    setOrderedItems(orderedIds);
  }, [id, orders]);

  const loadProfile = async () => {
    try {
      const response = await api.get(`/api/auth/food-partner/${id}`);
      setProfile(response.data.foodPartner);
      setVideos(response.data.foodItems || []);
    } catch (error) {
      console.error(
        "Profile load failed",
        error.response?.data || error.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrder = (foodItem) => {
    try {
      const foodId = foodItem._id || foodItem.id;
      const newOrder = {
        id: `${foodId}-${Date.now()}`,
        foodId,
        foodName: foodItem.description || "Food item",
        price: foodItem.price || 0,
        partnerId: id,
        date: new Date().toISOString(),
      };
      const nextOrders = [...orders, newOrder];
      setOrders(nextOrders);
      console.log("Order placed:", newOrder, "All orders:", nextOrders);

      setOrderedItems((prev) => new Set(prev).add(foodId));
      showSuccess("Order Placed Successfully ✅");
    } catch (error) {
      console.log(error);
      showError("Failed to place order");
    }
  };

  const handleFollowChange = (partnerId, partnerName, isFollowing) => {
    // Update shared following state
    if (isFollowing) {
      // Add to following
      const newFollowing = [
        ...following,
        { _id: partnerId, name: partnerName },
      ];
      setFollowing(newFollowing);
      console.log("Following:", newFollowing);
    } else {
      // Remove from following
      const newFollowing = following.filter((p) => p._id !== partnerId);
      setFollowing(newFollowing);
      console.log("Unfollowed:", newFollowing);
    }
  };

  if (isLoading) {
    return (
      <main className="partner-profile-page">
        <div className="loading-state">Loading...</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="partner-profile-page">
        <div className="error-state">
          <p>Restaurant not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="partner-profile-page">
      <section className="partner-profile-header">
        <div className="partner-header-background">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop"
            alt="Restaurant banner"
            className="partner-banner-image"
          />
        </div>

        <div className="partner-header-content">
          <div className="partner-avatar-section">
            <div className="partner-avatar">
              {profile.name?.charAt(0).toUpperCase() || "R"}
            </div>
          </div>

          <div className="partner-info-section">
            <h1 className="partner-name">{profile.name}</h1>
            <p className="partner-address">{profile.address}</p>
            {profile.contact && (
              <p className="partner-contact">📞 {profile.contact}</p>
            )}

            <div className="partner-rating">⭐ 4.5 (120 reviews)</div>

            <div className="partner-stats">
              <div className="stat-item">
                <span className="stat-label">Total Meals</span>
                <span className="stat-value">{profile.totalMeals || "0"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Customers Served</span>
                <span className="stat-value">
                  {profile.customersServed || "0"}
                </span>
              </div>
            </div>

            <div className="partner-actions">
              <FollowButton
                foodPartnerId={id}
                foodPartnerName={profile.name}
                onFollowChange={handleFollowChange}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="partner-tabs-section">
        <div className="partner-tabs">
          <button
            className={`partner-tab ${activeTab === "menu" ? "is-active" : ""}`}
            onClick={() => setActiveTab("menu")}
          >
            Menu
          </button>
          <button
            className={`partner-tab ${activeTab === "reviews" ? "is-active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
          <button
            className={`partner-tab ${activeTab === "info" ? "is-active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Info
          </button>
        </div>

        <div className="partner-tab-content">
          {activeTab === "menu" && (
            <div className="menu-section">
              {videos.length === 0 ? (
                <div className="empty-menu">
                  <p>No menu items available</p>
                </div>
              ) : (
                <div className="menu-grid">
                  {videos.map((item) => (
                    <div key={item._id || item.id} className="food-card">
                      <div className="food-card-image">
                        <video
                          className="food-video"
                          src={item.video}
                          muted
                          preload="metadata"
                        />
                        <div className="food-card-overlay">
                          <button
                            className={`order-btn ${orderedItems.has(item._id || item.id) ? "ordered" : ""}`}
                            onClick={() => handleOrder(item)}
                            disabled={orderedItems.has(item._id || item.id)}
                          >
                            {orderedItems.has(item._id || item.id)
                              ? "Order Placed ✅"
                              : "Order"}
                          </button>
                        </div>
                      </div>
                      <div className="food-card-content">
                        <h3 className="food-item-name">{item.description}</h3>
                        <p className="food-item-price">
                          ₹{item.price || "150"}
                        </p>
                        <div className="food-item-meta">
                          <span className="likes">
                            ❤️ {item.likeCount || 0} Likes
                          </span>
                          <span className="saves">
                            🔖 {item.savesCount || 0} Saves
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="reviews-section">
              <div className="reviews-placeholder">
                <p>⭐ Reviews coming soon</p>
              </div>
            </div>
          )}

          {activeTab === "info" && (
            <div className="info-section">
              <div className="info-card">
                <h3>Contact Information</h3>
                <p>
                  <strong>Address:</strong> {profile.address}
                </p>
                {profile.contact && (
                  <p>
                    <strong>Phone:</strong> {profile.contact}
                  </p>
                )}
                {profile.ownerName && (
                  <p>
                    <strong>Owner:</strong> {profile.ownerName}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Profile;
