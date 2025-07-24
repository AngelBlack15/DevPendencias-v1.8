// src/components/Article/Article.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './Article.css';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  date: string;
  visits: number;
  likes: number;
  isLiked: boolean;
  image: string;
  tags: string[];
  url: string;
}

const API_BASE = 'http://localhost:3000/api';

const Article: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(state?.post || null);

  // Función para validar y formatear la URL
  const formatUrl = (url: string): string => {
    console.log('URL original:', url);
    if (!url) {
      console.log('URL vacía');
      return '';
    }
    // Asegurarse de que la URL comience con http:// o https://
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') 
      ? url 
      : `https://${url}`;
    console.log('URL formateada:', formattedUrl);
    return formattedUrl;
  };
  
  // Si no venía en state, lo buscamos por ID
  useEffect(() => {
    if (!post && params.id) {
      fetch(`${API_BASE}/links/${params.id}`)
        .then(res => res.json())
        .then((l: any) => {
          console.log('Datos del post desde la API:', l);
          setPost({
            id: l._id,
            title: l.title,
            excerpt: (l.description || '').slice(0, 100) + (l.description && l.description.length > 100 ? '...' : ''),
            description: l.description || 'Sin descripción disponible',
            date: new Date(l.createdAt || Date.now()).toLocaleDateString(),
            visits: typeof l.visits === 'number' ? l.visits : 0,
            likes: typeof l.likes === 'number' ? l.likes : 0,
            isLiked: false,
            image: l.image || '/devpendenciasIMG/placeholder.png',
            tags: Array.isArray(l.tags) ? l.tags : [l.tags || 'Sin categoría'],
            url: formatUrl(l.url) // Aplicar formato a la URL
          });
        })
        .catch(error => {
          console.error('Error cargando el post:', error);
          // Mostrar mensaje de error al usuario
        });
    }
  }, [params.id, post]);

  if (!post) return <p>Cargando artículo…</p>;

  // Depuración: mostrar el objeto post en consola
  console.log('Post actual:', post);

  const handleBackToResources = () => {
    navigate('/recursos');
  };

  const handleContactClick = () => {
    console.log('Contacto clickeado');
  };

  return (
    <div className="article-container">
      <header className="article-header">
        <div className="logo-container" onClick={handleBackToResources}>
          <img 
            src="/devpendenciasIMG/logobros.svg" 
            alt="BrosValley Logo" 
            className="article-logo"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/logo-brosvalley.png';
            }}
          />
        </div>
        <button className="contact-button" onClick={handleContactClick}>
          Contáctanos
        </button>
      </header>

      <main className="article-content">
        <h1 className="article-title">{post.title}</h1>
        
        <div className="article-tags">
          {post.tags.map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
        </div>

        <div className="article-meta">
          <span className="article-date">
            Publicado el: {post.date}
          </span>
          <span className="article-visits">
            👁️ {post.visits} visitas
          </span>
          <span className="article-likes">
            ❤️ {post.likes} me gusta
          </span>
        </div>
        
        <div className="article-description">
          <h3>Descripción:</h3>
          <p>{post.excerpt || post.description || 'Sin descripción disponible'}</p>
        </div>

        {post.image && (
          <div className="article-image-container">
            <img 
              src={post.image} 
              alt={post.title} 
              className="article-image"
            />
          </div>
        )}

        <div className="article-actions">
          <button 
            onClick={() => window.open(post.url, '_blank', 'noopener,noreferrer')}
            className="visit-button"
            disabled={!post.url}
          >
            Visitar herramienta
          </button>
        </div>
      </main>
    </div>
  );
};

export default Article;
