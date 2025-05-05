import axios from "axios";

const API_URL = "http://localhost:3000";

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export const useFollow = () => {
  // 获取用户的关注列表
  const getFollowings = async (userId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/follows?followerId=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching followings:", error);
      throw error;
    }
  };

  // 获取用户的粉丝列表
  const getFollowers = async (userId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/follows?followingId=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching followers:", error);
      throw error;
    }
  };

  // 关注用户
  const followUser = async (followerId: string, followingId: string) => {
    try {
      const followData = {
        followerId,
        followingId,
        createdAt: new Date().toISOString(),
      };
      const response = await axios.post(`${API_URL}/follows`, followData);
      return response.data;
    } catch (error) {
      console.error("Error following user:", error);
      throw error;
    }
  };

  // 取消关注
  const unfollowUser = async (followerId: string, followingId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/follows?followerId=${followerId}&followingId=${followingId}`
      );
      if (response.data.length > 0) {
        await axios.delete(`${API_URL}/follows/${response.data[0].id}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error unfollowing user:", error);
      throw error;
    }
  };

  // 检查是否已关注
  const checkIsFollowing = async (followerId: string, followingId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/follows?followerId=${followerId}&followingId=${followingId}`
      );
      return response.data.length > 0;
    } catch (error) {
      console.error("Error checking follow status:", error);
      throw error;
    }
  };

  return {
    getFollowings,
    getFollowers,
    followUser,
    unfollowUser,
    checkIsFollowing,
  };
};
