import axios from 'axios';
import { BASE_URL } from '../const';

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
    const response = await axios.get(`${BASE_URL}/api/notedetail?id=${noteId}`);
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
    const response = await axios.get(`${BASE_URL}/api/notes?user_id=${userId}`);
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
    const response = await axios.post(`${BASE_URL}/api/comments`, {
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
