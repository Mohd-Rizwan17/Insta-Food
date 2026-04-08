import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import ProfileTabs from "../../components/ProfileTabs";
import { useToast } from "../../components/Toast";
import "../../styles/user-profile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", email: "" });
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await api.get("/api/auth/session");
      if (response.data.user) {
        setUser(response.data.user);
        setEditForm({
          fullName: response.data.user.fullName || "",
          email: response.data.user.email || "",
        });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/api/user/profile", {
        fullName: editForm.fullName,
        email: editForm.email,
      });

      setUser((prev) => ({
        ...prev,
        fullName: editForm.fullName,
        email: editForm.email,
      }));

      setIsEditing(false);
      showSuccess("Profile updated successfully");
    } catch (error) {
      console.log(error.response?.data);
      showError("Profile update failed");
    }
  };

  const handleLogout = async () => {
    try {
      await api.get("/api/auth/logout");
      localStorage.removeItem("token");
      window.location.href = "/user/login";
    } catch (error) {
      console.error("Error logging out:", error);
      // Still clear localStorage and redirect even if API fails
      localStorage.removeItem("token");
      window.location.href = "/user/login";
    }
  };

  if (isLoading) {
    return (
      <div className="user-profile-page">
        <div className="loading-skeleton">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-page">
        <div className="error-state">
          <p>Please log in to view your profile</p>
          <a href="/user/login" className="login-link">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="user-profile-page">
      <section className="profile-header-section">
        <div className="profile-header-content">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {user.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>

          <div className="profile-user-info">
            <h1 className="profile-user-name">{user.fullName}</h1>
            <p className="profile-user-email">{user.email}</p>
            {user.phone && <p className="profile-user-phone">{user.phone}</p>}
          </div>

          <div className="profile-actions">
            <button className="edit-profile-btn" onClick={handleEditToggle}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {isEditing && (
          <form className="edit-profile-form" onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={editForm.fullName}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Save Changes
            </button>
          </form>
        )}
      </section>

      <ProfileTabs userId={user._id} />
    </main>
  );
};

export default UserProfile;
