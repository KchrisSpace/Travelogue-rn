import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Carousel from 'react-native-reanimated-carousel';

type CarouselRenderItemInfo = {
  item: string;
  index: number;
};

interface PostMediaCarouselProps {
  mediaList: string[];
}

const PostMediaCarousel = ({ mediaList }: PostMediaCarouselProps) => {
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { width } = Dimensions.get('window');

  // 固定轮播图高度
  const CAROUSEL_HEIGHT = 400;

  if (!mediaList || mediaList.length === 0) {
    return null;
  }

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
        }}
        renderItem={({ item, index }: CarouselRenderItemInfo) => {
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
                source={{ uri: item }}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                }}
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
              currentImageIndex === i ? 'bg-[#ff4d67]' : 'bg-gray-400'
            }`}
          />
        ))}
      </View>

      {/* 图片查看器 */}
      <Modal visible={imageViewerVisible} transparent={true}>
        <ImageViewer
          imageUrls={mediaList.map((url) => ({ url })) || []}
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
    </View>
  );
};

export default PostMediaCarousel;
