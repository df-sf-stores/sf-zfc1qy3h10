import { Breadcrumbs, LegalNotices, Link, Price, useProduct, useProducts, useStorefront, type Product, type ProductPage as Page } from '@dripfunnel/storefront-core/theme'
import { BuyButtons, useWhatsAppAbout, WhatsAppIcon } from '../components/interactive/BuyButtons'
import { Gallery } from '../components/interactive/Gallery'
import { Options } from '../components/interactive/Options'
import { ProductDetails, type InfoRow } from '../components/interactive/ProductDetails'
import { Retry } from '../components/interactive/Retry'
import { TrustBadges } from '../components/interactive/TrustBadges'
import { WishlistButton } from '../components/interactive/WishlistButton'
import { Layout } from '../components/Layout'
import { Notice } from '../components/Notice'
import { isPriced, ProductGrid } from '../components/ProductCard'
import shop from '../styles/shop.module.css'
import styles from '../styles/product.module.css'

/** The product page's shape while it loads: a square picture with four thumbnails beside lines of text. */
const Skeleton = ({ label }: { label: string }) => (
  <div className={styles.product} aria-busy="true" aria-label={label}>
    <div className={styles.skeletonGallery}>
      <div className={styles.skeletonThumbs}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={styles.skeletonThumb} />
        ))}
      </div>
      <span className={styles.skeletonStage} />
    </div>
    <div className={styles.info}>
      <span className={styles.skeletonTitle} />
      <span className={styles.skeletonTitleShort} />
      <span className={styles.skeletonPrice} />
      <span className={styles.skeletonButtons} />
      <span className={styles.skeletonCard} />
    </div>
  </div>
)

/** How much the compare-at price is cut, in whole percent, or null when it isn't. */
const percentOff = (page: Page): number | null => {
  if (!page.price || !page.compareAt) return null
  const now = Number(page.price.amount)
  const was = Number(page.compareAt.amount)
  if (!(was > now) || !(now > 0)) return null
  return Math.round(((was - now) / was) * 100)
}

/** The chosen options and the specifications that apply to the chosen version, as the information table's rows. */
const infoRows = (page: Page, product: Product): InfoRow[] => [
  ...page.options.flatMap((o) => {
    const value = o.values.find((v) => v.selected) ?? (o.values.length === 1 ? o.values[0] : undefined)
    return value ? [{ key: `option-${o.id}`, label: o.name, value: value.name }] : []
  }),
  ...product.specs.filter((s) => s.versionId === null || s.versionId === page.version?.id).map((s) => ({ key: `spec-${s.name}-${s.versionId ?? ''}`, label: s.name, value: s.value })),
]

/** The product's related products; where it has none, the store's newest others stand in under "More to explore". */
const Related = ({ product }: { product: Product }) => {
  const { t } = useStorefront()
  const newest = useProducts({ sort: 'newest', first: 5 })
  const own = product.related.length > 0
  const items = own ? product.related.slice(0, 4) : newest.products.filter((p) => p.id !== product.id).slice(0, 4)
  if (!items.length) return null
  return (
    <section className={styles.related} aria-labelledby="related-title">
      <p className={styles.eyebrow}>{t('shop.product.relatedEyebrow')}</p>
      <h2 id="related-title" className={styles.relatedTitle}>
        {own ? t('shop.product.related') : t('shop.product.moreToExplore')}
      </h2>
      <ProductGrid products={items} wide />
    </section>
  )
}

/** "Have a question?": a WhatsApp chat that opens with the product's name already written. */
const Question = ({ name }: { name: string }) => {
  const { t } = useStorefront()
  const href = useWhatsAppAbout(name)
  if (!href) return null
  return (
    <aside className={styles.question}>
      <div>
        <h2 className={styles.questionTitle}>{t('shop.product.question.title')}</h2>
        <p className={styles.questionLead}>{t('shop.product.question.lead')}</p>
      </div>
      <Link href={href} className={styles.questionButton}>
        <WhatsAppIcon className={styles.buttonIcon} />
        {t('shop.product.question.action')}
      </Link>
    </aside>
  )
}

