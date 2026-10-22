import { useState } from 'react';
import type { FormEvent } from 'react';
import type { NewAd } from '../types';

interface Props {
  onSubmit: (ad: NewAd) => Promise<void>;
}

export default function AdForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [author, setAuthor] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Заполните заголовок и описание');
      return;
    }
    setSending(true);
    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        price: price === '' ? undefined : Number(price),
        author: author.trim() || undefined,
      });
      setTitle('');
      setDescription('');
      setPrice('');
      setAuthor('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать объявление');
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="form" onSubmit={(e) => void handleSubmit(e)}>
      <h2>Новое объявление</h2>
      <input
        className="input"
        placeholder="Заголовок"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="input"
        placeholder="Описание"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="row">
        <input
          className="input"
          type="number"
          min="0"
          placeholder="Цена, ₽"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="input"
          placeholder="Автор / контакт"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      {error && <div className="alert">{error}</div>}
      <button className="btn" type="submit" disabled={sending}>
        {sending ? 'Отправка…' : 'Опубликовать'}
      </button>
    </form>
  );
}
