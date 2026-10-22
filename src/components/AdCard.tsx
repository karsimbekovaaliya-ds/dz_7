import type { Ad } from '../types';

interface Props {
  ad: Ad;
  onDelete: (id: Ad['id']) => void;
}

export default function AdCard({ ad, onDelete }: Props) {
  const date = ad.createdAt ? new Date(ad.createdAt) : null;
  return (
    <article className="card">
      <h2>{ad.title}</h2>
      {ad.price !== undefined && !Number.isNaN(ad.price) && (
        <div className="price">{ad.price.toLocaleString('ru-RU')} ₽</div>
      )}
      <p>{ad.description}</p>
      <footer className="card-footer">
        <span className="muted">
          {ad.author ?? 'Аноним'}
          {date && !Number.isNaN(date.getTime()) ? ` · ${date.toLocaleDateString('ru-RU')}` : ''}
        </span>
        <button className="btn btn-danger" onClick={() => onDelete(ad.id)}>
          Удалить
        </button>
      </footer>
    </article>
  );
}
