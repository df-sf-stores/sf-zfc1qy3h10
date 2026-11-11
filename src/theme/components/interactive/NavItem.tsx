'use client'

import { useRef, useState } from 'react'
import { Link, useStorefront, type MenuItem } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import styles from '../../styles/header.module.css'

/** Past this many sub-categories the dropdown opens as a wide, multi-column mega menu. */
const megaFrom = 7

/** A top-level menu link; one with sub-categories opens them on hover, on focus or from its arrow button. */
export const NavItem = ({ item }: { item: MenuItem }) => {
  const { t } = useStorefront()
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const leaving = useRef<ReturnType<typeof setTimeout>>(undefined)
  const hovered = useRef(false)
  const focused = useRef(false)
  const show = (value: boolean) => {
    clearTimeout(leaving.current)
    setOpen(value)
  }
  if (!item.children.length)
    return (
      <div className={styles.navItem}>
        <Link href={item.href} className={styles.navLink}>
          {item.label}
        </Link>
      </div>
    )
  return (
    <div
      className={styles.navItem}
      onKeyDown={(e) => {
        if (e.key !== 'Escape' || !open) return
        show(false)
        toggle.current?.focus()
      }}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return
        hovered.current = true
        show(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse') return
        hovered.current = false
        if (!focused.current) leaving.current = setTimeout(() => setOpen(false), 120)
      }}
      onFocus={(e) => {
        focused.current = true
        if (e.target === (toggle.current as EventTarget | null)) clearTimeout(leaving.current)
        else show(true)
      }}
      onBlur={() => {
        focused.current = false
        leaving.current = setTimeout(() => setOpen(false), 0)
      }}
    >
      <Link href={item.href} className={styles.navLink}>
        {item.label}
      </Link>
      <button ref={toggle} type="button" className={styles.subToggle} aria-expanded={open} aria-label={t('common.nav.submenu', { item: item.label })} onClick={() => show(hovered.current || !open)}>
        <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className={cx(styles.subnav, item.children.length >= megaFrom && styles.mega, open && styles.subnavOpen)}>
        <p className={styles.subTitle}>{item.label}</p>
        <ul className={styles.subList}>
          {item.children.map((child) => (
            <li key={child.id}>
              <Link href={child.href} className={styles.subLink}>
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={item.href} className={styles.subAll}>
          {t('common.nav.shopAllOf', { item: item.label })}
          <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
