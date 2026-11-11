'use client'

import { useStorefront, type ProductPage } from '@dripfunnel/storefront-core/theme'
import styles from '../../styles/product.module.css'

/**
 * Each option's values as pills; a value sold out with the other choices looks unavailable but can still be chosen. An
 * option with a single value shows it as chosen, since it is the only one there is.
 */
export const Options = ({ page }: { page: ProductPage }) => {
  const { t } = useStorefront()
  return (
    <div className={styles.options}>
      {page.options.map((option) => (
        <div key={option.id} role="group" aria-label={option.name} className={styles.option}>
          <p className={styles.optionName}>{option.name}</p>
          <div className={styles.values}>
            {option.values.map((value) => (
              <button
                key={value.id}
                type="button"
                aria-pressed={value.selected || option.values.length === 1}
                aria-label={value.available ? value.name : t('shop.product.unavailable', { value: value.name })}
                className={value.selected || option.values.length === 1 ? styles.valueOn : value.available ? styles.value : styles.valueGone}
                onClick={() => page.choose(option.id, value.id)}
              >
                {value.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
