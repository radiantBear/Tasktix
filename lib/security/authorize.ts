'use server';

import { redirect } from 'next/navigation';

import { getUser } from '../session';

export async function authorize() {
  if (!(await getUser())) {
    redirect('/signIn');
  }
}
