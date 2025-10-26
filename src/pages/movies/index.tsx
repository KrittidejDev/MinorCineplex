import NavAndFooterWithBanner from "@/components/MainLayout/NavAndFooterWithBanner";
import AllMoviesWidget from "@/components/Widgets/AllMoviesWidget";
import axios from "axios";
import { MovieDTO, MovieAPIRespons } from "@/types/movie";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

interface AllMoviesProps {
  movies: MovieDTO[];
}

function AllMovies({ movies }: AllMoviesProps) {
  return (
    <NavAndFooterWithBanner>
      <AllMoviesWidget initialMovies={movies} />
    </NavAndFooterWithBanner>
  );
}

export default AllMovies;

export async function getServerSideProps({ locale }: { locale: string }) {
  let movies: MovieDTO[] = [];
  try {
    const res = await axios.get<MovieAPIRespons>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/movies`
    );
    movies = res.data.data;
  } catch (err) {
    console.error("Failed to fetch movies", err);
    movies = [];
  }

  return {
    props: {
      movies,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
