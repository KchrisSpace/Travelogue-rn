import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
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
import { UserInfo, getUserInfo } from '../../services/userService';
import PostComments from '../components/PostComments';
import PostContent from '../components/PostContent';
import PostHeader from '../components/PostHeader';
import PostMediaCarousel from '../components/PostMediaCarousel';

const Detail = () => {
  const { post_id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<NoteDetail | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [commentUsers, setCommentUsers] = useState<Record<string, UserInfo>>(
    {}
  );

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
          } catch (error) {
            console.error('获取作者信息失败', error);
          }
        }

        // 获取评论用户信息
        if (noteData.comments && noteData.comments.length > 0) {
          const commentUserIds = [
            ...new Set(noteData.comments.map((comment) => comment['user-id'])),
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
  }, [post_id]);

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

  const handleCommentAdded = (newComment: Comment) => {
    if (!post) return;

    // 更新本地状态
    setPost({
      ...post,
      comments: [...post.comments, newComment],
    });

    // 如果没有此用户的信息，需要获取
    if (!commentUsers[newComment['user-id']]) {
      getUserInfo(newComment['user-id'])
        .then((userInfo) => {
          setCommentUsers({
            ...commentUsers,
            [newComment['user-id']]: userInfo,
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
          title: '游记详情',
          headerRight: () => (
            <TouchableOpacity onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#2089dc" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1 bg-white">
        {/* 媒体展示区域 */}
        <PostMediaCarousel mediaList={post.image || []} />

        {/* 标题和用户信息 */}
        <PostHeader post={post} userInfo={userInfo} />

        {/* 内容区域 */}
        <PostContent content={post.content} />

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
