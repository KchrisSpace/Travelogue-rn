import axios from "axios";

const API_URL = "http://localhost:3000";

export interface Travelogue {
  id: string;
  "user-id": string;
  title: string;
  date: string;
}

export const useTravelogue = () => {
  
  // 获取指定用户的游记
  const getTravelogues = async (userId?: string) => {
    try {
      const url = `${API_URL}/travelogue`;
      const response = await axios.get(url);
      let data = response.data;
      if (userId) {
        data = data.filter((item: any) => item["user-id"] === userId);
        console.log(data);
      }
      return data;
    } catch (error) {
      console.error("Error fetching travelogues:", error);
      throw error;
    }
  };

  // 获取单个游记
  const getTravelogue = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/travelogue/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching travelogue:", error);
      throw error;
    }
  };

  // 创建新游记
  const createTravelogue = async (travelogue: Omit<Travelogue, "id">) => {
    try {
      const response = await axios.post(`${API_URL}/travelogue`, travelogue);
      return response.data;
    } catch (error) {
      console.error("Error creating travelogue:", error);
      throw error;
    }
  };

  // 更新游记
  const updateTravelogue = async (
    id: string,
    travelogue: Partial<Travelogue>
  ) => {
    try {
      const response = await axios.patch(
        `${API_URL}/travelogue/${id}`,
        travelogue
      );
      return response.data;
    } catch (error) {
      console.error("Error updating travelogue:", error);
      throw error;
    }
  };

  // 删除游记
  const deleteTravelogue = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/travelogue/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting travelogue:", error);
      throw error;
    }
  };

  return {
    getTravelogues,
    getTravelogue,
    createTravelogue,
    updateTravelogue,
    deleteTravelogue,
  };
};
