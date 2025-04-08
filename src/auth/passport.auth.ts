import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { type NewUser, type User } from '../db/schema/users';
import { addUser, getUserById } from '../db/queries/users.queries';

//Serialize user for the session

passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = ((await getUserById(id)) as User[])[0];
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_REDIRECT as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      /**
       * Check if the user exists in the database
       * If not, create a new user
       * Return the user object
       */

      let user: User;
      try {
        user = ((await getUserById(profile.id)) as User[])[0];
        if (!user) {
          const newUser: NewUser = {
            id: profile.id,
            email: profile.emails?.[0]?.value || '',
            name: profile.displayName,
            provider: 'google',
          };
          const addedUser = ((await addUser(newUser)) as User[])[0];
          if (addedUser) {
            done(null, addedUser);
          }
        }

        done(null, user);
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);
