'use client'

import { useId, useRef, useState } from 'react'
import { AddToCart, BuyNow, Link, TextField, useScrollProgress, useStorefront, type GiftRecipient, type ProductPage } from '@dripfunnel/storefront-core/theme'
import { isPriced } from '../ProductCard'
import { cx } from '../cx'
import styles from '../../styles/product.module.css'

const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** The most a shopper can add at once when the store doesn't say how many are left. */
const maxQuantity = 20

const CartIcon = () => (
  <svg className={styles.buttonIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M3 4h2l2.2 10.4a1.5 1.5 0 001.5 1.1h8.4a1.5 1.5 0 001.4-1.1L20.5 8H6.2" />
    <circle cx="9.5" cy="19.5" r="1.2" />
    <circle cx="17" cy="19.5" r="1.2" />
  </svg>
)

const BoltIcon = () => (
  <svg className={styles.buttonIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" />
  </svg>
)

export const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3zm4.4 12.4c-.2.5-1.1 1-1.6 1-.4.1-.9.1-1.5-.1a13 13 0 01-1.4-.5 10.6 10.6 0 01-4-3.6 4.6 4.6 0 01-1-2.4c0-1.2.6-1.7.8-2 .2-.2.5-.3.6-.3h.5c.1 0 .4 0 .6.4l.8 1.9c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.7-.1 1.3z" />
  </svg>
)

/**
 * The store's WhatsApp link (Site settings › Social) with a message about this product, or null when it has none. The
 * theme rules allow no URL encoding, so the characters that would break the query are dropped; the browser encodes the rest.
 */
export const useWhatsAppAbout = (name: string): string | null => {
  const { store, t } = useStorefront()
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  if (!whatsapp) return null
  const message = t('shop.product.question.message', { name }).replace(/[&#%+?]/g, ' ')
  return `${whatsapp.url}${whatsapp.url.includes('?') ? '&' : '?'}text=${message}`
}

/**
 * Quantity, Add to cart and Buy now for the chosen version; both wait until every option is chosen and the version is in
 * stock. A product priced at nothing, or sold out, offers a WhatsApp enquiry instead. A gift card asks for its recipient
 * first; a download or a service says what the shopper gets. On phones and tablets, once the buttons scroll away, a bar
 * slides up along the bottom with the same two buttons.
 */
export const BuyButtons = ({ page }: { page: ProductPage }) => {
  const { t } = useStorefront()
  const [quantity, setQuantity] = useState(1)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [gift, setGift] = useState<GiftRecipient>({ recipientName: '', recipientEmail: '', sendOn: '', message: '' })
  const row = useRef<HTMLDivElement>(null)
  // The bar shows once the buttons have scrolled up past the top of the screen (core reports 1 as they leave it), and
  // hides when they come back; while the page loads it stays down.
  const barShown = useScrollProgress(row) >= 1
  const why = useId()
  const product = page.product
  const enquiry = useWhatsAppAbout(product?.name ?? '')
  const version = page.version
  const kind = product?.kind
  const isGift = kind?.kind === 'gift_card'
  const giftReady = gift.recipientName.trim() !== '' && emailLike.test(gift.recipientEmail.trim())
  const priced = page.price !== null && isPriced(page.price)
  const soldOut = page.missing.length === 0 && (version ? !version.stock.inStock : page.stock?.inStock === false)
  const buyable = version !== null && version.stock.inStock && priced && (!isGift || giftReady)
  const most = Math.max(1, Math.min(maxQuantity, version?.stock.available ?? maxQuantity))
  const amount = Math.min(quantity, most)
  const set = (patch: Partial<GiftRecipient>) => setGift({ ...gift, ...patch })
  const waitsForRecipient = isGift && !giftReady
  const added = version !== null && addedId === version.id
  const onAdded = (worked: boolean) => {
    setFailed(!worked)
    if (worked) setAddedId(version?.id ?? null)
  }
  const enquire = enquiry ? (
    <Link href={enquiry} className={styles.enquire}>
      <WhatsAppIcon className={styles.buttonIcon} />
      {t('shop.product.enquire')}
    </Link>
  ) : null
  // What the row holds: the two buttons, or the enquiry where nothing can be bought.
  const buttons = (inBar: boolean) =>
    !priced ? (
      enquire
    ) : soldOut ? (
      <>
        <button type="button" className={styles.addButton} disabled>
          {t('shop.product.outOfStock')}
        </button>
        {inBar ? null : enquire}
      </>
    ) : (
      <>
        <AddToCart versionId={version?.id ?? null} quantity={amount} disabled={!buyable} gift={isGift ? gift : null} describedBy={waitsForRecipient ? why : undefined} className={styles.addButton} onDone={onAdded}>
          <CartIcon />
          {isGift ? t('shop.product.gift.add') : t('shop.product.add')}
        </AddToCart>
        {isGift ? null : (
          <BuyNow versionId={version?.id ?? null} quantity={amount} disabled={!buyable} className={styles.buyButton} onDone={(bought) => setFailed(!bought)}>
            <BoltIcon />
            {t('shop.product.buyNow')}
          </BuyNow>
        )}
      </>
    )
  return (
    <div className={styles.buy}>
      {kind?.kind === 'digital' ? (
        <p className={styles.kindNote}>{kind.downloadLimit !== null && kind.downloadDays !== null ? t('shop.product.download', { times: kind.downloadLimit, days: kind.downloadDays }) : t('shop.product.downloadPlain')}</p>
      ) : null}
      {kind?.kind === 'service' ? <p className={styles.kindNote}>{[kind.duration, kind.location].filter(Boolean).join(' · ') || t('shop.product.service')}</p> : null}
      {kind?.kind === 'gift_card' ? (
        <div className={styles.gift}>
          <TextField label={t('shop.product.gift.name')} autoComplete="off" value={gift.recipientName} onChange={(recipientName) => set({ recipientName })} className={styles.field} />
          <TextField label={t('shop.product.gift.email')} type="email" autoComplete="off" value={gift.recipientEmail} onChange={(recipientEmail) => set({ recipientEmail })} className={styles.field} />
          <TextField label={t('shop.product.gift.message')} note={t('shop.product.gift.optional')} maxLength={200} value={gift.message ?? ''} onChange={(message) => set({ message })} className={styles.field} />
          <TextField
            label={t('shop.product.gift.sendOn')}
            type="date"
            value={gift.sendOn ?? ''}
            onChange={(sendOn) => set({ sendOn })}
            hint={kind.expiryMonths !== null ? t('shop.product.gift.sendHintExpiry', { months: kind.expiryMonths }) : t('shop.product.gift.sendHint')}
            className={styles.field}
          />
        </div>
      ) : null}
      {waitsForRecipient ? (
        <p id={why} className={styles.kindNote}>
          {t('shop.product.gift.needed')}
        </p>
      ) : null}
      {priced && !soldOut && !isGift ? (
        <div className={styles.quantityRow}>
          <span className={styles.quantityLabel}>{t('shop.product.quantity')}</span>
          <div className={styles.stepper} role="group" aria-label={t('shop.product.quantity')}>
            <button type="button" className={styles.step} aria-label={t('shop.cart.less')} disabled={amount <= 1} onClick={() => setQuantity(amount - 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 12h12" />
              </svg>
            </button>
            <span className={styles.amount} aria-live="polite">
              {amount}
            </span>
            <button type="button" className={styles.step} aria-label={t('shop.cart.more')} disabled={amount >= most} onClick={() => setQuantity(amount + 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 12h12M12 6v12" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
      <div ref={row} className={styles.buttons}>
        {buttons(false)}
      </div>
      {failed || added ? (
        <p className={failed ? styles.addFailed : styles.added} role="status">
          {failed ? (
            t('shop.product.addFailed')
          ) : (
            <>
              <svg className={styles.buttonIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              {t('shop.product.added')}
              <Link href="/cart/" className={styles.viewCart}>
                {t('shop.product.viewCart')}
              </Link>
            </>
          )}
        </p>
      ) : null}
      {product && !isGift ? (
        <div className={cx(styles.stickyBar, barShown && styles.stickyBarShown)} aria-hidden={!barShown}>
          <div className={styles.stickyButtons}>{buttons(true)}</div>
        </div>
      ) : null}
    </div>
  )
}
