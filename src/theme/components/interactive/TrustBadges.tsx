'use client'

import { useState, type ReactNode } from 'react'
import { Link, useStorefront } from '@dripfunnel/storefront-core/theme'
import styles from '../../styles/product.module.css'

type Badge = { id: 'payments' | 'returns' | 'shipping'; title: string; body: string; href: string; icon: ReactNode }

/**
 * Three promises in a cream card, each opening a short summary with a link to its policy, and the dispatch line below.
 * One summary shows at a time; pressing the open badge again closes it.
 */
export const TrustBadges = () => {
  const { t } = useStorefront()
  const [open, setOpen] = useState<Badge['id'] | null>(null)
  const badges: Badge[] = [
    {
      id: 'payments',
      title: t('shop.product.trust.payments'),
      body: t('shop.product.trust.paymentsBody'),
      href: '/policies/terms/',
      icon: <path d="M7 5h10M7 9h10M7 5c4.5 0 6 1.8 6 4s-1.5 4-6 4l7 6" />,
    },
    {
      id: 'returns',
      title: t('shop.product.trust.returns'),
      body: t('shop.product.trust.returnsBody'),
      href: '/policies/returns/',
      icon: <path d="M4 10a8 8 0 0114-4.5L20 8M20 4v4h-4M20 14a8 8 0 01-14 4.5L4 16M4 20v-4h4" />,
    },
    {
      id: 'shipping',
      title: t('shop.product.trust.shipping'),
      body: t('shop.product.trust.shippingBody'),
      href: '/policies/shipping/',
      icon: <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />,
    },
  ]
  const shown = badges.find((b) => b.id === open)
  return (
    <div className={styles.trust}>
      <ul className={styles.trustList}>
        {badges.map((b) => (
          <li key={b.id}>
            <button type="button" className={styles.trustItem} aria-expanded={open === b.id} aria-controls="trust-detail" onClick={() => setOpen(open === b.id ? null : b.id)}>
              <span className={styles.trustIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  {b.icon}
                </svg>
              </span>
              <span className={styles.trustTitle}>{b.title}</span>
            </button>
          </li>
        ))}
      </ul>
      <div id="trust-detail" className={styles.trustDetail} hidden={!shown}>
        {shown ? (
          <>
            <p className={styles.trustBody}>{shown.body}</p>
            <Link href={shown.href} className={styles.trustLink}>
              {t('shop.product.trust.policy')}
            </Link>
          </>
        ) : null}
      </div>
      <p className={styles.dispatch}>
        <svg className={styles.dispatchIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </svg>
        {t('shop.product.dispatch')}
      </p>
    </div>
  )
}
