import type { ReactNode } from 'react'
import { ConsentSettingsButton, Link, PoweredBy, StoreLogo, useStorefront } from '@dripfunnel/storefront-core/theme'
import { DripFunnelLogo } from './DripFunnelLogo'
import { cx } from './cx'
import { FooterColumn } from './interactive/FooterColumn'
import { PinIcon, StoreIcon, useNavItems } from './interactive/Header'
import styles from '../styles/footer.module.css'

/** The networks a store can list in Site settings › Social that the footer draws. */
const networks = ['facebook', 'instagram', 'youtube', 'x', 'tiktok', 'whatsapp'] as const
type Network = (typeof networks)[number]
const isNetwork = (name: string): name is Network => (networks as readonly string[]).includes(name)

/** Each network's mark, drawn in its own colour on a white tile. */
const socialIcons: Record<Network, ReactNode> = {
  facebook: (
    <>
      <circle cx="12" cy="12" r="10" fill="#1877f2" stroke="none" />
      <path d="M13.2 21.9v-7h2.3l.4-2.7h-2.7v-1.7c0-.8.3-1.3 1.4-1.3H16V6.8a18 18 0 00-2.1-.1c-2.1 0-3.5 1.3-3.5 3.6v2h-2.3v2.7h2.3v6.9" fill="#fff" stroke="none" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="#ff0000" stroke="none" />
      <path d="M10 9.2l5 2.8-5 2.8z" fill="#fff" stroke="none" />
    </>
  ),
  x: <path d="M4 4l16 16M20 4L4 20" />,
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 11-3.5-3.5M14 3c.5 2.6 2.4 4.5 5 5" />,
  whatsapp: <path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 1a5 5 0 01-2.9-2.9l1-1-1-2z" />,
}

const Icon = ({ className, children }: { className?: string; children: ReactNode }) => (
  <svg className={cx(styles.contactIcon, className)} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {children}
  </svg>
)

const PhoneIcon = () => (
  <Icon>
    <path d="M6.6 3.5h2.6l1.3 4-2 1.3a11 11 0 006.7 6.7l1.3-2 4 1.3v2.6a2 2 0 01-2.2 2A16.5 16.5 0 014.6 5.7a2 2 0 012-2.2z" />
  </Icon>
)

const MailIcon = () => (
  <Icon>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </Icon>
)

const Chevron = () => (
  <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M9 6l6 6-6 6" />
  </svg>
)

/** Payment marks: same-sized white cards, each a close likeness of its brand's mark; its name is read out, not the mark. */
type PaymentId = 'phonepe' | 'gpay' | 'paytm' | 'upi' | 'rupay' | 'mastercard' | 'visa'

/** The two-arrow mark UPI and RuPay share, green behind orange. */
const TwoArrows = () => (
  <svg className={styles.arrows} viewBox="0 0 12 14" aria-hidden="true" focusable="false">
    <polygon points="0,0 7,7 0,14" fill="#00954a" />
    <polygon points="5,0 12,7 5,14" fill="#f37021" />
  </svg>
)

