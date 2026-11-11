'use client'

import { useRef, useState } from 'react'
import { Link, navigate, SearchField, StoreLogo, useCart, useCollections, useInView, useMenu, useStorefront, type MenuItem } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import { Drawer } from './Drawer'
import { NavItem } from './NavItem'
import styles from '../../styles/header.module.css'

// The theme rules allow no URL encoding, so the characters that would break the query are dropped instead.
export const searchFor = (words: string) => navigate(`/search/?q=${words.replace(/[&+%#]/g, ' ').trim()}`)

/** The store's menu from Site settings; until it loads, or if it is empty, its collections stand in for it. */
export const useNavItems = (): MenuItem[] => {
  const menu = useMenu()
  // `first: 20` matches the home page's request, so both share one answer.
  const { collections } = useCollections({ first: 20 })
  if (menu.items.length) return menu.items
  return collections.map((c) => ({ id: c.id, label: c.name, href: c.href, children: [] }))
}

export const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </svg>
)

export const PinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
)

/**
 * The sticky top bar. With `overlay` (the home page) it sits clear over the hero, its logo and words in ivory, and
 * turns solid once the shopper scrolls, or while search or the menu is open.
 */
export const Header = ({ overlay }: { overlay: boolean }) => {
  const { t } = useStorefront()
  const items = useNavItems()
  const { count } = useCart()
  const [searching, setSearching] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const top = useRef<HTMLSpanElement>(null)
  const atTop = useInView(top)
  const clear = overlay && atTop && !searching && !drawer
  return (
    <>
      <span ref={top} className={styles.top} aria-hidden="true" />
      <header className={cx(styles.header, overlay && styles.overlay, clear && styles.clear)}>
        <div className={styles.bar}>
          <Drawer items={items} open={drawer} onOpen={setDrawer} />
          <Link href="/" className={styles.brand}>
            <StoreLogo className={styles.logo} />
          </Link>
          <nav className={styles.nav} aria-label={t('common.nav.label')}>
            {items.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </nav>
          <div className={styles.tools}>
            <button
              type="button"
              className={styles.tool}
              aria-expanded={searching}
              aria-controls="site-search"
              aria-label={t('common.tools.search')}
              onClick={() => setSearching(!searching)}
            >
              {searching ? (
                <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <SearchIcon className={styles.icon} />
              )}
            </button>
            <Link href="/account/" className={cx(styles.tool, styles.account)}>
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="8.5" r="3.8" />
                <path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" />
              </svg>
              <span className={styles.hidden}>{t('common.tools.account')}</span>
            </Link>
            <Link href="/cart/" className={styles.tool}>
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5.5 8h13l-1 12h-11z" />
                <path d="M9 8V6.5a3 3 0 016 0V8" />
              </svg>
              <span className={styles.hidden}>{count > 0 ? t('common.tools.cartCount', { count }) : t('common.tools.cart')}</span>
              {count > 0 ? (
                <span className={styles.count} aria-hidden="true">
                  {count}
                </span>
              ) : null}
            </Link>
            <Link href="/contact/" className={styles.store}>
              <PinIcon className={styles.icon} />
              <span className={styles.storeLabel}>{t('common.tools.findStore')}</span>
            </Link>
          </div>
        </div>
        <div id="site-search" className={searching ? styles.searchPanel : styles.searchClosed}>
          <div
            className={styles.searchInner}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSearching(false)
            }}
          >
            <SearchField label={t('common.tools.search')} placeholder={t('common.tools.searchPrompt')} button={t('common.tools.search')} value="" onSearch={searchFor} suggest={4} className={styles.search} />
          </div>
        </div>
      </header>
    </>
  )
}
