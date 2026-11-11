import type { ReactNode } from 'react'
import { ConsentSettingsButton, Link, PoweredBy, StoreLogo, useStorefront } from '@dripfunnel/storefront-core/theme'
import { FooterColumn } from './interactive/FooterColumn'
import { PinIcon, useNavItems } from './interactive/Header'
import styles from '../styles/footer.module.css'

/** The networks a store can list in Site settings › Social that the footer draws. */
const networks = ['facebook', 'instagram', 'youtube', 'x', 'tiktok', 'whatsapp'] as const
type Network = (typeof networks)[number]
const isNetwork = (name: string): name is Network => (networks as readonly string[]).includes(name)

/** A line drawing of each network. */
const socialIcons: Record<Network, ReactNode> = {
  facebook: <path d="M15 3h-2a4 4 0 00-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 011-1h2z" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10 9.2l5 2.8-5 2.8z" />
    </>
  ),
  x: <path d="M4 4l16 16M20 4L4 20" />,
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 11-3.5-3.5M14 3c.5 2.6 2.4 4.5 5 5" />,
  whatsapp: <path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 1a5 5 0 01-2.9-2.9l1-1-1-2z" />,
}

const Arrow = () => (
  <svg className={styles.arrow} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const Footer = () => {
  const { store, t, poweredBy } = useStorefront()
  const items = useNavItems()
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  const profiles = store.social.flatMap((s) => (isNetwork(s.network) && s.network !== 'whatsapp' ? [{ network: s.network, url: s.url }] : []))
  const networkName: Record<Exclude<Network, 'whatsapp'>, string> = {
    facebook: t('common.social.facebook'),
    instagram: t('common.social.instagram'),
    youtube: t('common.social.youtube'),
    x: t('common.social.x'),
    tiktok: t('common.social.tiktok'),
  }
  const place = [store.address?.street, store.address?.city, store.address?.region, store.address?.postal].filter(Boolean).join(', ')
  const payments = [
    t('common.payments.phonepe'),
    t('common.payments.gpay'),
    t('common.payments.paytm'),
    t('common.payments.upi'),
    t('common.payments.rupay'),
    t('common.payments.mastercard'),
    t('common.payments.visa'),
  ]
  return (
    <footer className={styles.footer}>
      <div className={styles.ornament} aria-hidden="true">
        <span className={styles.ornamentLine} />
        <svg className={styles.ornamentMark} viewBox="0 0 24 24" focusable="false">
          <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" />
        </svg>
        <span className={styles.ornamentLine} />
      </div>
      <div className={styles.columns}>
        <div className={styles.about}>
          <Link href="/" className={styles.brand}>
            <StoreLogo className={styles.logo} />
          </Link>
          {store.tagline ? <p className={styles.tagline}>{store.tagline}</p> : null}
          <p className={styles.note}>{store.description || t('common.footer.note')}</p>
          {profiles.length ? (
            <ul className={styles.social}>
              {profiles.map((s) => (
                <li key={s.network}>
                  <Link href={s.url} className={styles.socialLink}>
                    <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      {socialIcons[s.network]}
                    </svg>
                    <span className={styles.hidden}>{networkName[s.network]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <FooterColumn id="footer-shop" title={t('common.footer.shop')}>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
                {item.children.length ? (
                  <ul className={styles.subList}>
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <Link href={child.href} className={styles.subLink}>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </FooterColumn>
        <FooterColumn id="footer-care" title={t('common.footer.help')}>
          <ul className={styles.list}>
            <li>
              <Link href="/collections/all/" className={styles.link}>
                {t('common.footer.all')}
              </Link>
            </li>
            <li>
              <Link href="/account/orders/" className={styles.link}>
                {t('common.footer.orders')}
              </Link>
            </li>
            <li>
              <Link href="/account/" className={styles.link}>
                {t('common.footer.account')}
              </Link>
            </li>
            <li>
              <Link href="/cart/" className={styles.link}>
                {t('common.tools.cart')}
              </Link>
            </li>
            <li>
              <Link href="/faq/" className={styles.link}>
                {t('common.footer.faq')}
              </Link>
            </li>
            <li>
              <Link href="/contact/" className={styles.link}>
                {t('common.nav.contact')}
              </Link>
            </li>
          </ul>
        </FooterColumn>
        <FooterColumn id="footer-policies" title={t('common.footer.legal')}>
          <ul className={styles.list}>
            <li>
              <Link href="/about/" className={styles.link}>
                {t('common.footer.about')}
              </Link>
            </li>
            <li>
              <Link href="/policies/privacy/" className={styles.link}>
                {t('common.footer.privacy')}
              </Link>
            </li>
            <li>
              <Link href="/policies/returns/" className={styles.link}>
                {t('common.footer.returns')}
              </Link>
            </li>
            <li>
              <Link href="/policies/shipping/" className={styles.link}>
                {t('common.footer.shipping')}
              </Link>
            </li>
            <li>
              <Link href="/policies/terms/" className={styles.link}>
                {t('common.footer.terms')}
              </Link>
            </li>
          </ul>
        </FooterColumn>
        <div className={styles.touch}>
          <h2 className={styles.touchHeading}>{t('common.footer.touch')}</h2>
          <dl className={styles.details}>
            {store.contactPhone ? (
              <div className={styles.detail}>
                <dt className={styles.term}>{t('common.contact.phone')}</dt>
                <dd className={styles.value}>{store.contactPhone}</dd>
              </div>
            ) : null}
            {store.contactEmail ? (
              <div className={styles.detail}>
                <dt className={styles.term}>{t('common.contact.email')}</dt>
                <dd className={styles.value}>{store.contactEmail}</dd>
              </div>
            ) : null}
            {place ? (
              <div className={styles.detail}>
                <dt className={styles.term}>{t('common.contact.address')}</dt>
                <dd className={styles.value}>{place}</dd>
              </div>
            ) : null}
          </dl>
          <div className={styles.buttons}>
            {whatsapp ? (
              <Link href={whatsapp.url} className={styles.whatsappButton}>
                <svg className={styles.buttonIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  {socialIcons.whatsapp}
                </svg>
                {t('common.contact.whatsapp')}
              </Link>
            ) : null}
            <Link href="/contact/" className={styles.storeButton}>
              <PinIcon className={styles.buttonIcon} />
              {t('common.tools.findStore')}
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.payments}>
        <p className={styles.paymentsLabel}>{t('common.payments.label')}</p>
        <ul className={styles.paymentList}>
          {payments.map((name) => (
            <li key={name} className={styles.payment}>
              {name}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.base}>
        <p className={styles.copyright}>{t('common.footer.rights', { store: store.name })}</p>
        <ConsentSettingsButton t={t} className={styles.cookies} />
        <PoweredBy brand={poweredBy} t={t} className={styles.powered} />
      </div>
    </footer>
  )
}
