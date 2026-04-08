/**
 * User-specific likes/saves storage using localStorage
 * Structure:
 * {
 *   "likes": { userId1: [videoId1, videoId2], userId2: [videoId1] },
 *   "saves": { userId1: [videoId1], userId2: [] }
 * }
 */

const LIKES_KEY = "likes";
const SAVES_KEY = "saves";

const getAllLikes = () => {
  try {
    return JSON.parse(localStorage.getItem(LIKES_KEY)) || {};
  } catch {
    return {};
  }
};

const getAllSaves = () => {
  try {
    return JSON.parse(localStorage.getItem(SAVES_KEY)) || {};
  } catch {
    return {};
  }
};

const setAllLikes = (likes) => {
  try {
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
  } catch {
    console.warn("Could not save likes to localStorage");
  }
};

const setAllSaves = (saves) => {
  try {
    localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
  } catch {
    console.warn("Could not save saves to localStorage");
  }
};

/**
 * Get all video IDs that a specific user has liked
 */
export const getUserLikes = (userId) => {
  if (!userId) return [];
  const allLikes = getAllLikes();
  return allLikes[userId] || [];
};

/**
 * Get all video IDs that a specific user has saved
 */
export const getUserSaves = (userId) => {
  if (!userId) return [];
  const allSaves = getAllSaves();
  return allSaves[userId] || [];
};

/**
 * Check if a specific user has liked a video
 */
export const hasUserLiked = (userId, videoId) => {
  return getUserLikes(userId).includes(videoId);
};

/**
 * Check if a specific user has saved a video
 */
export const hasUserSaved = (userId, videoId) => {
  return getUserSaves(userId).includes(videoId);
};

/**
 * Toggle like for a user on a video
 * Returns true if now liked, false if unliked
 */
export const toggleLike = (userId, videoId) => {
  if (!userId || !videoId) return false;

  const allLikes = getAllLikes();
  if (!allLikes[userId]) {
    allLikes[userId] = [];
  }

  const userLikes = allLikes[userId];
  const index = userLikes.indexOf(videoId);

  if (index > -1) {
    // Unlike
    userLikes.splice(index, 1);
    setAllLikes(allLikes);
    return false;
  } else {
    // Like
    userLikes.push(videoId);
    setAllLikes(allLikes);
    return true;
  }
};

/**
 * Toggle save for a user on a video
 * Returns true if now saved, false if unsaved
 */
export const toggleSave = (userId, videoId) => {
  if (!userId || !videoId) return false;

  const allSaves = getAllSaves();
  if (!allSaves[userId]) {
    allSaves[userId] = [];
  }

  const userSaves = allSaves[userId];
  const index = userSaves.indexOf(videoId);

  if (index > -1) {
    // Unsave
    userSaves.splice(index, 1);
    setAllSaves(allSaves);
    return false;
  } else {
    // Save
    userSaves.push(videoId);
    setAllSaves(allSaves);
    return true;
  }
};

/**
 * Get total like count across all users for a video
 */
export const getTotalLikeCount = (videoId) => {
  const allLikes = getAllLikes();
  let count = 0;
  Object.values(allLikes).forEach((userLikes) => {
    if (userLikes.includes(videoId)) {
      count++;
    }
  });
  return count;
};

/**
 * Get total save count across all users for a video
 */
export const getTotalSaveCount = (videoId) => {
  const allSaves = getAllSaves();
  let count = 0;
  Object.values(allSaves).forEach((userSaves) => {
    if (userSaves.includes(videoId)) {
      count++;
    }
  });
  return count;
};
