import React, { useState, useEffect } from "react";
import "../../styles/food-partner-profile.css";
import { useParams } from "react-router-dom";
import api from "../../lib/api";
import FollowButton from "../../components/FollowButton";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [id]);

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
        <div className="partner-header-background" />

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
              <FollowButton foodPartnerId={id} />
            </div>
          </div>
        </div>
      </section>

      <section className="partner-menu-section">
        <h2 className="section-title">Menu</h2>

        {videos.length === 0 ? (
          <div className="empty-menu">
            <p>No menu items available</p>
          </div>
        ) : (
          <div className="menu-grid">
            {videos.map((item) => (
              <div key={item._id || item.id} className="menu-card">
                <div className="menu-card-image">
                  <video
                    className="menu-video"
                    src={item.video}
                    muted
                    preload="metadata"
                  />
                  <div className="menu-card-overlay">
                    <button className="order-btn">Order</button>
                  </div>
                </div>
                <div className="menu-card-content">
                  <h3 className="menu-item-name">{item.description}</h3>
                  {item.price && (
                    <p className="menu-item-price">₹{item.price}</p>
                  )}
                  <div className="menu-item-meta">
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
      </section>

      <section className="ratings-reviews-section">
        <h2 className="section-title">Ratings & Reviews</h2>
        <div className="ratings-placeholder">
          <p>⭐ Coming soon</p>
        </div>
      </section>
    </main>
  );
};

export default Profile;
