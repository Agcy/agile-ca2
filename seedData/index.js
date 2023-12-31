import userModel from '../api/users/userModel';
import users from './users';
import reviewModel from "../api/reviews/reviewModel";
import reviews from './reviews'
import dotenv from 'dotenv';
// import genreModel from '../api/genres/genreModel'
import movieModel from '../api/movies/movieModel';
import movies from './movies';

dotenv.config();

// deletes all user documents in collection and inserts test data
// deletes all user documents in collection and inserts test data
async function loadUsers() {
  console.log('load user Data');
  try {
    await userModel.deleteMany();
    await users.forEach(user => userModel.create(user));
    console.info(`${users.length} users were successfully stored.`);
  } catch (err) {
    console.error(`failed to Load user Data: ${err}`);
  }
}

// deletes all movies documents in collection and inserts test data
export async function loadMovies() {
  console.log('load seed data');
  console.log(movies.length);
  try {
    await movieModel.deleteMany();
    await movieModel.collection.insertMany(movies);
    console.info(`${movies.length} Movies were successfully stored.`);
  } catch (err) {
    console.error(`failed to Load movie Data: ${err}`);
  }
}

export async function loadReviews() {
  console.log('load seed data');
  console.log(reviews.length);
  try {
    await reviewModel.deleteMany();
    await reviewModel.collection.insertMany(reviews);
    console.info(`${reviews.length} Reviews were successfully stored.`);
  } catch (err) {
    console.error(`failed to Load review Data: ${err}`);
  }
}

if (process.env.NODE_ENV === 'test') {
  loadUsers();
  loadMovies();
  loadReviews()
}
