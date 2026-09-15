import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api/client";
import { fallbackMenu } from "../data/fallback";

const ITEMS_PER_PAGE = 11;

function chunkItems(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function buildBookPages(categories) {
  const categoryPages = categories
    .filter((category) => category.isActive !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .flatMap((category) => {
      const items = (category.items || [])
        .filter((item) => item.isAvailable !== false)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

      if (!items.length) return [];

      return chunkItems(items, ITEMS_PER_PAGE).map((pageItems, chunkIndex) => ({
        ...category,
        _pageKey: `${category._id || category.title}-${chunkIndex}`,
        items: pageItems,
      }));
    });

  return [{ cover: true, _pageKey: "cover" }, ...categoryPages];
}

function MenuPage({ page, index, className = "", onAnimationEnd }) {
  if (page.cover) {
    return (
      <div
        className={`book-page menu-cover-page ${className}`}
        onAnimationEnd={onAnimationEnd}
      >
        <div className="menu-cover-brand">
          <span className="menu-cover-logo">
            <img src="/assets/lily-logo.jpg" alt="Lily" />
          </span>
          <div className="menu-cover-name">Lily</div>
          <div className="menu-cover-sub">Cafe & Restaurant</div>
          <div className="menu-cover-rule" />
          <div className="menu-cover-title">The Menu</div>
          <div className="menu-cover-quote">
            &ldquo;A cozy place for food &amp; privacy&rdquo;
          </div>
          <div className="menu-cover-hint">
            Click page or arrow <span>→</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`book-page ${className}`}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="book-title-row">
        <span className="book-mini-logo">
          <img src="/assets/lily-logo.jpg" alt="" />
        </span>
        <div>
          <h2 className="book-title">{page.title}</h2>
          <div className="book-sub">{page.subtitle}</div>
        </div>
      </div>

      <div className="menu-list">
        {(page.items || []).map((item, itemIndex) => (
          <div
            className="menu-row"
            key={item._id || `${page._pageKey}-${item.name}-${itemIndex}`}
          >
            <span>{item.name}</span>
            <span className="price">{item.price}</span>
          </div>
        ))}
      </div>

      <div className="menu-page-num">&mdash; page {index} &mdash;</div>
    </div>
  );
}

export default function Menu() {
  const [categories, setCategories] = useState(fallbackMenu);
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState(null);
  const touchStart = useRef(null);

  useEffect(() => {
    api
      .get("/menu")
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  const pages = useMemo(() => buildBookPages(categories), [categories]);

  useEffect(() => {
    if (index >= pages.length) setIndex(Math.max(0, pages.length - 1));
  }, [index, pages.length]);

  const go = (direction) => {
    if (turn) return;

    const next = index + direction;
    if (next < 0 || next >= pages.length) return;

    setTurn({ from: index, to: next, dir: direction });
  };

  const finishTurn = () => {
    if (!turn) return;
    setIndex(turn.to);
    setTurn(null);
  };

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, turn, pages.length]);

  const renderLayers = () => {
    if (!turn) {
      return <MenuPage page={pages[index]} index={index} className="current" />;
    }

    if (turn.dir > 0) {
      return (
        <>
          <MenuPage
            page={pages[turn.to]}
            index={turn.to}
            className="next-layer"
          />
          <MenuPage
            page={pages[turn.from]}
            index={turn.from}
            className="current turn-next"
            onAnimationEnd={finishTurn}
          />
        </>
      );
    }

    return (
      <>
        <MenuPage
          page={pages[turn.from]}
          index={turn.from}
          className="current"
        />
        <MenuPage
          page={pages[turn.to]}
          index={turn.to}
          className="current turn-prev"
          onAnimationEnd={finishTurn}
        />
      </>
    );
  };

  const pageClick = (event) => {
    if (event.target.closest(".book-control")) return;

    const rect = event.currentTarget.getBoundingClientRect();
    go(event.clientX - rect.left > rect.width / 2 ? 1 : -1);
  };

  const pagesBeingShown = turn
    ? [pages[turn.from], pages[turn.to]]
    : [pages[index]];

  const visibleItemCount = Math.max(
    0,
    ...pagesBeingShown.map((page) => (page?.cover ? 8 : page?.items?.length || 0))
  );
  const menuSizeClass = `menu-items-${Math.min(
    ITEMS_PER_PAGE,
    Math.max(8, visibleItemCount)
  )}`;

  return (
    <main className="menu-scene menu-scene-v3">
      <section className="menu-intro" aria-labelledby="menu-title">
        <div className="menu-script">Our Menu</div>
        <h1 id="menu-title" className="display">
          Flip through
          <br />
          our kitchen.
        </h1>
        <p>
          Take your time with the menu. Click the right side of the book to move
          forward, the left side to go back - or use the arrows.
        </p>
      </section>

      <div className="book-wrap book-wrap-v3">
        <div
          className={`book-cover book-cover-v3 ${menuSizeClass}`}
          onTouchStart={(event) => {
            touchStart.current = event.changedTouches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStart.current == null) return;

            const distance = event.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(distance) > 45) go(distance < 0 ? 1 : -1);
            touchStart.current = null;
          }}
        >
          <div className="book-pages" aria-live="polite" onClick={pageClick}>
            {renderLayers()}
          </div>

          <button
            className="book-control prev"
            aria-label="Previous page"
            disabled={index === 0 || Boolean(turn)}
            onClick={() => go(-1)}
          >
            ‹
          </button>

          <button
            className="book-control next"
            aria-label="Next page"
            disabled={index === pages.length - 1 || Boolean(turn)}
            onClick={() => go(1)}
          >
            ›
          </button>
        </div>
      </div>
    </main>
  );
}
