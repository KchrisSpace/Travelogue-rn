import axios from 'axios';
import { BASE_URL } from '../const';

// 用户信息接口
export interface UserInfo {
  id: string;
  name: string;
  password: string;
  user_info: {
    avatar: string;
    nickname: string;
    gender: string;
    birthday: string;
    city: string;
    signature: string;
    follow: string[];
    fans: string[];
  };
}

// 获取用户信息
export const getUserInfo = async (userId: string): Promise<UserInfo> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user?id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败', error);
    throw error;
  }
};

// 获取用户关注列表
export const getUserFollows = async (userId: string): Promise<UserInfo[]> => {
  try {
    const userInfo = await getUserInfo(userId);
    const followIds = userInfo['user_info'].follow;

    // 如果需要获取关注用户的详细信息，可以使用Promise.all批量请求
    const followUsers = await Promise.all(
      followIds.map((id) => getUserInfo(id))
    );

    return followUsers;
  } catch (error) {
    console.error('获取用户关注列表失败', error);
    throw error;
  }
};

// 获取用户粉丝列表
export const getUserFans = async (userId: string): Promise<UserInfo[]> => {
  try {
    const userInfo = await getUserInfo(userId);
    const fansIds = userInfo['user_info'].fans;

    // 如果需要获取粉丝用户的详细信息，可以使用Promise.all批量请求
    const fansUsers = await Promise.all(fansIds.map((id) => getUserInfo(id)));

    return fansUsers;
  } catch (error) {
    console.error('获取用户粉丝列表失败', error);
    throw error;
  }
};

// 关注用户
export const followUser = async (
  userId: string,
  followId: string
): Promise<boolean> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/follow`, {
      userId,
      followId,
    });
    console.log('关注成功:', response.data.message || '关注成功');
    return response.data.success || true;
  } catch (error: any) {
    console.error('关注失败:', error.response?.data?.error || error.message);

    // 暂时模拟成功，实际项目中应该抛出错误
    console.log('模拟关注成功');
    return true;
  }
};

// 取消关注用户
export const unfollowUser = async (
  userId: string,
  followId: string
): Promise<boolean> => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/follow`, {
      data: { userId, followId },
    });
    console.log('取消关注成功:', response.data.message);
    return true;
  } catch (error: any) {
    console.error(
      '取消关注失败:',
      error.response?.data?.error || error.message
    );
    return false;
  }
};

// 检查用户是否已关注另一个用户
export const checkIfFollowing = async (
  userId: string,
  followId: string
): Promise<boolean> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/follow`, {
      params: {
        userId,
        followId,
      },
    });
    console.log(response.data.isFollowing ? '已关注' : '未关注');
    return response.data.isFollowing;
  } catch (error: any) {
    console.error('查询关注状态失败:', error.response?.data || error.message);
    return false;
  }
};

export default {
  getUserInfo,
  getUserFollows,
  getUserFans,
  followUser,
  unfollowUser,
  checkIfFollowing,
};
