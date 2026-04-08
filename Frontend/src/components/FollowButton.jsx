import React, { useState } from "react";
import api from "../lib/api";
import { useToast } from "./Toast";

const FollowButton = ({
  foodPartnerId,
  initialIsFollowing = false,
  onFollowChange,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useToast();

  const handleFollowToggle = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(`/api/follow/${foodPartnerId}`);

      const newFollowState = response.data.isFollowing;
      setIsFollowing(newFollowState);

      if (onFollowChange) {
        onFollowChange(newFollowState);
      }
    } catch (error) {
      console.log(error.response?.data);
      showError("Follow failed");
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
