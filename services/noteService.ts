import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// 评论接口
export interface Comment {
  id: string;
  'user-id': string;
  content: string;
  createdAt: string;
}

// 游记详情接口
export interface NoteDetail {
  id: string;
  user_id: string;
  title: string;
  content: string;
  image: string[];
  status: string;
  createdAt: string;
  comments: Comment[];
}

// 获取游记详情
export const getNoteDetail = async (noteId: string): Promise<NoteDetail> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notedetail?id=${noteId}`);
    return response.data;
  } catch (error) {
    console.error('获取游记详情失败', error);
    throw error;
  }
};

// 获取指定用户的所有游记
export const getUserNotes = async (userId: string): Promise<NoteDetail[]> => {
  try {
    // 注意：这个API端点可能需要根据实际情况调整
    const response = await axios.get(`${API_BASE_URL}/notes?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('获取用户游记列表失败', error);
    throw error;
  }
};

// 添加评论
export const addComment = async (
  noteId: string,
  userId: string,
  content: string
): Promise<Comment> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/comments`, {
      noteId,
      userId,
      content,
    });
    return response.data;
  } catch (error) {
    console.error('添加评论失败', error);
    throw error;
  }
};

export default {
  getNoteDetail,
  getUserNotes,
  addComment,
};
