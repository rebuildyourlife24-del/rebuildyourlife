'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface HobbyCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  weeklyHoursGoal: number;
  weeklyHoursDone: number;
  color: string;
  glowColor: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  read: boolean;
}

interface HobbyForm {
  name: string;
  weeklyHoursGoal: string;
  emoji: string;
}

const defaultCategories: HobbyCategory[] = [
  {
    id: '1',
    name: 'Lezen',
    emoji: '📚',
    description: 'Boeken, artikelen en kennisopbouw',
    weeklyHoursGoal: 5,
    weeklyHoursDone: 3.5,
    color: '#00f0ff',
    glowColor: 'rgba(0,240,255,0.15)',
  },
  {
    id: '2',
    name: 'Sporten',
    emoji: '🏋️',
    description: 'Fysieke conditie en kracht',
    weeklyHoursGoal: 4,
    weeklyHoursDone: 4,
    color: '#00ffcc',
    glowColor: 'rgba(0,255,204,0.15)',
  },
  {
    id: '3',
    name: 'Creatief',
    emoji: '🎨',
    description: 'Tekenen, muziek, schrijven',
    weeklyHoursGoal: 3,
    weeklyHoursDone: 1,
    color: '#ff6b9d',
    glowColor: 'rgba(255,107,157,0.15)',
  },
  {
    id: '4',
    name: 'Leren',
    emoji: '🧠',
    description: 'Cursussen, vaardigheden, talen',
    weeklyHoursGoal: 6,
    weeklyHoursDone: 4.5,
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.15)',
  },
  {
    id: '5',
    name: 'Meditatie',
    emoji: '🧘',
    description: 'Mindfulness, rust en balans',
    weeklyHoursGoal: 2,
    weeklyHoursDone: 2,
    color: '#ffd500',
    glowColor: 'rgba(255,213,0,0.15)',
  },
];

