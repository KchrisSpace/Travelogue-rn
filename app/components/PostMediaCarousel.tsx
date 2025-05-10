import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Carousel from 'react-native-reanimated-carousel';
import Video from 'react-native-video';

type MediaItem = {
  type: 'image' | 'video';
  url: string;
};

type CarouselRenderItemInfo = {
  item: MediaItem;
  index: number;
};

interface PostMediaCarouselProps {
  mediaList: MediaItem[];
}

const PostMediaCarousel = ({ mediaList }: PostMediaCarouselProps) => {
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [videoFullscreen, setVideoFullscreen] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const { width } = Dimensions.get('window');

  // 固定轮播图高度
  const CAROUSEL_HEIGHT = 400;

  if (!mediaList || mediaList.length === 0) {
    return null;
  }

  const renderMediaItem = ({ item, index }: CarouselRenderItemInfo) => {
    if (item.type === 'video') {
      return (
        <TouchableOpacity
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
          }}
          onPress={() => setVideoFullscreen(true)}>
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {isVideoLoading && <ActivityIndicator size="large" color="#fff" />}
            <Video
              ref={videoRef}
              source={{ uri: item.url }}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="contain"
              controls={true}
              repeat={true}
              paused={!isVideoPlaying}
              onLoad={() => setIsVideoLoading(false)}
              onError={(error) => {
                console.error('视频加载错误:', error);
                setIsVideoLoading(false);
              }}
            />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          setCurrentImageIndex(index);
          setImageViewerVisible(true);
        }}>
        <Image
          source={{ uri: item.url }}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View className="relative" style={{ height: CAROUSEL_HEIGHT }}>
      <Carousel
        width={width}
        height={CAROUSEL_HEIGHT}
        data={mediaList}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 0,
        }}
        onSnapToItem={(index) => {
          setCurrentImageIndex(index);
          // 如果当前项不是视频，暂停视频播放
          if (mediaList[index].type !== 'video') {
            setIsVideoPlaying(false);
          } else {
            setIsVideoPlaying(true);
          }
        }}
        renderItem={renderMediaItem}
      />

      {/* 指示器 */}
      <View className="flex-row absolute bottom-[10px] self-center">
        {mediaList.map((_, i) => (
          <View
            key={i}
            className={`w-2 h-2 rounded-full mx-1 ${
              currentImageIndex === i ? 'bg-[#ff4d67]' : 'bg-gray-400'
            }`}
          />
        ))}
      </View>

      {/* 图片查看器 */}
      <Modal visible={imageViewerVisible} transparent={true}>
        <ImageViewer
          imageUrls={mediaList
            .filter((item) => item.type === 'image')
            .map((item) => ({ url: item.url }))}
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

      {/* 视频全屏播放器 */}
      <Modal visible={videoFullscreen} transparent={true}>
        <View className="flex-1 bg-black justify-center items-center">
          <TouchableOpacity
            className="absolute top-10 left-4 p-1 bg-black/30 rounded-full z-50"
            onPress={() => setVideoFullscreen(false)}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {isVideoLoading && <ActivityIndicator size="large" color="#fff" />}
            <Video
              ref={videoRef}
              source={{ uri: mediaList[0].url }}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="contain"
              controls={true}
              repeat={true}
              paused={false}
              onLoad={() => setIsVideoLoading(false)}
              onError={(error) => {
                console.error('视频加载错误:', error);
                setIsVideoLoading(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PostMediaCarousel;
