import type { ReactNode } from 'react'
import { Image, Link, useCollections, useProducts, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Layout } from '../components/Layout'
import { Ornament } from '../components/Ornament'
import { GridPlaceholder, ProductGrid } from '../components/ProductCard'
import shop from '../styles/shop.module.css'
import styles from '../styles/home.module.css'

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

export const HomePage = () => {
  const { store, t } = useStorefront()
  const { collections, status } = useCollections({ first: 4 })
  const newest = useProducts({ sort: 'newest', first: 4 })
  const heroImage = collections.find((c) => c.image)?.image ?? null
  return (
    <Layout>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{t('home.hero.eyebrow')}</p>
          <h1 className={styles.title}>{t('home.hero.title', { store: store.name })}</h1>
          <Ornament className={styles.ornamentStart} />
          <p className={styles.lead}>{store.description || t('home.hero.lead')}</p>
          <div className={styles.actions}>
            <Link href="/collections/all/" className={styles.gold}>
              {t('home.hero.shop')}
            </Link>
            <Link href="/about/" className={styles.ghost}>
              {t('home.hero.story')}
            </Link>
          </div>
        </div>
        <div className={styles.picture}>{heroImage ? <Image image={heroImage} alt="" ratio={1} sizes="(min-width: 900px) 50vw, 100vw" className={styles.pictureImage} /> : null}</div>
      </section>
      {newest.status === 'loading' || newest.products.length ? (
        <section className={shop.band}>
          <div className={shop.bandHead}>
            <h2 className={shop.heading}>{t('home.newest.title')}</h2>
            <Link href="/collections/all/?sort=newest" className={shop.textLink}>
              {t('home.newest.all')}
            </Link>
          </div>
          {newest.status === 'loading' ? <GridPlaceholder label={t('shop.listing.loading')} count={4} /> : <ProductGrid products={newest.products} />}
        </section>
      ) : null}
      <section className={styles.promises}>
        <ul className={styles.promiseList}>
          <Pledge title={t('home.promises.craft.title')} body={t('home.promises.craft.body')}>
            <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" />
          </Pledge>
          <Pledge title={t('home.promises.stage.title')} body={t('home.promises.stage.body')}>
            <path d="M5 20h14M7 20V9l5-5 5 5v11M10 20v-5h4v5" />
          </Pledge>
          <Pledge title={t('home.promises.secure.title')} body={t('home.promises.secure.body')}>
            <path d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 017 0v3" />
          </Pledge>
          <Pledge title={t('home.promises.support.title')} body={t('home.promises.support.body')}>
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z" />
          </Pledge>
        </ul>
      </section>
      {status === 'loading' || collections.length ? (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>{t('home.collections.eyebrow')}</p>
            <h2 className={styles.heading}>{t('home.collections.title')}</h2>
            <Ornament className={styles.ornament} />
          </div>
          {status === 'loading' ? (
            <ul className={styles.tiles} aria-busy="true" aria-label={t('shop.listing.loading')}>
              {[0, 1, 2, 3].map((i) => (
                <li key={i}>
                  <span className={styles.tile} />
                </li>
              ))}
            </ul>
          ) : (
            <ul className={styles.tiles}>
              {collections.map((c) => (
                <li key={c.id}>
                  <Link href={c.href} className={styles.tile}>
                    {c.image ? <Image image={c.image} alt={c.name} ratio={0.75} sizes="(min-width: 900px) 25vw, 50vw" className={styles.tileImage} /> : null}
                    <span className={styles.tileText}>
                      <span className={styles.tileName}>{c.name}</span>
                      <span className={styles.tileMore}>{t('home.collections.explore')}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
      <section className={styles.story}>
        <div className={styles.storyFrame}>
          <div className={styles.storyPicture} />
        </div>
        <div className={styles.storyCopy}>
          <p className={styles.eyebrow}>{t('home.story.eyebrow')}</p>
          <h2 className={styles.storyTitle}>{t('home.story.title')}</h2>
          <p className={styles.body}>{t('home.story.body')}</p>
          <Link href="/about/" className={styles.button}>
            {t('home.story.more')}
          </Link>
        </div>
      </section>
      <section className={styles.signup}>
        <div className={styles.signupInner}>
          <p className={styles.signupEyebrow}>{t('home.signup.eyebrow', { store: store.name })}</p>
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
