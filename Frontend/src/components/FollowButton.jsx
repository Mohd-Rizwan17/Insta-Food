import React, { useState, useEffect } from "react";
import { useToast } from "./Toast";

const getStoredFollowing = () => {
  try {
    return JSON.parse(localStorage.getItem("following")) || [];
  } catch {
    return [];
  }
};

const setStoredFollowing = (list) => {
  try {
    localStorage.setItem("following", JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
};

const FollowButton = ({
  foodPartnerId,
  initialIsFollowing = false,
  onFollowChange,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    const storedFollowing = getStoredFollowing();
    setIsFollowing(storedFollowing.includes(foodPartnerId));
  }, [foodPartnerId]);

  const handleFollowToggle = () => {
    setIsLoading(true);
    try {
      const storedFollowing = getStoredFollowing();
      const nextFollowing = storedFollowing.includes(foodPartnerId)
        ? storedFollowing.filter((id) => id !== foodPartnerId)
        : [...storedFollowing, foodPartnerId];

      setStoredFollowing(nextFollowing);
      const nextState = nextFollowing.includes(foodPartnerId);
      setIsFollowing(nextState);

      if (onFollowChange) {
        onFollowChange(nextState);
      }

      showSuccess(nextState ? "Following" : "Unfollowed successfully");
    } catch (error) {
      console.log(error);
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
