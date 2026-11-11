'use client'

import { useState } from 'react'
import { Link, navigate, SearchField, StoreLogo, useCart, useCollections, useMenu, useStorefront, useWishlist, type MenuItem } from '@dripfunnel/storefront-core/theme'
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

export const StoreIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M4 9.5V20h16V9.5" />
    <path d="M3 9.5L5 4h14l2 5.5c0 1.4-1.1 2.5-2.5 2.5S16 10.9 16 9.5c0 1.4-1.1 2.5-2.5 2.5h-3C9.1 12 8 10.9 8 9.5 8 10.9 6.9 12 5.5 12S3 10.9 3 9.5z" />
    <path d="M9.5 20v-4.5h5V20" />
    <circle cx="18.5" cy="4.5" r="3" />
  </svg>
)

/**
 * The header: a maroon bar (logo, store finder, search, sign in, wishlist and cart) over an ivory menu row. The whole
 * header is sticky; on desktop it sticks by the menu row, so the maroon bar scrolls away and the menu stays. With
 * `overlay` (the home page) the hero slides up under the translucent menu row.
 */
export const Header = ({ overlay }: { overlay: boolean }) => {
  const { t } = useStorefront()
  const items = useNavItems()
  const { count } = useCart()
  const wishlist = useWishlist()
  const [searching, setSearching] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const signedIn = wishlist.status === 'ready'
  const search = <SearchField label={t('common.tools.search')} placeholder={t('common.tools.searchPrompt')} button={t('common.tools.search')} value="" onSearch={searchFor} suggest={4} className={styles.search} />
  return (
    <header className={cx(styles.header, overlay && styles.overlay)}>
      <div className={styles.band}>
        <div className={styles.bar}>
          <Drawer items={items} open={drawer} onOpen={setDrawer} />
          <Link href="/" className={styles.brand}>
            <StoreLogo className={styles.logo} />
          </Link>
          <Link href="/contact/" className={styles.store}>
            <StoreIcon className={styles.storeIcon} />
            <span>{t('common.tools.findStore')}</span>
          </Link>
          <div className={styles.searchInline}>{search}</div>
          <div className={styles.tools}>
            <button
              type="button"
              className={cx(styles.tool, styles.searchToggle)}
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
            <Link href={signedIn ? '/account/' : '/sign-in/'} className={styles.signIn}>
              {signedIn ? t('common.tools.account') : t('common.tools.signIn')}
            </Link>
            <Link href="/account/" className={cx(styles.tool, styles.account)}>
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="8.5" r="3.8" />
                <path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" />
              </svg>
              <span className={styles.hidden}>{t('common.tools.account')}</span>
            </Link>
            <span className={styles.divider} aria-hidden="true" />
            <Link href="/account/wishlist/" className={cx(styles.tool, styles.wish)}>
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.2a4.3 4.3 0 017.5 2.6C19.5 15.4 12 20 12 20z" />
              </svg>
              <span className={styles.hidden}>{t('common.tools.wishlistCount', { count: wishlist.count })}</span>
              <span className={styles.count} aria-hidden="true">
                {wishlist.count}
              </span>
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
          </div>
        </div>
        <div id="site-search" className={searching ? styles.searchPanel : styles.searchClosed}>
          <div
            className={styles.searchInner}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSearching(false)
            }}
          >
            {searching ? search : null}
          </div>
        </div>
      </div>
      <nav className={styles.nav} aria-label={t('common.nav.label')}>
        {items.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </nav>
    </header>
  )
}
