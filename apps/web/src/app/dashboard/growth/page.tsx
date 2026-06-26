import GrowthClient from './GrowthClient';
import { getHabits, getBooks } from '@/actions/growth';

export default async function GrowthPage() {
  const habits = await getHabits();
  const books = await getBooks();

  return <GrowthClient initialHabits={habits} initialBooks={books} />;
}
