'use client'

import { useEffect, useRef } from 'react'
import { Link, SearchField, StoreLogo, useCart, useStorefront, type MenuItem } from '@dripfunnel/storefront-core/theme'
import { searchFor } from './Header'
import styles from '../../styles/drawer.module.css'

const Chevron = () => (
  <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

/**
 * Phones and tablets: the menu button and the panel it slides in from the left, with search, the menu (sub-categories
 * as accordions), the shopper's links and the store's contact details.
 */
export const Drawer = ({ items, open, onOpen }: { items: MenuItem[]; open: boolean; onOpen: (open: boolean) => void }) => {
  const { store, t } = useStorefront()
  const { count } = useCart()
  const toggle = useRef<HTMLButtonElement>(null)
  const closer = useRef<HTMLButtonElement>(null)
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  const close = () => {
    onOpen(false)
    toggle.current?.focus()
  }
  // Focus moves into the panel as it opens, so a keyboard or screen reader lands on its close button.
  useEffect(() => {
    if (open) closer.current?.focus()
  }, [open])
  return (
    <>
      <button ref={toggle} type="button" className={styles.toggle} aria-expanded={open} aria-controls="site-drawer" onClick={() => onOpen(!open)}>
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 7h16M4 12h16M4 17h11" />
        </svg>
        <span className={styles.hidden}>{t('common.nav.menu')}</span>
      </button>
      <div className={open ? styles.backdropOpen : styles.backdrop} aria-hidden="true" onClick={close} />
      <div
        id="site-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={t('common.nav.menu')}
        className={open ? styles.panelOpen : styles.panel}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close()
        }}
      >
        <div className={styles.head}>
          <Link href="/" className={styles.brand}>
            <StoreLogo className={styles.logo} />
          </Link>
          <button ref={closer} type="button" className={styles.close} onClick={close}>
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            <span className={styles.hidden}>{t('common.nav.close')}</span>
          </button>
        </div>
        <SearchField label={t('common.tools.search')} placeholder={t('common.tools.searchPrompt')} button={t('common.tools.search')} value="" onSearch={searchFor} suggest={4} className={styles.search} />
        <nav aria-label={t('common.nav.label')}>
          <ul className={styles.list}>
            <li className={styles.row} onClick={() => onOpen(false)}>
              <Link href="/collections/all/" className={styles.link}>
                {t('common.nav.shopAll')}
              </Link>
            </li>
            {items.map((item) =>
              item.children.length ? (
                <li key={item.id} className={styles.row}>
                  <details className={styles.group}>
                    <summary className={styles.summary}>
                      {item.label}
                      <Chevron />
                    </summary>
                    <ul className={styles.subList} onClick={() => onOpen(false)}>
                      <li>
                        <Link href={item.href} className={styles.subAll}>
                          {t('common.nav.shopAllOf', { item: item.label })}
                        </Link>
                      </li>
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link href={child.href} className={styles.subLink}>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={item.id} className={styles.row} onClick={() => onOpen(false)}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
            <li className={styles.row} onClick={() => onOpen(false)}>
              <Link href="/about/" className={styles.link}>
                {t('common.nav.about')}
              </Link>
            </li>
          </ul>
        </nav>
        <ul className={styles.quick} onClick={() => onOpen(false)}>
          <li>
            <Link href="/account/" className={styles.quickLink}>
              {t('common.tools.account')}
            </Link>
          </li>
          <li>
            <Link href="/account/orders/" className={styles.quickLink}>
              {t('common.footer.orders')}
            </Link>
          </li>
          <li>
            <Link href="/cart/" className={styles.quickLink}>
              {count > 0 ? t('common.tools.cartCount', { count }) : t('common.tools.cart')}
            </Link>
          </li>
        </ul>
        <div className={styles.contact}>
          <p className={styles.contactTitle}>{t('common.footer.touch')}</p>
          {store.contactPhone ? (
            <p className={styles.contactLine}>
              <span className={styles.contactTerm}>{t('common.contact.phone')}</span>
              {store.contactPhone}
            </p>
          ) : null}
          {store.contactEmail ? (
            <p className={styles.contactLine}>
              <span className={styles.contactTerm}>{t('common.contact.email')}</span>
              {store.contactEmail}
            </p>
          ) : null}
          <div className={styles.buttons} onClick={() => onOpen(false)}>
            {whatsapp ? (
              <Link href={whatsapp.url} className={styles.whatsapp}>
                {t('common.contact.whatsapp')}
              </Link>
            ) : null}
            <Link href="/contact/" className={styles.findStore}>
              {t('common.tools.findStore')}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
