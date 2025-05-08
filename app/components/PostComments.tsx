import { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Comment, addComment } from '../../services/noteService';
import { UserInfo } from '../../services/userService';

interface PostCommentsProps {
  noteId: string;
  comments: Comment[];
  commentUsers: Record<string, UserInfo>;
  onCommentAdded: (newComment: Comment) => void;
}

const PostComments = ({
  noteId,
  comments,
  commentUsers,
  onCommentAdded,
}: PostCommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleSubmitComment = async () => {
    if (!noteId || !newComment.trim()) return;

    try {
      setSubmittingComment(true);
      // 假设当前登录用户ID为"user1"，实际应该从认证状态获取
      const currentUserId = 'user1';

      // 调用API添加评论
      const newCommentObj = await addComment(noteId, currentUserId, newComment);

      // 评论添加成功后触发回调
      onCommentAdded(newCommentObj);
      setNewComment('');
    } catch (error) {
      console.error('添加评论失败', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const renderCommentList = () => {
    if (!comments || comments.length === 0) {
      return (
        <View className="p-4 items-center">
          <Text className="text-sm text-gray-400">
            暂无评论，快来发表第一条评论吧！
          </Text>
        </View>
      );
    }

    return (
      <View className="p-4">
        <Text className="text-lg font-bold mb-4">评论 ({comments.length})</Text>

        {comments.map((comment) => {
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

  return (
    <View>
      {/* 评论列表 */}
      <View className="border-t-8 border-t-gray-100">
        {renderCommentList()}
      </View>

      {/* 添加评论 */}
      <View className="p-2 flex-row items-end border-t border-t-gray-200 sticky bottom-0 bg-white">
        <TextInput
          className="flex-1 max-h-[40px] max-h-50px] border border-gray-300 rounded-full outline-none px-4 py-2 text-sm"
          placeholder="写下你的评论..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity
          className={`ml-2 ${
            !newComment.trim() || submittingComment
              ? 'bg-gray-400'
              : 'bg-[#F26371]'
          } rounded-full py-2 px-4 justify-center items-center`}
          onPress={handleSubmitComment}
          disabled={!newComment.trim() || submittingComment}>
          <Text className="text-white text-sm font-medium">
            {submittingComment ? '提交中...' : '发表'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostComments;
