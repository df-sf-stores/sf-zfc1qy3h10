import type { ReactNode } from 'react'
import { ConsentBanner, Link, PreviewBanner, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Footer } from './Footer'
import { Header } from './interactive/Header'
import styles from '../styles/layout.module.css'

/** Every page's frame. `overlay` lets the header sit clear over a full-width banner at the top of the page. */
export const Layout = ({ children, overlay = false }: { children: ReactNode; overlay?: boolean }) => {
  const { store, t, mode } = useStorefront()
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  return (
    <div className={styles.shell}>
      {mode === 'live' ? null : <PreviewBanner t={t} className={styles.preview} />}
      <Header overlay={overlay} />
      <main className={styles.main}>{children}</main>
      <Footer />
      {whatsapp ? (
        <Link href={whatsapp.url} className={styles.whatsapp}>
          <svg className={styles.whatsappIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3zm4.4 12.4c-.2.5-1.1 1-1.6 1-.4.1-.9.1-1.5-.1a13 13 0 01-1.4-.5 10.6 10.6 0 01-4-3.6 4.6 4.6 0 01-1-2.4c0-1.2.6-1.7.8-2 .2-.2.5-.3.6-.3h.5c.1 0 .4 0 .6.4l.8 1.9c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.7-.1 1.3z" />
          </svg>
          <span className={styles.whatsappLabel}>{t('common.contact.chat')}</span>
        </Link>
      ) : null}
      <ConsentBanner t={t} className={styles.consent} />
    </div>
  )
}