export const ProductPage = () => {
  const { store, locale, t } = useStorefront()
  const page = useProduct()
  const product = page.product
  if (page.status === 'missing' || page.status === 'error' || !product) {
    return (
      <Layout>
        <section className={shop.page}>
          {page.status === 'missing' ? (
            <Notice main title={t('shop.product.missing')} lead={t('shop.product.missingLead')}>
              <Link href="/collections/all/" className={shop.primary}>
                {t('shop.collection.browse')}
              </Link>
            </Notice>
          ) : page.status === 'error' ? (
            <Notice main title={t('shop.product.failed')} lead={t('shop.listing.failedLead')}>
              <Retry label={t('shop.listing.retry')} onRetry={page.retry} />
            </Notice>
          ) : (
            <Skeleton label={t('shop.product.loading')} />
          )}
        </section>
      </Layout>
    )
  }
  const firstMissing = page.missing[0]
  const off = percentOff(page)
  const priced = page.price !== null && isPriced(page.price)
  return (
    <Layout>
      <section className={styles.page}>
        <Breadcrumbs crumbs={[{ label: t('shop.crumbs.home'), href: '/' }, { label: product.name, href: product.href }]} t={t} className={styles.crumbs} />
        <div className={styles.product}>
          <div className={styles.galleryColumn}>
            <Gallery photos={page.photos} video={product.video} name={product.name} />
          </div>
          <div className={styles.info}>
            <div className={styles.titleRow}>
              <div className={styles.titleText}>
                {product.badges[0] ? <span className={styles.badge}>{product.badges[0].label}</span> : null}
                <h1 className={styles.title}>{product.name}</h1>
              </div>
              <WishlistButton productId={product.id} versionId={page.version?.id ?? null} name={product.name} />
            </div>
            <div className={styles.priceBlock}>
              {page.price && priced ? (
                <p className={styles.price}>
                  {page.from ? <span className={styles.from}>{t('shop.card.from')}</span> : null}
                  <Price money={page.price} compareAt={page.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={styles.priceTag} />
                  {off ? <span className={styles.off}>{t('shop.product.off', { percent: off })}</span> : null}
                </p>
              ) : (
                <p className={styles.price}>
                  <span className={styles.onRequest}>{t('shop.card.onRequest')}</span>
                </p>
              )}
            </div>
            <span className={styles.rule} aria-hidden="true">
              <span className={styles.ruleMark} />
            </span>
            {page.options.some((o) => o.values.length > 1) ? <Options page={page} /> : null}
            <p className={styles.stock} role="status">
              {firstMissing ? t('shop.product.choose', { option: firstMissing.name }) : page.stock?.inStock ? t('shop.product.inStock') : t('shop.product.outOfStock')}
            </p>
            <BuyButtons page={page} />
            <TrustBadges />
            {product.highlights.length ? (
              <ul className={styles.highlights}>
                {product.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            ) : null}
            <ProductDetails rows={infoRows(page, product)} description={product.description} />
            <LegalNotices notices={product.legal} t={t} className={styles.legal} />
            {product.returns || product.warranty || product.faqs.length ? (
              <div className={styles.sections}>
                {product.returns || product.warranty ? (
                  <details className={styles.section}>
                    <summary className={styles.summary}>{t('shop.product.delivery')}</summary>
                    {product.returns ? <p className={styles.body}>{product.returns}</p> : null}
                    {product.warranty ? (
                      <p className={styles.body}>
                        <strong>{t('shop.product.warranty')}</strong> {product.warranty}
                      </p>
                    ) : null}
                  </details>
                ) : null}
                {product.faqs.length ? (
                  <details className={styles.section}>
                    <summary className={styles.summary}>{t('shop.product.questions')}</summary>
                    <dl className={styles.faqs}>
                      {product.faqs.map((f) => (
                        <div key={f.question} className={styles.faq}>
                          <dt>{f.question}</dt>
                          <dd>{f.answer}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                ) : null}
              </div>
            ) : null}
            <Question name={product.name} />
          </div>
        </div>
        <Related product={product} />
      </section>
    </Layout>
  )
}
