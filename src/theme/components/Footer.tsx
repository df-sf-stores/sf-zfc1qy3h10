import type { ReactNode } from 'react'
import { ConsentSettingsButton, Link, PoweredBy, StoreLogo, useStorefront } from '@dripfunnel/storefront-core/theme'
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

/** Payment marks: small white badges, each name in its brand's colours (Mastercard as its two circles). */
type PaymentId = 'phonepe' | 'gpay' | 'paytm' | 'upi' | 'rupay' | 'mastercard' | 'visa'

const paymentClass: Record<PaymentId, string | undefined> = {
  phonepe: styles.phonepe,
  gpay: styles.gpay,
  paytm: styles.paytm,
  upi: styles.upi,
  rupay: styles.rupay,
  mastercard: undefined,
  visa: styles.visa,
}

const PaymentMark = ({ id, name }: { id: PaymentId; name: string }) =>
  id === 'mastercard' ? (
    <svg className={styles.mastercard} viewBox="0 0 38 24" role="img" aria-label={name}>
      <circle cx="14" cy="12" r="8" fill="#eb001b" />
      <circle cx="24" cy="12" r="8" fill="#f79e1b" />
      <path d="M19 5.8a8 8 0 010 12.4 8 8 0 010-12.4z" fill="#ff5f00" />
    </svg>
  ) : (
    <span className={paymentClass[id]}>
      {id === 'phonepe' ? <span className={styles.phonepeDot} aria-hidden="true" /> : null}
      {name}
      {id === 'rupay' ? <span className={styles.rupayMark} aria-hidden="true" /> : null}
    </span>
  )

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
              <li key={p.id} className={styles.payment} title={p.name}>
                <PaymentMark id={p.id} name={p.name} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.base}>
        <p className={styles.copyright}>{town ? t('common.footer.rightsAt', { store: store.name, place: town }) : t('common.footer.rights', { store: store.name })}</p>
        <ConsentSettingsButton t={t} className={styles.cookies} />
        {/*
          The platform decides whether a store shows "Powered by" (core's sealed line, worded "Powered by" alone in
          content/en/powered.json); where it does, the brand follows as a bold white wordmark, linking to DripFunnel's site.
        */}
        {poweredBy ? (
          <div className={styles.poweredBlock}>
            <PoweredBy brand={poweredBy} t={t} className={styles.powered} />
            {poweredBy.toLowerCase() === 'dripfunnel' ? (
              <Link href={t('common.footer.poweredUrl')} className={styles.poweredMark}>
                {poweredBy}
              </Link>
            ) : (
              <span className={styles.poweredMark}>{poweredBy}</span>
            )}
          </div>
        ) : null}
      </div>
    </footer>
  )
}
