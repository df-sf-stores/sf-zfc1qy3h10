import type { ReactNode } from 'react'
import { Image, Link, useCollections, useListing, useMenu, useProducts, useStorefront, type CollectionCard, type ProductCard as Card } from '@dripfunnel/storefront-core/theme'
import { HeroCarousel } from '../components/interactive/HeroCarousel'
import { Layout } from '../components/Layout'
import { GridPlaceholder, ProductCard } from '../components/ProductCard'
import { SectionHeading } from '../components/SectionHeading'
import { Spotlight } from '../components/Spotlight'
import { cx } from '../components/cx'
import art from '../styles/art.module.css'
import styles from '../styles/home.module.css'

/** Collections behind the deal grid and the three category spotlights; each section hides while its collection is empty. */
const collections = {
  deals: 'amazing-deals',
  jewellery: 'jewellery',
  accessories: 'bharatanatyam-accessories',
  ghungroo: 'ghungroo',
}

/**
 * Until the store has a media library, each hero banner is the image of a collection kept for it.
 * Collections whose slug starts with this prefix carry artwork only and stay out of every list.
 */
const bannerPrefix = 'banner-'

/** A category's painted photo, for collections the catalogue gives no picture of their own. */
const categoryArt = new Map([
  ['costumes', art.costumes],
  ['jewellery', art.jewellery],
  ['ghungroo', art.ghungroo],
  [collections.accessories, art.accessories],
])

/** A hero banner links to the first collection whose address or name holds one of its keywords. */
const bannerHref = (list: CollectionCard[], keywords: string[]) =>
  keywords.map((k) => list.find((c) => `${c.href} ${c.name}`.toLowerCase().includes(k))).find(Boolean)?.href ?? '/collections/all/'

const slugOf = (c: CollectionCard) => c.href.split('/').filter(Boolean).pop() ?? ''

const Pledge = ({ title, body, children }: { title: string; body: string; children: ReactNode }) => (
  <li className={styles.promise}>
    <span className={styles.promiseIcon} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {children}
      </svg>
    </span>
    <h3 className={styles.promiseTitle}>{title}</h3>
    <p className={styles.promiseBody}>{body}</p>
  </li>
)

