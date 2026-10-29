import { Image, Link, useListing, type Photo } from '@dripfunnel/storefront-core/theme'
import { Ornament } from './Ornament'
import { ProductCard } from './ProductCard'
import { cx } from './cx'
import art from '../styles/art.module.css'
import styles from '../styles/home.module.css'

type SpotlightProps = {
  collection: string
  /** The class that paints the banner's category photo. */
  picture: string | undefined
  /** The category's own picture, painted over the placeholder once the collection has one. */
  image: Photo | null
  eyebrow: string
  title: string
  body: string
  cta: string
  /** The banner sits left of the products, or right of them from tablet width up. */
  end?: boolean
}

/**
 * A category banner beside four of its products, between two temple-border bands.
 * Hidden until the collection has products, so an empty or missing collection leaves no gap.
 */
export const Spotlight = ({ collection, picture, image, eyebrow, title, body, cta, end = false }: SpotlightProps) => {
  const { items } = useListing({ collection })
  if (!items.length) return null
  const href = `/collections/${collection}/`
  return (
    <section className={styles.spotlight}>
      <div className={styles.templeBorder} />
      <div className={cx(styles.spotlightInner, end && styles.spotlightEnd)}>
        <div className={styles.spotlightAside}>
          <div className={cx(styles.spotlightBanner, art.art, picture)}>
            {image ? <Image image={image} alt="" ratio={1} sizes="(min-width: 768px) 50vw, 100vw" className={styles.cover} /> : null}
            <span className={styles.spotlightFrame} />
            <div className={styles.spotlightCopy}>
              <p className={styles.spotlightEyebrow}>{eyebrow}</p>
              <h2 className={styles.spotlightTitle}>{title}</h2>
              <Ornament className={styles.spotlightOrnament} />
              <p className={styles.spotlightBody}>{body}</p>
              <Link href={href} className={styles.gold}>
                {cta}
              </Link>
            </div>
          </div>
        </div>
        <ul className={styles.spotlightGrid}>
          {items.slice(0, 4).map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
      <div className={cx(styles.templeBorder, styles.templeBorderFlip)} />
    </section>
  )
}
