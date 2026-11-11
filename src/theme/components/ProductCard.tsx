import { Image, Link, Price, useStorefront, type Money, type ProductCard as Card } from '@dripfunnel/storefront-core/theme'
import { WishlistButton } from './interactive/WishlistButton'
import styles from '../styles/shop.module.css'

/** Whether a price is more than nothing; a product priced at zero is shown as "Price on request". */
export const isPriced = (money: Money) => !/^-?0*\.?0*$/.test(money.amount)

export const ProductCard = ({ product }: { product: Card }) => {
  const { store, locale, t } = useStorefront()
  return (
    <article className={styles.card}>
      <WishlistButton productId={product.id} name={product.name} className={styles.cardWish} />
      <Link href={product.href} className={styles.cardLink}>
        <div className={styles.cardPicture}>
          {product.photo ? <Image image={product.photo} alt={product.photo.alt ?? product.name} ratio={0.8} sizes="(min-width: 900px) 25vw, 50vw" className={styles.cardImage} /> : <span className={styles.noPicture}>{t('shop.card.noPicture')}</span>}
          {product.badges[0] ? <span className={styles.badge}>{product.badges[0].label}</span> : null}
          {product.stock.inStock ? null : <span className={styles.soldOut}>{t('shop.card.soldOut')}</span>}
        </div>
        <h3 className={styles.cardName}>{product.name}</h3>
      </Link>
      <span className={styles.cardRule} aria-hidden="true" />
      {product.price && isPriced(product.price) ? (
        <p className={styles.cardPrice}>
          {product.from ? <span className={styles.from}>{t('shop.card.from')}</span> : null}
          <Price money={product.price} compareAt={product.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={styles.price} />
        </p>
      ) : (
        <p className={styles.cardPrice}>{t('shop.card.onRequest')}</p>
      )}
      <Link href={product.href} className={styles.cardMore}>
        {t('shop.card.view')}
        <svg className={styles.cardMoreIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </article>
  )
}

export const ProductGrid = ({ products, wide = false }: { products: readonly Card[]; wide?: boolean }) => (
  <ul className={wide ? styles.gridWide : styles.grid}>
    {products.map((p) => (
      <li key={p.id} className={styles.cell}>
        <ProductCard product={p} />
      </li>
    ))}
  </ul>
)

/** The grid's shape while its products load, so nothing moves when they arrive. */
export const GridPlaceholder = ({ label, count }: { label: string; count: number }) => (
  <ul className={styles.grid} aria-busy="true" aria-label={label}>
    {[...Array(count).keys()].map((i) => (
      <li key={i} className={styles.cell}>
        <div className={styles.skeletonPicture} />
        <div className={styles.skeletonLine} />
      </li>
    ))}
  </ul>
)
