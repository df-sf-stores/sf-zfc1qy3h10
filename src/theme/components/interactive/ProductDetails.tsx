'use client'

import { useEffect, useRef, useState } from 'react'
import { RichText, useStorefront } from '@dripfunnel/storefront-core/theme'
import styles from '../../styles/product.module.css'

export type InfoRow = { key: string; label: string; value: string }

/**
 * "Product Information": the chosen options and the product's specifications as a two-column table, then its description
 * as formatted text, held to about six lines with "Read more" when it runs longer.
 */
export const ProductDetails = ({ rows, description }: { rows: readonly InfoRow[]; description: string | null }) => {
  const { t } = useStorefront()
  const [expanded, setExpanded] = useState(false)
  const [long, setLong] = useState(false)
  const text = useRef<HTMLDivElement>(null)
  // Whether the clamped text hides anything: only then is "Read more" offered.
  useEffect(() => {
    const el = text.current
    if (el) setLong(el.scrollHeight > el.clientHeight + 4)
  }, [description])
  if (!rows.length && !description) return null
  return (
    <section className={styles.infoCard} aria-labelledby="product-information">
      <h2 id="product-information" className={styles.infoTitle}>
        {t('shop.product.information')}
      </h2>
      {rows.length ? (
        <dl className={styles.infoTable}>
          {rows.map((r) => (
            <div key={r.key} className={styles.infoRow}>
              <dt className={styles.infoLabel}>{r.label}</dt>
              <dd className={styles.infoValue}>{r.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {description ? (
        <>
          <h3 className={styles.descriptionTitle}>{t('shop.product.description')}</h3>
          <div ref={text} id="product-description" className={expanded ? styles.description : styles.descriptionClamped}>
            <RichText html={description} className={styles.richText} />
          </div>
          {long || expanded ? (
            <button type="button" className={styles.readMore} aria-expanded={expanded} aria-controls="product-description" onClick={() => setExpanded(!expanded)}>
              {expanded ? t('shop.product.readLess') : t('shop.product.readMore')}
              <svg className={expanded ? styles.readMoreIconUp : styles.readMoreIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          ) : null}
        </>
      ) : null}
    </section>
  )
}
