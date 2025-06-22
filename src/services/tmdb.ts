import axios from 'axios';
import { TMDB_API_KEY , BEARER_TOKEN} from '@env';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const fetchPopularMovies = async (page: number = 1) => {
  const res = await api.get('/movie/popular', {
    params: { page },
  })
  return res.data

}

export const searchMovies = async (query: string) => {
  const res = await api.get(`/search/movie`, { params: { query } });
  return res.data.results
}

export const getMovieDetails = async (id: number) => 
  (await api.get(`/movie/${id}`));
