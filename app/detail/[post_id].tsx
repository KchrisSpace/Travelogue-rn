import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { Stack,useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Carousel from 'react-native-reanimated-carousel';
import { Comment, NoteDetail, getNoteDetail } from '../../services/noteService';
import { UserInfo, getUserInfo } from '../../services/userService';

// 游记详情接口定义
interface PostDetail {
  id: string;
  user_id: string;
  title: string;
  content: string;
  image: string[];
  video?: string; // 可选的视频URL
  created_at: string;
  updated_at: string;
}

type CarouselRenderItemInfo = {
  item: string;
  index: number;
};

const Detail = () => {
  const { post_id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<NoteDetail | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [commentUsers, setCommentUsers] = useState<Record<string, UserInfo>>(
    {}
  );
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const videoRef = useRef<Video>(null);
  const [videoFullscreen, setVideoFullscreen] = useState(false);
  const { width } = Dimensions.get('window');

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

  const handleSubmitComment = async () => {
    if (!post || !newComment.trim()) return;

    try {
      setSubmittingComment(true);
      // 假设当前登录用户ID为"user1"，实际应该从认证状态获取
      const currentUserId = 'user1';

      // 在真实环境中调用API添加评论
      // await addComment(post.id, currentUserId, newComment);

      // 模拟添加评论，实际项目中应该刷新数据
      const newCommentObj: Comment = {
        id: `comment${Date.now()}`,
        'user-id': currentUserId,
        content: newComment,
        createdAt: new Date().toISOString(),
      };

      setPost({
        ...post,
        comments: [...post.comments, newCommentObj],
      });

      setNewComment('');
    } catch (error) {
      console.error('添加评论失败', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const toggleVideoFullscreen = async () => {
    if (videoRef.current) {
      if (videoFullscreen) {
        await videoRef.current.dismissFullscreenPlayer();
      } else {
        await videoRef.current.presentFullscreenPlayer();
      }
      setVideoFullscreen(!videoFullscreen);
    }
  };

  const renderMedia = () => {
    if (!post) return null;

    // 媒体列表
    const mediaList = post.image || [];

    return (
      <View className="h-[300px] relative">
        <Carousel
          width={width}
          height={300}
          data={mediaList}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          onSnapToItem={(index) => setCurrentImageIndex(index)}
          renderItem={({ item, index }: CarouselRenderItemInfo) => {
            return (
              <TouchableOpacity
                className="w-full h-[300px] relative"
                onPress={() => {
                  setCurrentImageIndex(index);
                  setImageViewerVisible(true);
                }}>
                <Image
                  source={{ uri: item }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            );
          }}
        />

        {/* 指示器 */}
        <View className="flex-row absolute bottom-[10px] self-center">
          {mediaList.map((_, i) => (
            <View
              key={i}
              className={`w-2 h-2 rounded-full mx-1 ${
                currentImageIndex === i ? 'bg-[#2089dc]' : 'bg-gray-400'
              }`}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderComments = () => {
    if (!post || !post.comments || post.comments.length === 0) {
      return (
        <View className="p-4 items-center border-t-8 border-t-gray-100">
          <Text className="text-sm text-gray-400">
            暂无评论，快来发表第一条评论吧！
          </Text>
        </View>
      );
    }

    return (
      <View className="p-4 border-t-8 border-t-gray-100">
        <Text className="text-lg font-bold mb-4">
          评论 ({post.comments.length})
        </Text>

        {post.comments.map((comment) => {
          const commentUser = commentUsers[comment['user-id']];

          return (
            <View key={comment.id} className="flex-row mb-4">
              <Image
                source={{
                  uri:
                    commentUser?.['user-info']?.avatar ||
                    'https://via.placeholder.com/40',
                }}
                className="w-9 h-9 rounded-full mr-2"
              />
              <View className="flex-1 bg-gray-100 rounded-lg p-2.5">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm font-medium">
                    {commentUser?.['user-info']?.nickname || '匿名用户'}
                  </Text>
                  <Text className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Text>
                </View>
                <Text className="text-sm leading-5">{comment.content}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
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
            <TouchableOpacity onPress={handleShare} >
              <Ionicons name="share-outline" size={24} color="#2089dc" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1 bg-white">
        {/* 媒体展示区域 */}
        {renderMedia()}

        {/* 标题和用户信息 */}
        <View className="p-4 border-b border-b-gray-200">
          <Text className="text-xl font-bold mb-3">{post?.title}</Text>
          <View className="flex-row items-center">
            <Image
              source={{
                uri:
                  userInfo?.['user-info']?.avatar ||
                  'https://via.placeholder.com/40',
              }}
              className="w-10 h-10 rounded-full mr-2.5"
            />
            <View className="flex-1">
              <Text className="text-base font-medium">
                {userInfo?.['user-info']?.nickname || '用户未知'}
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">
                {post ? new Date(post.createdAt).toLocaleDateString() : ''}
              </Text>
            </View>
          </View>

          {/* 用户签名 */}
          {userInfo?.['user-info']?.signature && (
            <Text className="text-sm text-gray-500 italic mt-2">
              {userInfo['user-info'].signature}
            </Text>
          )}
        </View>

        {/* 内容区域 */}
        <View className="p-4">
          <Text className="text-base leading-6 text-gray-800">
            {post?.content}
          </Text>
        </View>

        {/* 用户位置信息 */}
        {userInfo?.['user-info']?.city && (
          <View className="flex-row items-center px-4 pb-4">
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text className="text-sm text-gray-500 ml-1">
              {userInfo['user-info'].city}
            </Text>
          </View>
        )}

        {/* 评论区域 */}
        {renderComments()}

        {/* 添加评论 */}
        <View className="p-4 flex-row items-end border-t border-t-gray-200">
          <TextInput
            className="flex-1 min-h-[40px] max-h-[100px] border border-gray-300 rounded-full px-4 py-2 text-sm"
            placeholder="写下你的评论..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            className={`ml-2 ${
              !newComment.trim() || submittingComment
                ? 'bg-gray-400'
                : 'bg-[#2089dc]'
            } rounded-full py-2 px-4 justify-center items-center`}
            onPress={handleSubmitComment}
            disabled={!newComment.trim() || submittingComment}>
            <Text className="text-white text-sm font-medium">
              {submittingComment ? '提交中...' : '发表'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 图片查看器 */}
      <Modal visible={imageViewerVisible} transparent={true}>
        <ImageViewer
          imageUrls={post?.image.map((url) => ({ url })) || []}
          index={currentImageIndex}
          enableSwipeDown
          onSwipeDown={() => setImageViewerVisible(false)}
          onCancel={() => setImageViewerVisible(false)}
          saveToLocalByLongPress={false}
          renderIndicator={(currentIndex, allSize) => (
            <View className="absolute top-10 w-full flex-row justify-center px-4 z-50">
              <TouchableOpacity
                className="absolute top-0 left-4 p-1 bg-black/30 rounded-full"
                onPress={() => setImageViewerVisible(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-white text-base bg-black/30 px-2.5 py-0.5 rounded-lg">{`${currentIndex}/${allSize}`}</Text>
            </View>
          )}
        />
      </Modal>
    </>
  );
};

export default Detail;
