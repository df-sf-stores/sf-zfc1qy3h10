'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Image, usePointer, useStorefront, Video, type Photo, type VideoFile } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import styles from '../../styles/product.module.css'

const swipePx = 40

const Arrow = ({ back }: { back?: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d={back ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
  </svg>
)

/**
 * The product's pictures, its video last: the chosen one large on a white square, the rest as thumbnails (a strip on the
 * left on desktop, a row below on phones and tablets). Arrows, swipes and the arrow keys move through them; pressing a
 * picture opens it full screen, where a press zooms in where the pointer is.
 */
export const Gallery = ({ photos, video, name }: { photos: readonly Photo[]; video: VideoFile | null; name: string }) => {
  const { t } = useStorefront()
  const [shown, setShown] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)
  const swipeFrom = useRef<number | null>(null)
  const first = photos[0]
  // The photos, and the video after them when there's a photo to be its poster.
  const count = (video && first ? [...photos, video] : photos).length
  // A new version's photos come first, so the gallery goes back to the start when they change.
  const firstUrl = first?.url
  useEffect(() => setShown(0), [firstUrl])
  // Core's <Video> needs a poster (storefront ARCHITECTURE §2.1), so a product with no photo shows no video either.
  if (!first) return <div className={styles.noPicture} />
  const index = Math.min(shown, count - 1)
  const playing = video !== null && index === photos.length
  const photo = photos[Math.min(index, photos.length - 1)] ?? first
  const go = (to: number) => setShown((to + count) % count)
  const keys = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(index - 1)
    else if (e.key === 'ArrowRight') go(index + 1)
  }
  const swipeStart = (e: PointerEvent) => {
    swipeFrom.current = e.clientX
  }
  const swipeEnd = (e: PointerEvent) => {
    if (swipeFrom.current === null) return
    const dx = e.clientX - swipeFrom.current
    swipeFrom.current = null
    if (Math.abs(dx) > swipePx) go(index + (dx < 0 ? 1 : -1))
  }
  const many = count > 1
  // Each picture's place, counted from one, for "Image 2 of 3" and "2 / 3".
  const places = [...Array(count + 1).keys()].slice(1)
  const place = places[index] ?? count
  return (
    <div className={cx(styles.gallery, many && styles.galleryWithThumbs)} onKeyDown={keys}>
      <div className={styles.stage} onPointerDown={swipeStart} onPointerUp={swipeEnd}>
        {playing && video ? (
          <Video video={video} poster={first} label={name} ratio={1} className={styles.media} />
        ) : (
          <button type="button" className={styles.stageButton} aria-label={t('shop.product.gallery.open', { n: place, count })} onClick={() => setZoomOpen(true)}>
            <Image image={photo} alt={photo.alt ?? name} ratio={1} sizes="(min-width: 1024px) 50vw, 100vw" className={styles.media} />
          </button>
        )}
        {many ? (
          <>
            <button type="button" className={cx(styles.stageArrow, styles.stagePrev)} aria-label={t('shop.product.gallery.previous')} onClick={() => go(index - 1)}>
              <Arrow back />
            </button>
            <button type="button" className={cx(styles.stageArrow, styles.stageNext)} aria-label={t('shop.product.gallery.next')} onClick={() => go(index + 1)}>
              <Arrow />
            </button>
            <span className={styles.counter} aria-hidden="true">
              {t('shop.product.gallery.counter', { n: place, count })}
            </span>
            <span className={styles.dots} aria-hidden="true">
              {[...Array(count).keys()].map((i) => (
                <span key={i} className={i === index ? styles.dotOn : styles.dot} />
              ))}
            </span>
          </>
        ) : null}
      </div>
      {many ? (
        <ul className={styles.thumbs}>
          {photos.map((p, i) => (
            <li key={p.url}>
              <button
                type="button"
                className={i === index ? styles.thumbOn : styles.thumb}
                aria-label={t('shop.product.gallery.image', { n: places[i] ?? count, count })}
                aria-current={i === index}
                onClick={() => setShown(i)}
              >
                <Image image={p} alt="" ratio={1} sizes="80px" className={styles.thumbImage} />
              </button>
            </li>
          ))}
          {video ? (
            <li>
              <button type="button" className={playing ? styles.thumbOn : styles.thumb} aria-label={t('shop.product.video')} aria-current={playing} onClick={() => setShown(photos.length)}>
                <Image image={first} alt="" ratio={1} sizes="80px" className={styles.thumbImage} />
                <svg className={styles.play} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M9 7l8 5-8 5z" />
                </svg>
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}
      {zoomOpen ? <Lightbox photos={photos} start={Math.min(index, photos.length - 1)} name={name} onClose={() => setZoomOpen(false)} /> : null}
    </div>
  )
}

/** The pictures full screen, over a dark veil. A press zooms in twice over where the pointer is; Escape closes it. */
const Lightbox = ({ photos, start, name, onClose }: { photos: readonly Photo[]; start: number; name: string; onClose: () => void }) => {
  const { t } = useStorefront()
  const [shown, setShown] = useState(start)
  const [zoomed, setZoomed] = useState(false)
  const closer = useRef<HTMLButtonElement>(null)
  const area = useRef<HTMLDivElement>(null)
  const pointer = usePointer(area)
  const count = photos.length
  const photo = photos[shown] ?? photos[0]
  const places = [...Array(count + 1).keys()].slice(1)
  const go = (to: number) => {
    setZoomed(false)
    setShown((to + count) % count)
  }
  useEffect(() => closer.current?.focus(), [])
  // The zoom follows the pointer: the picture's transform origin is where it rests.
  useEffect(() => {
    if (!pointer) return
    area.current?.style.setProperty('--zoom-x', `${Math.round(pointer.x * 100)}%`)
    area.current?.style.setProperty('--zoom-y', `${Math.round(pointer.y * 100)}%`)
  }, [pointer])
  if (!photo) return null
  return (
    <div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={name}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
        else if (e.key === 'ArrowLeft') go(shown - 1)
        else if (e.key === 'ArrowRight') go(shown + 1)
        e.stopPropagation()
      }}
    >
      <button ref={closer} type="button" className={styles.lightboxClose} aria-label={t('shop.product.gallery.close')} onClick={onClose}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <div ref={area} className={styles.lightboxArea}>
        <button type="button" className={zoomed ? styles.lightboxZoomed : styles.lightboxImage} aria-pressed={zoomed} aria-label={t('shop.product.gallery.zoom')} onClick={() => setZoomed(!zoomed)}>
          <Image image={photo} alt={photo.alt ?? name} ratio={1} sizes="100vw" className={styles.lightboxPicture} />
        </button>
      </div>
      {count > 1 ? (
        <>
          <button type="button" className={cx(styles.lightboxArrow, styles.stagePrev)} aria-label={t('shop.product.gallery.previous')} onClick={() => go(shown - 1)}>
            <Arrow back />
          </button>
          <button type="button" className={cx(styles.lightboxArrow, styles.stageNext)} aria-label={t('shop.product.gallery.next')} onClick={() => go(shown + 1)}>
            <Arrow />
          </button>
          <span className={styles.lightboxCounter}>{t('shop.product.gallery.counter', { n: places[shown] ?? count, count })}</span>
        </>
      ) : null}
    </div>
  )
}
