import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Comment, NoteDetail, getNoteDetail } from '../../services/noteService';
import {
  UserInfo,
  checkIfFollowing,
  followUser,
  getUserInfo,
  unfollowUser,
} from '../../services/userService';
import PostAuthorHeader from '../components/PostAuthorHeader';
import PostComments from '../components/PostComments';
import PostContent from '../components/PostContent';
import PostHeader from '../components/PostHeader';
import PostMediaCarousel from '../components/PostMediaCarousel';

type MediaItem = {
  type: 'image' | 'video';
  url: string;
};

const Detail = () => {
  const { post_id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<NoteDetail | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [commentUsers, setCommentUsers] = useState<Record<string, UserInfo>>(
    {}
  );
  // 模拟当前登录用户ID，实际应从认证状态获取
  const currentUserId = 'user1';

  // 获取游记详情
  useEffect(() => {
    const fetchNoteDetail = async () => {
      if (!post_id) return;

      try {
        setLoading(true);
        const noteData = await getNoteDetail(post_id as string);
        setPost(noteData);

        // 获取游记作者信息
        if (noteData.user_id) {
          try {
            const authorInfo = await getUserInfo(noteData.user_id);
            setUserInfo(authorInfo);

            // 检查当前用户是否已关注作者
            if (currentUserId && authorInfo.id) {
              try {
                const followStatus = await checkIfFollowing(
                  currentUserId,
                  authorInfo.id
                );
                setIsFollowing(followStatus);
              } catch (error) {
                console.error('检查关注状态失败:', error);
              }
            }
          } catch (error) {
            console.error('获取作者信息失败', error);
          }
        }

        // 获取评论用户信息
        if (noteData.comments && noteData.comments.length > 0) {
          const commentUserIds = [
            ...new Set(noteData.comments.map((comment) => comment['user_id'])),
          ];

          try {
            const userInfoPromises = commentUserIds.map((id) =>
              getUserInfo(id)
            );
            const userInfoResults = await Promise.all(userInfoPromises);

            const userInfoMap: Record<string, UserInfo> = {};
            userInfoResults.forEach((info) => {
              userInfoMap[info.id] = info;
            });

            setCommentUsers(userInfoMap);
          } catch (error) {
            console.error('获取评论用户信息失败', error);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('获取游记详情失败', error);
        setLoading(false);
      }
    };

    fetchNoteDetail();
  }, [post_id, currentUserId]);

  const handleShare = async () => {
    if (!post) return;

    try {
      await Share.share({
        message: `查看这篇精彩游记: ${post.title}`,
        url: `https://yourapp.com/posts/${post.id}`, // 替换为实际的分享链接
        title: post.title,
      });
    } catch (error) {
      console.error('分享失败', error);
    }
  };

  const handleFollowPress = async () => {
    if (!userInfo || !userInfo.id || followLoading) return;

    try {
      setFollowLoading(true);

      if (isFollowing) {
        // 取消关注
        const success = await unfollowUser(currentUserId, userInfo.id);
        if (success) {
          setIsFollowing(false);
          console.log(`${userInfo.id} 关注状态已更改: 已取消关注`);
        }
      } else {
        // 关注
        const success = await followUser(currentUserId, userInfo.id);
        if (success) {
          setIsFollowing(true);
          console.log(`${userInfo.id} 关注状态已更改: 已关注`);
        }
      }

      // 重新获取用户信息以确保UI状态和服务器状态一致
      const updatedUserInfo = await getUserInfo(userInfo.id);
      setUserInfo(updatedUserInfo);
    } catch (error) {
      console.error('更改关注状态失败', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleCommentAdded = (newComment: Comment) => {
    if (!post) return;

    // 更新本地状态
    setPost({
      ...post,
      comments: [...post.comments, newComment],
    });

    // 如果没有此用户的信息，需要获取
    if (!commentUsers[newComment['user_id']]) {
      getUserInfo(newComment['user_id'])
        .then((userInfo) => {
          setCommentUsers({
            ...commentUsers,
            [newComment['user_id']]: userInfo,
          });
        })
        .catch((error) => {
          console.error('获取评论用户信息失败', error);
        });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2089dc" />
        <Text className="mt-2.5 text-base text-gray-500">加载中...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-base text-red-500">无法加载游记内容</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView className="flex-1 bg-white">
        {/* 作者信息和分享按钮 */}
        <View className="px-4 pt-3 flex-row items-center justify-between">
          {/* 返回按钮 */}
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              className="px-2 py-3 flex-row items-center">
              <Ionicons
                name="chevron-back"
                size={24}
                color="#ff4d67"
                className="mr-2"
              />
            </TouchableOpacity>
            <PostAuthorHeader
              userInfo={userInfo}
              currentUserId={currentUserId}
              onFollowPress={handleFollowPress}
              isFollowing={isFollowing}
            />
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="grey" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 媒体展示区域 */}
        <PostMediaCarousel
          mediaList={
            post.image
              ? [
                  // 如果有视频，将视频放在第一位
                  ...(post.video
                    ? [{ type: 'video' as const, url: post.video }]
                    : []),
                  // 添加所有图片
                  ...post.image.map((url) => ({
                    type: 'image' as const,
                    url: url,
                  })),
                ]
              : []
          }
        />

        {/* 标题 */}
        <PostHeader post={post} />

        {/* 内容区域 */}
        <PostContent content={post.content} userInfo={userInfo} post={post} />

        {/* 评论区域 */}
        <PostComments
          noteId={post.id}
          comments={post.comments}
          commentUsers={commentUsers}
          onCommentAdded={handleCommentAdded}
        />
      </ScrollView>
    </>
  );
};

export default Detail;
