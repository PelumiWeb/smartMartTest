import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { fetchMovieDetails } from '../features/movies/movieThunk';
import { useAppDispatch, useAppSelector } from '../app/hooks';

interface ScreenProps {
  route: any;
}

type MovieType = {
  movies: {
    selectedMovie: string;
  };
};

const width = Dimensions.get('screen').width;

export default function DetailScreen({ route }: ScreenProps) {
  const dispatch = useAppDispatch();
  const movie = useAppSelector((state: any) => state.movies.selectedMovie);
  const { id } = route.params;

  console.log(id, route, 'here is the id');

  useEffect(() => {
    dispatch(fetchMovieDetails(id));
  }, [id]);

  if (!movie) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.poster}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>

        <Text style={styles.meta}>
          🎬 {movie.genres.map((g: { name: string }) => g.name).join(', ')}
        </Text>

        <Text style={styles.meta}>📅 Release: {movie.release_date}</Text>
        <Text style={styles.meta}>⭐ Rating: {movie.vote_average}</Text>
        <Text style={styles.meta}>⏱ Runtime: {movie.runtime} min</Text>

        <Text style={styles.heading}>Overview</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
  },
  poster: {
    width: width,
    height: width * 1.5,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 4,
  },
  heading: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  overview: {
    fontSize: 15,
    color: '#ddd',
    lineHeight: 22,
  },
});
