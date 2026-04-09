import React, { useState } from "react";
import { useToast } from "./Toast";

const FollowButton = ({
  foodPartnerId,
  foodPartnerName,
  initialIsFollowing = false,
  onFollowChange,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useToast();

  const handleFollowToggle = () => {
    setIsLoading(true);
    try {
      const nextState = !isFollowing;
      setIsFollowing(nextState);

      if (onFollowChange) {
        onFollowChange(foodPartnerId, foodPartnerName, nextState);
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
