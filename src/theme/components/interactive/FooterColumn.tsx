'use client'

import { useState, type ReactNode } from 'react'
import { useMediaQuery } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import styles from '../../styles/footer.module.css'

export type FooterColumnId = 'footer-shop' | 'footer-care' | 'footer-policies'

/** A footer column: a plain heading over its links on wide screens, an accordion on phones and tablets. */
export const FooterColumn = ({ id, title, children }: { id: FooterColumnId; title: string; children: ReactNode }) => {
  const wide = useMediaQuery('(min-width: 1024px)')
  const [open, setOpen] = useState(false)
  return (
    <div className={cx(styles.column, (wide || open) && styles.columnOpen)}>
      <h2 className={styles.heading}>
        {wide ? (
          title
        ) : (
          <button type="button" className={styles.headingButton} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
            {title}
            <svg className={styles.plus} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d={open ? 'M6 12h12' : 'M6 12h12M12 6v12'} />
            </svg>
          </button>
        )}
      </h2>
      <div id={id} className={styles.columnBody}>
        {children}
      </div>
    </div>
  )
}
