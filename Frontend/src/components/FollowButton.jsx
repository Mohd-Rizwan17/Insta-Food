import React, { useState } from "react";
import api from "../lib/api";

const FollowButton = ({
  foodPartnerId,
  initialIsFollowing = false,
  onFollowChange,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async () => {
    setIsLoading(true);
    try {
      // For now, we'll create a simple endpoint call
      // You'll need to add this to your backend
      const response = await api.post("/api/user/follow", {
        foodPartnerId,
      });

      const newFollowState = response.data.isFollowing;
      setIsFollowing(newFollowState);

      if (onFollowChange) {
        onFollowChange(newFollowState);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert(error.response?.data?.message || "Failed to toggle follow");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`follow-button ${isFollowing ? "is-following" : ""}`}
    >
      {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
