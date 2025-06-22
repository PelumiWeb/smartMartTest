import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FastImage from 'react-native-fast-image';
import Animated, { FadeIn } from 'react-native-reanimated';

type MovieCardProps = {
  movie: any;
  onPress?: (event: GestureResponderEvent) => void;
};

export default function MovieCard({ movie, onPress }: MovieCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    const checkFavorite = async () => {
      const favs = await AsyncStorage.getItem('favorites');
      const favArray = favs ? JSON.parse(favs) : [];
      setIsFavorite(favArray.some((fav: any) => fav.id === movie.id));
    };
    checkFavorite();
  }, [movie.id]);

  const toggleFavorite = async () => {
    const favs = await AsyncStorage.getItem('favorites');
    let favArray = favs ? JSON.parse(favs) : [];
    if (isFavorite) {
      favArray = favArray.filter((fav: any) => fav.id !== movie.id);
    } else {
      favArray.push(movie);
    }
    await AsyncStorage.setItem('favorites', JSON.stringify(favArray));
    setIsFavorite(!isFavorite);
  };
  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <FastImage
          source={{
            uri: `https://image.tmdb.org/t/p/w200${movie.poster_path}`,
            priority: FastImage.priority.normal,
          }}
          style={styles.poster}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.title}>
            {movie.title}
          </Text>
          <Text style={styles.meta}>
            {new Date(movie.release_date).getFullYear()} • ⭐{' '}
            {movie.vote_average}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleFavorite}>
        <Text style={{ color: isFavorite ? 'gold' : 'gray' }}>
          {isFavorite ? '★ Favorite' : '☆ Add to Favorites'}
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    overflow: 'hidden',
  },
  poster: {
    width: 100,
    height: 150,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: '#666',
  },
});