const PaymentMark = ({ id }: { id: PaymentId }) => {
  const { t } = useStorefront()
  switch (id) {
    case 'phonepe':
      return (
        <span className={styles.phonepe}>
          <svg className={styles.phonepeIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="12" fill="#5f259f" />
            <path d="M7 8.5h8.5M10.5 8.5v4.2a3 3 0 006 0V8.5M10.5 12.7V18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('common.payments.marks.phonepe')}
        </span>
      )
    case 'gpay':
      return (
        <span className={styles.gpay}>
          <svg className={styles.gpayIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {t('common.payments.marks.gpay')}
        </span>
      )
    case 'paytm':
      return (
        <span className={styles.paytm}>
          {t('common.payments.marks.paytmPay')}
          <span className={styles.paytmTm}>{t('common.payments.marks.paytmTm')}</span>
        </span>
      )
    case 'upi':
      return (
        <span className={styles.upiStack}>
          <span className={styles.upi}>
            {t('common.payments.marks.upi')}
            <TwoArrows />
          </span>
          <span className={styles.upiTagline} />
        </span>
      )
    case 'rupay':
      return (
        <span className={styles.rupay}>
          {t('common.payments.marks.rupayRu')}
          {t('common.payments.marks.rupayPay')}
          <TwoArrows />
        </span>
      )
    case 'mastercard':
      return (
        <svg className={styles.mastercard} viewBox="0 0 38 30" aria-hidden="true" focusable="false">
          <circle cx="14" cy="11" r="9" fill="#eb001b" />
          <circle cx="24" cy="11" r="9" fill="#f79e1b" />
          <path d="M19 3.4a9 9 0 010 15.2 9 9 0 010-15.2z" fill="#ff5f00" />
          <rect x="9" y="24.5" width="20" height="1.6" rx="0.8" fill="#6b6b6b" />
        </svg>
      )
    case 'visa':
      return <span className={styles.visa}>{t('common.payments.marks.visa')}</span>
  }
}

export const Footer = () => {
  const { store, t, poweredBy } = useStorefront()
  const items = useNavItems()
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  const whatsappLine = whatsapp ? store.contactPhone : null
  const profiles = store.social.flatMap((s) => (isNetwork(s.network) && s.network !== 'whatsapp' ? [{ network: s.network, url: s.url }] : []))
  const networkName: Record<Exclude<Network, 'whatsapp'>, string> = {
    facebook: t('common.social.facebook'),
    instagram: t('common.social.instagram'),
    youtube: t('common.social.youtube'),
    x: t('common.social.x'),
    tiktok: t('common.social.tiktok'),
  }
  const place = [store.address?.street, store.address?.city, store.address?.region, store.address?.postal].filter(Boolean).join(', ')
  // The copyright line names the store's town and state, as in "© 2026 SK Classical, Bangalore, Karnataka".
  const town = [store.address?.city, store.address?.region].filter(Boolean).join(', ')
  const payments: { id: PaymentId; name: string }[] = [
    { id: 'phonepe', name: t('common.payments.phonepe') },
    { id: 'gpay', name: t('common.payments.gpay') },
    { id: 'paytm', name: t('common.payments.paytm') },
    { id: 'upi', name: t('common.payments.upi') },
    { id: 'rupay', name: t('common.payments.rupay') },
    { id: 'mastercard', name: t('common.payments.mastercard') },
    { id: 'visa', name: t('common.payments.visa') },
  ]
  const care = [
    { href: '/collections/all/', label: t('common.footer.all') },
    { href: '/account/orders/', label: t('common.footer.orders') },
    { href: '/account/', label: t('common.footer.account') },
    { href: '/cart/', label: t('common.tools.cart') },
    { href: '/faq/', label: t('common.footer.faq') },
  ]
  const policies = [
    { href: '/about/', label: t('common.footer.about') },
    { href: '/policies/privacy/', label: t('common.footer.privacy') },
    { href: '/policies/returns/', label: t('common.footer.returns') },
    { href: '/policies/shipping/', label: t('common.footer.shipping') },
    { href: '/policies/terms/', label: t('common.footer.terms') },
  ]
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div className={styles.about}>
          <Link href="/" className={styles.brand}>
            <StoreLogo className={styles.logo} />
          </Link>
          {store.tagline ? <p className={styles.tagline}>{store.tagline}</p> : null}
          <p className={styles.note}>{store.description || t('common.footer.note')}</p>
        </div>
        <FooterColumn id="footer-shop" title={t('common.footer.shop')}>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                  {item.children.length ? <Chevron /> : null}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>
        <FooterColumn id="footer-care" title={t('common.footer.help')}>
          <ul className={styles.list}>
            {care.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={styles.link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>
        <FooterColumn id="footer-policies" title={t('common.footer.legal')}>
          <ul className={styles.list}>
            {policies.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={styles.link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>
        <div className={styles.touch}>
          <h2 className={styles.touchHeading}>{t('common.footer.touch')}</h2>
          <ul className={styles.details}>
            {store.contactPhone ? (
              <li className={styles.detail}>
                <PhoneIcon />
                <span className={styles.value}>
                  <span className={styles.hidden}>{t('common.contact.phone')}</span>
                  {store.contactPhone}
                </span>
                <span className={styles.badge}>{t('common.contact.allDay')}</span>
              </li>
            ) : null}
            {whatsapp && whatsappLine ? (
              <li className={styles.detail}>
                <Icon className={styles.whatsappIcon}>{socialIcons.whatsapp}</Icon>
                <Link href={whatsapp.url} className={styles.value}>
                  <span className={styles.hidden}>{t('common.contact.whatsapp')}</span>
                  {whatsappLine}
                </Link>
              </li>
            ) : null}
            {store.contactEmail ? (
              <li className={styles.detail}>
                <MailIcon />
                <span className={styles.value}>
                  <span className={styles.hidden}>{t('common.contact.email')}</span>
                  {store.contactEmail}
                </span>
              </li>
            ) : null}
            {place ? (
              <li className={styles.detail}>
                <PinIcon className={styles.contactIcon} />
                <div className={styles.address}>
                  <span className={styles.hidden}>{t('common.contact.address')}</span>
                  <strong className={styles.addressName}>{store.name}</strong>
                  {place}
                </div>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        {profiles.length ? (
          <ul className={styles.social}>
            {profiles.map((s) => (
              <li key={s.network}>
                <Link href={s.url} className={cx(styles.socialLink, s.network === 'instagram' && styles.instagram)}>
                  <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    {socialIcons[s.network]}
                  </svg>
                  <span className={styles.hidden}>{networkName[s.network]}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <span />
        )}
        <Link href="/contact/" className={styles.storeButton}>
          <StoreIcon className={styles.storeIcon} />
          {t('common.tools.findStore')}
        </Link>
        <div className={styles.payments}>
          <p className={styles.hidden}>{t('common.payments.label')}</p>
          <ul className={styles.paymentList}>
            {payments.map((p) => (
              <li key={p.id} className={p.id === 'mastercard' ? styles.paymentNarrow : styles.payment} title={p.name}>
                <span aria-hidden="true" className={styles.paymentMark}>
                  <PaymentMark id={p.id} />
                </span>
                <span className={styles.hidden}>{p.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.base}>
        <p className={styles.copyright}>{town ? t('common.footer.rightsAt', { store: store.name, place: town }) : t('common.footer.rights', { store: store.name })}</p>
        <ConsentSettingsButton t={t} className={styles.cookies} />
        {/*
          "Powered by" and DripFunnel's logo, linking to its site, on every page. Where the platform names the brand,
          core's sealed line says "Powered by" (worded so in content/en/powered.json); elsewhere, local dev included,
          the theme's own words do.
        */}
        <div className={styles.poweredBlock}>
          {poweredBy ? <PoweredBy brand={poweredBy} t={t} className={styles.powered} /> : <span className={styles.poweredText}>{t('common.footer.poweredBy')}</span>}
          {!poweredBy || poweredBy.toLowerCase() === 'dripfunnel' ? (
            <Link href={t('common.footer.poweredUrl')} className={styles.poweredMark}>
              <DripFunnelLogo />
              <span className={styles.hidden}>{t('common.footer.poweredLabel')}</span>
            </Link>
          ) : (
            <span className={styles.poweredMark}>{poweredBy}</span>
          )}
        </div>
      </div>
    </footer>
  )
}
