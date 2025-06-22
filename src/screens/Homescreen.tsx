import React, { useEffect } from 'react';
import {
  FlatList,
  ActivityIndicator,
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import MovieCard from '../components/MovieCard';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchPopularMovies, searchMovies } from '../services/tmdb';
import {
  selectMovie,
  setSearchMovies,
  updateMovies,
} from '../features/movies/moviesSlice';

type HomeScreenProps = {
  navigation: any;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading2, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [movies, setMovies] = React.useState<any[]>([]);
  console.log(movies, 'Movies----');

  const { popular, loading } = useAppSelector(state => state.movies);

  useEffect(() => {
    const fetchInitialMovies = async () => {
      setLoading(true);
      try {
        const res = await fetchPopularMovies(1);
        dispatch(selectMovie(res.results));
        setTotalPages(res.total_pages);
        setPage(1);
      } catch (e) {
        console.error('Failed to fetch popular movies:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMovies();
  }, []);

  // Handle search
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchTerm.length > 1) {
        console.log('Searching...');
        const res = await searchMovies(searchTerm);
        console.log(res, 'response--------');
        dispatch(selectMovie(res)); // full search result array
        dispatch(setSearchMovies(res));
        setPage(1); // reset page if needed
      } else {
        // Fallback to popular if searchTerm is cleared
        const res = await fetchPopularMovies(1);
        dispatch(selectMovie(res.results));
        setTotalPages(res.total_pages);
        setPage(1);
      }
    }, 400); // debounce

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Load more (only for popular, not search)
  const loadMoreMovies = async () => {
    if (loadingMore || searchTerm.length > 1 || page >= totalPages) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    const res = await fetchPopularMovies(nextPage);
    console.log(res);
    dispatch(updateMovies(res.results));
    setPage(nextPage);
    setLoadingMore(false);
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View
      style={{
        backgroundColor: '#1C2230',
        // flex:1
      }}
    >
      <TextInput
        placeholder="Search movies..."
        placeholderTextColor="#888"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />
      <FlatList
        data={popular}
        keyExtractor={(item: { id: string }) => item.id.toString()}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => navigation.navigate('Detail', { id: item.id })}
          />
        )}
        onEndReached={loadMoreMovies}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" style={{ marginVertical: 16 }} />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: '#2B3245',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 16,
    fontSize: 16,
  },
});
