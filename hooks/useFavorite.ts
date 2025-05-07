import axios from "axios";

const API_URL = "http://localhost:3000";

export interface Favorite {
  id: string;
  userId: string;
  travelogueId: string;
  createdAt: string;
}

export const useFavorite = () => {
  // 获取用户的所有收藏
  const getFavorites = async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/favorites?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  };

  // 获取收藏的游记详情
  const getFavoriteTravelogues = async (userId: string) => {
    try {
      // 获取收藏记录
      const favorites = await getFavorites(userId);

      // 获取每个收藏的游记详情
      const travelogues = await Promise.all(
        favorites.map(async (favorite: Favorite) => {
          const response = await axios.get(
            `${API_URL}/travelogue/${favorite.travelogueId}`
          );
          return response.data;
        })
      );

      return travelogues;
    } catch (error) {
      console.error("Error fetching favorite travelogues:", error);
      throw error;
    }
  };

  // 添加收藏
  const addFavorite = async (userId: string, travelogueId: string) => {
    try {
      const favoriteData = {
        userId,
        travelogueId,
        createdAt: new Date().toISOString(),
      };
      const response = await axios.post(`${API_URL}/favorites`, favoriteData);
      return response.data;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  };

  // 取消收藏
  const removeFavorite = async (userId: string, travelogueId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/favorites?userId=${userId}&travelogueId=${travelogueId}`
      );
      if (response.data.length > 0) {
        await axios.delete(`${API_URL}/favorites/${response.data[0].id}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  };

  // 检查是否已收藏
  const checkIsFavorited = async (userId: string, travelogueId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/favorites?userId=${userId}&travelogueId=${travelogueId}`
      );
      return response.data.length > 0;
    } catch (error) {
      console.error("Error checking favorite status:", error);
      throw error;
    }
  };

  return {
    getFavorites,
    getFavoriteTravelogues,
    addFavorite,
    removeFavorite,
    checkIsFavorited,
  };
};
