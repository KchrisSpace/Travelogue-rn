import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MasonryFlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import { BASE_URL } from '../../const';
import { UserInfo, getUserInfo } from '../../services/userService';

// 定义搜索结果类型
interface SearchResult {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  image: string[];
  video?: string;
  type: 'post' | 'destination' | 'user';
  created_at?: string;
}

// 添加带有用户信息的扩展SearchResult接口
interface SearchResultWithUserInfo extends SearchResult {
  userInfo?: UserInfo;
}

// 搜索历史存储键
const SEARCH_HISTORY_KEY = 'user_search_history';

// 搜索栏组件
interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  handleSearch: () => void;
  onBack: () => void;
}

const SearchBar = ({
  searchText,
  setSearchText,
  handleSearch,
  onBack,
}: SearchBarProps) => {
  return (
    <View className="flex-row items-center">
      {/* 返回按钮 */}
      <TouchableOpacity onPress={onBack} className="px-2 flex-row items-center">
        <Ionicons
          name="chevron-back"
          size={24}
          color="#ff4d67"
          className="mr-2"
        />
      </TouchableOpacity>
      <View className="flex-1 flex-row items-center bg-white rounded-lg px-3 py-2 mr-2 shadow-sm">
        <Ionicons name="search" size={20} color="#666" className="mr-2" />
        <TextInput
          className="flex-1 text-base text-gray-800 outline-none"
          placeholder="搜索目的地、游记、攻略..."
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// 搜索历史和热门搜索组件
interface SearchSuggestionsProps {
  searchHistory: string[];
  hotTopics: string[];
  setSearchText: (text: string) => void;
  clearHistory: () => void;
}

const SearchSuggestions = ({
  searchHistory,
  hotTopics,
  setSearchText,
  clearHistory,
}: SearchSuggestionsProps) => {
  return (
    <ScrollView className="flex-1 mt-4">
      {searchHistory.length > 0 && (
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">搜索历史</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Ionicons name="trash-outline" size={18} color="#666" />
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap">
            {searchHistory.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="border border-gray-200 rounded-full py-2 px-4 mr-2 mb-2"
                onPress={() => setSearchText(item)}>
                <Text className="text-gray-800 text-sm">{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View className="mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-3">热门搜索</Text>
        <View className="flex-row flex-wrap">
          {hotTopics.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="border border-[#FBE4E9] rounded-full py-2 px-4 mr-2 mb-2"
              onPress={() => setSearchText(item)}>
              <Text className="text-gray-800 text-sm">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

// 搜索结果项组件
interface SearchResultItemProps {
  item: SearchResultWithUserInfo;
}

const SearchResultItem = ({ item }: SearchResultItemProps) => {
  // 随机高度，范围100-250之间
  const imageHeight = 100 + Math.floor(Math.random() * 150);

  // 获取用户信息
  const avatar = item.userInfo?.['user_info']?.avatar || `${BASE_URL}`;
  const nickname = item.userInfo?.['user_info']?.nickname || 'momo';

  // 格式化日期
  const createdDate = item.created_at
    ? new Date(item.created_at).toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
      })
    : '';

  return (
    <Pressable
      className="flex-1 flex-col bg-white m-1 rounded-lg overflow-hidden mb-2"
      onPress={() =>
        router.push({
          pathname: '/detail/[post_id]',
          params: { post_id: item.id, user_id: item.user_id },
        })
      }>
      <View className="rounded-t-lg" style={{ height: imageHeight }}>
        {item.video ? (
          <View className="w-full h-full bg-black">
            <Video
              source={{ uri: item.video }}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="cover"
              paused={true}
              controls={false}
            />
            <View className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
              <Ionicons name="videocam" size={16} color="white" />
            </View>
          </View>
        ) : (
          <Image
            source={{ uri: item.image[0] }}
            className="w-full h-full"
            resizeMode="cover"
          />
        )}
      </View>
      <View className="mx-2 mt-2 mb-3">
        <Text className="font-medium text-sm line-clamp-2">{item.title}</Text>
        <View className="flex flex-row items-center justify-start mt-2">
          <Image
            source={{ uri: avatar }}
            className="w-7 h-7 rounded-full border border-gray-200"
          />
          <View className="mx-2">
            <Text className="text-xs text-gray-600">{nickname}</Text>
            <Text className="text-[10px] text-gray-400">{createdDate}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

// 搜索结果列表组件
interface SearchResultsProps {
  results: SearchResultWithUserInfo[];
}

const SearchResults = ({ results }: SearchResultsProps) => {
  return (
    <View className="flex-1 h-full mt-4">
      <MasonryFlashList
        data={results}
        numColumns={2}
        renderItem={({ item }) => <SearchResultItem item={item} />}
        estimatedItemSize={300}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center pt-12">
            <Ionicons name="search-outline" size={50} color="#ccc" />
            <Text className="mt-4 text-gray-400 text-base">
              没有找到相关结果
            </Text>
          </View>
        }
      />
    </View>
  );
};

// 空结果提示组件
interface EmptyResultsProps {
  searchText: string;
  onReset: () => void;
}

const EmptyResults = ({ searchText, onReset }: EmptyResultsProps) => {
  return (
    <View className="flex-1 justify-center items-center pt-12">
      <Ionicons name="search-outline" size={50} color="#ccc" />
      <Text className="mt-4 text-gray-600 text-lg font-medium">
        未找到相关结果
      </Text>
      <Text className="mt-2 text-gray-400 text-base text-center px-8">
        没有找到与&quot;{searchText}&quot;相关的游记或目的地
      </Text>
      <Text className="mt-1 text-gray-400 text-base text-center px-8">
        请尝试其他关键词或浏览热门搜索
      </Text>
      <TouchableOpacity
        className="mt-6 bg-[#ff4d67] rounded-full py-2 px-6"
        onPress={onReset}>
        <Text className="text-white">返回搜索</Text>
      </TouchableOpacity>
    </View>
  );
};

// 加载指示器组件
const LoadingIndicator = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#0066CC" />
      <Text className="mt-3 text-gray-600 text-base">正在搜索...</Text>
    </View>
  );
};

// 主搜索组件
const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [resultsWithUserInfo, setResultsWithUserInfo] = useState<
    SearchResultWithUserInfo[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const hotTopics = [
    '热门景点',
    '美食推荐',
    '自驾游',
    '亲子游',
    '摄影圣地',
    '民宿',
    '徒步路线',
    '周末游',
    '一日游',
    '海岛游',
  ];

  // 加载搜索历史
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const historyJson = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
        if (historyJson) {
          const history = JSON.parse(historyJson);
          setSearchHistory(Array.isArray(history) ? history : []);
        }
      } catch (error) {
        console.error('加载搜索历史失败:', error);
      }
    };

    loadSearchHistory();
  }, []);

  // 保存搜索历史到本地存储
  const saveSearchHistory = async (history: string[]) => {
    try {
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('保存搜索历史失败:', error);
    }
  };

  // 当搜索结果变化时，获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (searchResults.length === 0) return;

      const resultsWithInfo: SearchResultWithUserInfo[] = [...searchResults];

      // 获取所有不重复的用户ID
      const userIds = [
        ...new Set(searchResults.map((result) => result.user_id)),
      ];

      // 批量获取用户信息
      try {
        const promises = userIds.map(async (userId) => {
          try {
            return await getUserInfo(userId);
          } catch (error) {
            console.error(`获取用户信息失败: ${userId}`, error);
            return null;
          }
        });

        const userInfoResults = await Promise.all(promises);

        // 创建用户ID到用户信息的映射
        const userInfoMap: Record<string, UserInfo> = {};
        userInfoResults.forEach((info) => {
          if (info) {
            userInfoMap[info.id] = info;
          }
        });

        // 将用户信息添加到搜索结果中
        const updatedResults = resultsWithInfo.map((result) => {
          return {
            ...result,
            userInfo: userInfoMap[result.user_id],
          };
        });

        setResultsWithUserInfo(updatedResults);
      } catch (error) {
        console.error('获取用户信息失败', error);
      }
    };

    fetchUserInfo();
  }, [searchResults]);

  // 更新搜索历史
  const updateSearchHistory = (keyword: string) => {
    // 如果历史中已经有这个关键词，先移除它
    const filteredHistory = searchHistory.filter((item) => item !== keyword);
    // 将新的关键词添加到历史的开头
    const newHistory = [keyword, ...filteredHistory].slice(0, 10);

    setSearchHistory(newHistory);
    saveSearchHistory(newHistory);
  };

  // 执行搜索
  const handleSearch = async () => {
    if (searchText.trim()) {
      // 更新搜索历史
      updateSearchHistory(searchText.trim());

      setIsLoading(true);
      setHasSearched(true);

      try {
        const response = await fetch(
          `${BASE_URL}/api/search?keyword=${encodeURIComponent(
            searchText.trim()
          )}`
        );
        if (!response.ok) {
          throw new Error('搜索请求失败');
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('搜索出错:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 清空搜索历史
  const clearHistory = async () => {
    setSearchHistory([]);
    try {
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('清空搜索历史失败:', error);
    }
  };

  // 返回搜索初始状态
  const resetSearch = () => {
    setHasSearched(false);
    setSearchResults([]);
    setResultsWithUserInfo([]);
  };

  // 处理返回
  const handleBack = () => {
    if (hasSearched) {
      resetSearch();
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
        onBack={handleBack}
      />

      {isLoading ? (
        <LoadingIndicator />
      ) : hasSearched ? (
        resultsWithUserInfo.length > 0 ? (
          <SearchResults results={resultsWithUserInfo} />
        ) : (
          <EmptyResults searchText={searchText} onReset={resetSearch} />
        )
      ) : (
        <SearchSuggestions
          searchHistory={searchHistory}
          hotTopics={hotTopics}
          setSearchText={setSearchText}
          clearHistory={clearHistory}
        />
      )}
    </View>
  );
};

export default Search;
