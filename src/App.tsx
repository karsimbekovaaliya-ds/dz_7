import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';

const ORIGIN = 'https://inai-col1.fishrungames.com';
const API_URL = ORIGIN + '/ads';

interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
}

function normalize(raw: Record<string, unknown>): Ad {
  const img = raw.image_url as string | null | undefined;
  return {
    id: Number(raw.id),
    title: String(raw.title ?? ''),
    description: String(raw.description ?? ''),
    price: Number(raw.price ?? 0),
    imageUrl: img ? (img.startsWith('http') ? img : ORIGIN + img) : null,
  };
}

export default function App() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Ошибка сервера: ' + res.status);
      const data = await res.json();
      setAds((data.items as Record<string, unknown>[]).map(normalize));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить объявления');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || price === '') {
      setError('Заполните заголовок, описание и цену');
      return;
    }
    setSending(true);
    setError(null);
    try {
      const body = new FormData();
      body.append('title', title.trim());
      body.append('description', description.trim());
      body.append('price', price);
      if (image) body.append('image', image);

      const res = await fetch(API_URL, { method: 'POST', body });
      if (!res.ok) throw new Error('Ошибка сервера: ' + res.status);

      setTitle('');
      setDescription('');
      setPrice('');
      setImage(null);
      setFileKey((k) => k + 1);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать объявление');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(API_URL + '/' + id, { method: 'DELETE' });
      if (!res.ok) throw new Error('Ошибка сервера: ' + res.status);
      setAds((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить объявление');
    }
  };

  const q = query.trim().toLowerCase();
  const visible = q
    ? ads.filter((a) => (a.title + ' ' + a.description).toLowerCase().includes(q))
    : ads;

  return (
    <div>
      <h1>Доска объявлений</h1>

      <form onSubmit={(e) => void handleSubmit(e)}>
        <h2>Новое объявление</h2>
        <p>
          <input
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </p>
        <p>
          <textarea
            placeholder="Описание"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </p>
        <p>
          <input
            type="number"
            min="0"
            placeholder="Цена"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </p>
        <p>
          <input
            key={fileKey}
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
        </p>
        <button type="submit" disabled={sending}>
          {sending ? 'Отправка…' : 'Опубликовать'}
        </button>
      </form>

      <hr />

      <input
        type="search"
        placeholder="Поиск по объявлениям"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />{' '}
      <button onClick={() => void load()} disabled={loading}>
        Обновить
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Загрузка…</p>}
      {!loading && !error && visible.length === 0 && <p>Объявлений нет.</p>}

      {visible.map((ad) => (
        <article key={ad.id} style={{ borderBottom: '1px solid #ccc', padding: '12px 0' }}>
          <h3>{ad.title}</h3>
          {ad.imageUrl && (
            <img src={ad.imageUrl} alt={ad.title} style={{ maxWidth: 200, display: 'block' }} />
          )}
          <p>{ad.description}</p>
          <p>
            <b>{ad.price.toLocaleString('ru-RU')} ₽</b>
          </p>
          <button onClick={() => void handleDelete(ad.id)}>Удалить</button>
        </article>
      ))}
    </div>
  );
}