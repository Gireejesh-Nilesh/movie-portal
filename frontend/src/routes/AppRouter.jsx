import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import SearchPage from "../pages/Search/SearchPage";
import MoviesPage from "../pages/Movies/MoviesPage";
import TVShowsPage from "../pages/TVShows/TVShowsPage";
import AboutPage from "../pages/About/AboutPage";
import MovieDetailsPage from "../pages/MovieDetails/MovieDetailsPage";
import TVDetailsPage from "../pages/TVDetails/TVDetailsPage";
import PersonDetailsPage from "../pages/PersonDetails/PersonDetailsPage";
import FavoritesPage from "../pages/Favorites/FavoritesPage";
import HistoryPage from "../pages/History/HistoryPage";
import LoginPage from "../pages/Login/LoginPage";
import SignupPage from "../pages/Signup/SignupPage";
import AdminPage from "../pages/Admin/AdminPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import RouteTransitionLoader from "../components/common/RouteTransitionLoader";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <RouteTransitionLoader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/tv-shows" element={<TVShowsPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/tv/:id" element={<TVDetailsPage />} />
        <Route path="/person/:id" element={<PersonDetailsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
