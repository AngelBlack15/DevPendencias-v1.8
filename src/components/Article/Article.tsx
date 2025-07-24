// src/components/Article/Article.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './Article.css';

interface Post {
  id: string;
  title: string;
  description: string;
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
  
  // Manejador para el clic en el botón de visita
  const handleVisitTool = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    console.log('Intentando abrir URL:', url);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.error('URL no válida:', url);
    }
  };

  // Si no venía en state, lo buscamos por ID
  useEffect(() => {
    if (!post && params.id) {
      fetch(`${API_BASE}/links/${params.id}`)
        .then(res => res.json())
        .then((l: any) => {
          setPost({
            id: l._id,
            title: l.title,
            description: l.description,
            image: l.image || '/devpendenciasIMG/placeholder.png',
            tags: Array.isArray(l.tags) ? l.tags : [l.tags || 'Sin categoría'],
            url: formatUrl(l.url) // Aplicar formato a la URL
          });
        })
        .catch(console.error);
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

        <div className="article-description">
          <p>{post.description}</p>
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
            onClick={(e) => handleVisitTool(e, post.url)}
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
