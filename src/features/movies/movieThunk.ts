import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPopularMovies as getPopular, searchMovies as search, getMovieDetails as getDetails } from '../../services/tmdb';

export const fetchPopularMovies = createAsyncThunk('movies/fetchPopular', async () => {
  const res =  await getPopular();

});

export const searchMovies = createAsyncThunk('movies/search', async (query: string) => {
  return await search(query);
});

export const fetchMovieDetails = createAsyncThunk('movies/details', async (id: number) => {
  return await getDetails(id);
});
