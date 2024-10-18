/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

// Data Imports
import { db as userData } from '@/fake-db/apps/user-list'
import { icons as iconTest } from '@/fake-db/icons-test'

export const getUserData = async () => {
  return userData
}

export const getIconTest = async () => {
  return iconTest
}
