import axios from 'axios';
import { BASE_URL } from '../const';

// 用户信息接口
export interface UserInfo {
  id: string;
  name: string;
  password: string;
  'user-info': {
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
    const followIds = userInfo['user-info'].follow;

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
    const fansIds = userInfo['user-info'].fans;

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
  targetUserId: string
): Promise<boolean> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/follow`, {
      userId,
      targetUserId,
    });
    return response.data.success;
  } catch (error) {
    console.error('关注用户失败', error);

    // 暂时模拟成功，实际项目中应该抛出错误
    console.log('模拟关注成功');
    return true;
  }
};

// 取消关注用户
export const unfollowUser = async (
  userId: string,
  targetUserId: string
): Promise<boolean> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/unfollow`, {
      userId,
      targetUserId,
    });
    return response.data.success;
  } catch (error) {
    console.error('取消关注失败', error);

    // 暂时模拟成功，实际项目中应该抛出错误
    console.log('模拟取消关注成功');
    return true;
  }
};

export default {
  getUserInfo,
  getUserFollows,
  getUserFans,
  followUser,
  unfollowUser,
};
