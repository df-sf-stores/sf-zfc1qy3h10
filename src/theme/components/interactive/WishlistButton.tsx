'use client'

import { useStorefront, useWishlist } from '@dripfunnel/storefront-core/theme'
import styles from '../../styles/product.module.css'

/**
 * The heart: adds the product to the shopper's wishlist or takes it off. Signed out, core remembers the product and sends
 * the shopper to sign in, which adds it on return.
 */
export const WishlistButton = ({ productId, versionId = null, name, className }: { productId: string; versionId?: string | null; name: string; className?: string }) => {
  const { t } = useStorefront()
  const wishlist = useWishlist()
  const saved = wishlist.has(productId)
  return (
    <button
      type="button"
      className={className ?? styles.roundButton}
      aria-pressed={saved}
      aria-label={saved ? t('shop.product.wishlistRemove', { name }) : t('shop.product.wishlistAdd', { name })}
      disabled={wishlist.busy}
      onClick={() => void wishlist.toggle(productId, versionId)}
    >
      <svg className={saved ? styles.heartOn : styles.heart} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" />
      </svg>
    </button>
  )
}
