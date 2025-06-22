import { createSlice } from '@reduxjs/toolkit';
import { fetchPopularMovies, fetchMovieDetails, searchMovies } from './movieThunk';



type initialProps = {
  popular: any,
  selectedMovie:string | null,
  searchResults?: [],
  loading: boolean,
  error?: string | null,
};

const initialState: initialProps = {
  popular: [],
  selectedMovie: null,
  searchResults: [],
  loading: false,
  error: null,
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },

    selectMovie: (state, action) => {
      state.popular = action.payload;
    },
    updateMovies: (state, action) => {
      state.popular = [...state.popular, ...action.payload]
    },

    setSearchMovies: (state, action) => {
      state.searchResults = action.payload;  // update searchResults separately
      state.popular = action.payload;        // replace popular with search results for UI
    },
  },
  extraReducers: (builder) => {
    builder
      // Popular
      .addCase(fetchPopularMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.popular = action.payload;
        state.loading = false;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Search
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      // Details
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.selectedMovie = action.payload.data;
      });
  },
});

export const { clearSelectedMovie, selectMovie, updateMovies, setSearchMovies } = movieSlice.actions;

export default movieSlice.reducer;