const defaultBooks: Book[] = [
  { id: 'b1', title: 'Atomic Habits', author: 'James Clear', read: true },
  { id: 'b2', title: 'De Kracht van Nu', author: 'Eckhart Tolle', read: false },
  { id: 'b3', title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', read: true },
  { id: 'b4', title: 'Deep Work', author: 'Cal Newport', read: false },
  { id: 'b5', title: 'Mans Search for Meaning', author: 'Viktor Frankl', read: false },
  { id: 'b6', title: 'De 7 Gewoonten', author: 'Stephen Covey', read: false },
];

export default function GrowthPage() {
  const [categories, setCategories] = useState<HobbyCategory[]>(defaultCategories);
  const [books, setBooks] = useState<Book[]>(defaultBooks);
  const [isHobbyModalOpen, setIsHobbyModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [hobbyForm, setHobbyForm] = useState<HobbyForm>({ name: '', weeklyHoursGoal: '3', emoji: '⭐' });
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');

  const totalWeeklyGoal = categories.reduce((s, c) => s + c.weeklyHoursGoal, 0);
  const totalWeeklyDone = categories.reduce((s, c) => s + c.weeklyHoursDone, 0);

  const handleToggleBook = (id: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, read: !b.read } : b));
  };

  const handleAddHobby = (e: React.FormEvent) => {
    e.preventDefault();
    const newCat: HobbyCategory = {
      id: Date.now().toString(),
      name: hobbyForm.name,
      emoji: hobbyForm.emoji,
      description: 'Persoonlijke groei categorie',
      weeklyHoursGoal: parseInt(hobbyForm.weeklyHoursGoal) || 3,
      weeklyHoursDone: 0,
      color: '#00f0ff',
      glowColor: 'rgba(0,240,255,0.15)',
    };
    setCategories(prev => [...prev, newCat]);
    setHobbyForm({ name: '', weeklyHoursGoal: '3', emoji: '⭐' });
    setIsHobbyModalOpen(false);
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;
    setBooks(prev => [...prev, {
      id: Date.now().toString(),
      title: newBookTitle.trim(),
      author: newBookAuthor.trim() || 'Onbekend',
      read: false,
    }]);
    setNewBookTitle('');
    setNewBookAuthor('');
    setIsBookModalOpen(false);
  };

  const booksRead = books.filter(b => b.read).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-textPrimary"
          >
            Groei & Hobby&apos;s
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-sm text-textSecondary"
          >
            Groei is de brandstof van verandering — investeer elke week in jezelf.
          </motion.p>
        </div>
        <Button onClick={() => setIsHobbyModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Voeg Hobby Toe
        </Button>
      </div>

      {/* Weekly Overview */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-textPrimary">Weekoverzicht</h2>
              <p className="text-xs text-textSecondary mt-0.5">
                {totalWeeklyDone.toFixed(1)} / {totalWeeklyGoal} uur deze week
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gold">
                {Math.round((totalWeeklyDone / totalWeeklyGoal) * 100)}%
              </span>
              <p className="text-xs text-textSecondary">behaald</p>
            </div>
          </div>
          <ProgressBar
            value={totalWeeklyDone}
            max={totalWeeklyGoal}
            size="lg"
            color="gold"
          />
          <div className="mt-4 flex flex-wrap gap-3">
            {categories.map(cat => (
              <span key={cat.id} className="flex items-center gap-1.5 text-xs text-textSecondary">
                <span>{cat.emoji}</span>
                <span>{cat.weeklyHoursDone}/{cat.weeklyHoursGoal}u</span>
              </span>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Hobby Categories Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => {
          const pct = Math.min((cat.weeklyHoursDone / cat.weeklyHoursGoal) * 100, 100);
          const isComplete = pct >= 100;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
            >
              <Card
                variant="glass"
                className="p-5 flex flex-col gap-4 hover:border-gold/30 transition-all duration-300"
                style={isComplete ? { boxShadow: `0 0 24px ${cat.glowColor}` } : undefined}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-textPrimary text-sm">{cat.name}</h3>
                      <p className="text-xs text-textSecondary mt-0.5">{cat.description}</p>
                    </div>
                  </div>
                  {isComplete && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-success/20 text-success"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-textSecondary">Voortgang deze week</span>
                    <span className="font-semibold" style={{ color: cat.color }}>
                      {cat.weeklyHoursDone}u / {cat.weeklyHoursGoal}u
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, delay: 0.2 + i * 0.07, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                </div>

                <button
                  className="mt-auto text-xs text-textSecondary hover:text-textPrimary transition-colors flex items-center gap-1.5 pt-1 border-t border-white/5"
                  onClick={() => {
                    const increment = 0.5;
                    setCategories(prev =>
                      prev.map(c =>
                        c.id === cat.id
                          ? { ...c, weeklyHoursDone: Math.min(c.weeklyHoursDone + increment, c.weeklyHoursGoal + 5) }
                          : c
                      )
                    );
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  +30 min registreren
                </button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Boekendoelen */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-textPrimary flex items-center gap-2">
                <span>📖</span> Boekendoelen {new Date().getFullYear()}
              </h2>
              <p className="text-xs text-textSecondary mt-1">
                {booksRead} van {books.length} boeken gelezen dit jaar
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setIsBookModalOpen(true)}>
              Boek Toevoegen
            </Button>
          </div>

          <div className="mb-4">
            <ProgressBar value={booksRead} max={books.length} color="gold" size="sm" />
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {books.map(book => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`flex items-center gap-4 rounded-xl border p-3 transition-all ${
                    book.read
                      ? 'border-success/20 bg-success/5'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  <button
                    onClick={() => handleToggleBook(book.id)}
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                      book.read
                        ? 'bg-success border-success text-white'
                        : 'border-textSecondary hover:border-gold'
                    }`}
                  >
                    {book.read && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${book.read ? 'text-textSecondary line-through' : 'text-textPrimary'}`}>
                      {book.title}
                    </p>
                    <p className="text-xs text-textSecondary mt-0.5">{book.author}</p>
                  </div>
                  {book.read && (
                    <span className="text-xs text-success font-medium flex-shrink-0">Gelezen ✓</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>

      {/* Add Hobby Modal */}
      <Modal
        isOpen={isHobbyModalOpen}
        onClose={() => setIsHobbyModalOpen(false)}
        title="Hobby Toevoegen"
        description="Voeg een nieuwe groeicategorie toe aan je leven."
      >
        <form onSubmit={handleAddHobby} className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {['🎵', '🎯', '🌱', '✍️', '🚴', '🧪', '🎭', '🌍'].map(em => (
              <button
                key={em}
                type="button"
                onClick={() => setHobbyForm(f => ({ ...f, emoji: em }))}
                className={`text-2xl rounded-xl p-3 transition-all ${
                  hobbyForm.emoji === em ? 'bg-gold/20 border border-gold/50' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {em}
              </button>
            ))}
          </div>
          <Input
            label="Naam"
            required
            placeholder="bijv. Fotograferen"
            value={hobbyForm.name}
            onChange={e => setHobbyForm(f => ({ ...f, name: e.target.value }))}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-textSecondary">
              Weekdoel: <span className="text-gold font-bold">{hobbyForm.weeklyHoursGoal} uur</span>
            </label>
            <input
              type="range"
              min={1}
              max={20}
              value={hobbyForm.weeklyHoursGoal}
              onChange={e => setHobbyForm(f => ({ ...f, weeklyHoursGoal: e.target.value }))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00f0ff ${((parseInt(hobbyForm.weeklyHoursGoal) - 1) / 19) * 100}%, rgba(255,255,255,0.05) ${((parseInt(hobbyForm.weeklyHoursGoal) - 1) / 19) * 100}%)`
              }}
            />
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsHobbyModalOpen(false)}>Annuleren</Button>
            <Button type="submit">Toevoegen</Button>
          </div>
        </form>
      </Modal>

      {/* Add Book Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Boek Toevoegen"
      >
        <form onSubmit={handleAddBook} className="space-y-4">
          <Input
            label="Boektitel"
            required
            placeholder="bijv. Thinking, Fast and Slow"
            value={newBookTitle}
            onChange={e => setNewBookTitle(e.target.value)}
          />
          <Input
            label="Auteur"
            placeholder="bijv. Daniel Kahneman"
            value={newBookAuthor}
            onChange={e => setNewBookAuthor(e.target.value)}
          />
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsBookModalOpen(false)}>Annuleren</Button>
            <Button type="submit">Toevoegen</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
