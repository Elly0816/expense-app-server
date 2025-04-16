import { eq } from 'drizzle-orm';
import db from '../index';
import { type NewUser, type User, users } from '../schema/users';

export const addUser: (newUser: NewUser) => Promise<NewUser[] | Error> = async (newUser) => {
  const addedUsers = await db.insert(users).values(newUser).returning();

  if (addedUsers.length > 0) {
    return addedUsers;
  }
  throw new Error('Error adding the users to the db!');
};

export const getUser: (user: User) => Promise<User[] | Error> = async (user) => {
  const queriedUsers = await db.select().from(users).where(eq(users.id, user.id));
  if (queriedUsers) {
    return queriedUsers;
  }
  throw new Error('Error getting the user from the db!');
};

export const getUserById: (id: User['id']) => Promise<User[] | Error> = async (id) => {
  const queriedUsers = await db.select().from(users).where(eq(users.id, id));
  if (queriedUsers) {
    return queriedUsers;
  }
  throw new Error('Error getting the user from the db!');
};
