import React from 'react';
import type { TocEntry } from '@api/articlesApi';
import './TableOfContents.css';

interface TableOfContentsProps {
  entries: TocEntry[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without scroll using pushState
      const newUrl = `${window.location.pathname}${window.location.search}#${id}`;
      window.history.pushState({ tocScroll: true }, '', newUrl);
    }
  };

  return (
    <nav className="toc" aria-label="Table of contents">
      <div className="toc__header">
        <svg
          className="toc__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <span className="toc__title">Содержание</span>
      </div>
      <div className="toc__content">
        <ul className="toc__list" role="list">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className={`toc__item toc__item--level-${entry.level}`}
            >
              <a
                href={`#${entry.id}`}
                className="toc__link"
                onClick={(e) => handleClick(e, entry.id)}
              >
                {entry.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TableOfContents;