const ArrowIcon = () => (
  <svg className={styles.arrowIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/** A titled row of product cards that scrolls sideways on narrow screens. */
const ProductRail = ({ title, action, products }: { title: string; action: ReactNode; products: { status: string; items: Card[] } }) => {
  const { t } = useStorefront()
  if (products.status !== 'loading' && !products.items.length) return null
  return (
    <section className={styles.rail}>
      <div className={styles.railHead}>
        <h2 className={styles.railTitle}>{title}</h2>
        {action}
      </div>
      {products.status === 'loading' ? (
        <GridPlaceholder label={t('shop.listing.loading')} count={4} />
      ) : (
        <ul className={styles.railList}>
          {products.items.map((product) => (
            <li key={product.id} className={styles.railItem}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/** The deal collection's products under a centred heading, with a "view all" pill. */
const Deals = ({ exists }: { exists: boolean }) => {
  const { t } = useStorefront()
  const { items } = useListing({ collection: collections.deals }, exists)
  if (!items.length) return null
  return (
    <section className={styles.section}>
      <SectionHeading eyebrow={t('home.deals.eyebrow')} title={t('home.deals.title')} />
      <ul className={styles.grid}>
        {items.slice(0, 8).map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      <div className={styles.more}>
        <Link href={`/collections/${collections.deals}/`} className={styles.pill}>
          {t('home.viewAll')}
          <ArrowIcon />
        </Link>
      </div>
    </section>
  )
}

export const HomePage = () => {
  const { t } = useStorefront()
  const menu = useMenu()
  const { collections: all, status } = useCollections({ first: 20 })
  const categories = all.filter((c) => !slugOf(c).startsWith(bannerPrefix))
  const imageOf = (slug: string) => all.find((c) => slugOf(c) === slug)?.image ?? null
  const has = (slug: string) => all.some((c) => slugOf(c) === slug)
  const newest = useProducts({ sort: 'newest', first: 8 })
  const primary = categories[0] ? slugOf(categories[0]) : null
  const featured = useListing({ collection: primary }, primary !== null)
  const pictureOf = (c: CollectionCard) => categoryArt.get(slugOf(c))
  const storyImage = imageOf('costumes')
  const signupImage = imageOf(collections.jewellery)
  const groups = menu.items.filter((item) => item.children.length)
  const viewAll = (
    <Link href="/collections/all/" className={styles.textLink}>
      {t('home.viewAll')}
      <ArrowIcon />
    </Link>
  )
  return (
    <Layout>
      <h1 className={styles.pageTitle}>{t('home.title')}</h1>
      <HeroCarousel
        slides={[
          { key: 'costume', art: art.bannerCostume, image: imageOf('banner-costume'), href: bannerHref(categories, ['bharatnatyam-dress', 'costume']), label: t('home.hero.costume') },
          { key: 'ghungroo', art: art.bannerGhungroo, image: imageOf('banner-ghungroo'), href: bannerHref(categories, ['5-line', 'ghungroo']), label: t('home.hero.ghungroo') },
          { key: 'jada', art: art.bannerJada, image: imageOf('banner-jada'), href: bannerHref(categories, ['ornament-set', 'accessor']), label: t('home.hero.jada') },
        ]}
        labels={{ region: t('home.hero.region'), role: t('home.hero.role'), previous: t('home.hero.previous'), next: t('home.hero.next'), goTo: (n) => t('home.hero.goTo', { n }) }}
      />
      <ProductRail title={t('home.newest')} action={viewAll} products={{ status: newest.status, items: newest.products }} />
      <section className={styles.promises}>
        <h2 className={styles.hidden}>{t('home.promises.title')}</h2>
        <ul className={styles.promiseList}>
          <Pledge title={t('home.promises.craft.title')} body={t('home.promises.craft.body')}>
            <path d="M6 3h12l4 6-10 12L2 9zM2 9h20M12 21L8 9l4-6 4 6z" />
          </Pledge>
          <Pledge title={t('home.promises.stage.title')} body={t('home.promises.stage.body')}>
            <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 3v4M21 5h-4M5 17v4M7 19H3" />
          </Pledge>
          <Pledge title={t('home.promises.secure.title')} body={t('home.promises.secure.body')}>
            <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />
          </Pledge>
          <Pledge title={t('home.promises.support.title')} body={t('home.promises.support.body')}>
            <path d="M4 14v-2a8 8 0 0116 0v2M4 14a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 14a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2zM17 16v1a3 3 0 01-3 3h-2" />
          </Pledge>
        </ul>
      </section>
      {status === 'loading' || categories.length ? (
        <section className={styles.section}>
          <SectionHeading eyebrow={t('home.collections.eyebrow')} title={t('home.collections.title')} />
          <ul className={styles.tiles} aria-busy={status === 'loading'}>
            {status === 'loading'
              ? [0, 1, 2, 3].map((i) => (
                  <li key={i}>
                    <span className={styles.tile} />
                  </li>
                ))
              : categories.map((c) => (
                  <li key={c.id}>
                    <Link href={c.href} className={cx(styles.tile, art.art, pictureOf(c))}>
                      {c.image ? <Image image={c.image} alt="" ratio={0.75} sizes="(min-width: 900px) 25vw, 50vw" className={styles.tileImage} /> : null}
                      <span className={styles.tileFrame} />
                      <span className={styles.tileText}>
                        <span className={styles.tileName}>{c.name}</span>
                        <span className={styles.tileMore}>
                          {t('home.collections.explore')}
                          <ArrowIcon />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
          </ul>
        </section>
      ) : null}
      <Deals exists={has(collections.deals)} />
      <Spotlight
        collection={collections.jewellery}
        exists={has(collections.jewellery)}
        picture={art.jewellery}
        image={imageOf(collections.jewellery)}
        eyebrow={t('home.spotlight.jewellery.eyebrow')}
        title={t('home.spotlight.jewellery.title')}
        body={t('home.spotlight.jewellery.body')}
        cta={t('home.spotlight.jewellery.cta')}
        end
      />
      <ProductRail title={t('home.featured')} action={viewAll} products={featured} />
      <Spotlight
        collection={collections.accessories}
        exists={has(collections.accessories)}
        picture={art.accessories}
        image={imageOf(collections.accessories)}
        eyebrow={t('home.spotlight.accessories.eyebrow')}
        title={t('home.spotlight.accessories.title')}
        body={t('home.spotlight.accessories.body')}
        cta={t('home.spotlight.accessories.cta')}
      />
      <Spotlight
        collection={collections.ghungroo}
        exists={has(collections.ghungroo)}
        picture={art.ghungroo}
        image={imageOf(collections.ghungroo)}
        eyebrow={t('home.spotlight.ghungroo.eyebrow')}
        title={t('home.spotlight.ghungroo.title')}
        body={t('home.spotlight.ghungroo.body')}
        cta={t('home.spotlight.ghungroo.cta')}
        end
      />
      <section className={styles.story}>
        <div className={styles.storyFrame}>
          <div className={cx(styles.storyPicture, art.art, art.costumes)}>
            {storyImage ? <Image image={storyImage} alt="" ratio={0.8} sizes="(min-width: 900px) 448px, 100vw" className={styles.cover} /> : null}
          </div>
        </div>
        <div className={styles.storyCopy}>
          <p className={styles.eyebrow}>{t('home.story.eyebrow')}</p>
          <h2 className={styles.storyTitle}>
            {t('home.story.title')} <em className={styles.accent}>{t('home.story.accent')}</em>
          </h2>
          <p className={styles.lead}>{t('home.story.lead')}</p>
          <p className={styles.body}>{t('home.story.body')}</p>
          <Link href="/collections/all/" className={styles.button}>
            {t('home.story.more')}
          </Link>
        </div>
      </section>
      {groups.length ? (
        <section className={styles.range}>
          <div className={styles.rangeInner}>
            <SectionHeading eyebrow={t('home.range.eyebrow')} title={t('home.range.title')} />
            <ul className={styles.rangeGrid}>
              {groups.map((group, index) => {
                const match = categories.find((c) => c.href === group.href)
                return (
                  <li key={group.id} className={styles.rangeCard}>
                    <Link href={group.href} className={cx(styles.rangeHead, art.art, match ? pictureOf(match) : null)}>
                      {match?.image ? <Image image={match.image} alt="" ratio={4 / 3} sizes="(min-width: 900px) 25vw, 100vw" className={styles.tileImage} /> : null}
                      <span className={styles.rangeFrame} />
                      <span className={styles.rangeNumber}>{String(index + 1).padStart(2, '0')}</span>
                      <span className={styles.rangeName}>{group.label}</span>
                    </Link>
                    <ul className={styles.rangeLinks}>
                      {group.children.map((child) => (
                        <li key={child.id}>
                          <Link href={child.href} className={styles.rangeLink}>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link href={group.href} className={styles.rangeAll}>
                      {t('home.range.shopAll', { name: group.label })}
                      <span className={styles.rangeAllIcon}>
                        <ArrowIcon />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      ) : null}
      <section className={cx(styles.signup, art.art, art.jewellery)}>
        {signupImage ? <Image image={signupImage} alt="" ratio={16 / 9} sizes="100vw" className={cx(styles.cover, styles.signupImage)} /> : null}
        <div className={styles.signupInner}>
          <p className={styles.signupEyebrow}>{t('home.signup.eyebrow')}</p>
          <h2 className={styles.signupTitle}>{t('home.signup.title')}</h2>
          <p className={styles.signupBody}>{t('home.signup.body')}</p>
          <Link href="/register/" className={styles.gold}>
            {t('home.signup.action')}
          </Link>
        </div>
      </section>
    </Layout>
  )
}
