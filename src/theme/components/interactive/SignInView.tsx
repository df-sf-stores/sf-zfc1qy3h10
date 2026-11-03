'use client'

import { useState } from 'react'
import { Checkbox, Form, Link, SubmitButton, TextField, useSignIn, useStorefront, type FieldProblem } from '@dripfunnel/storefront-core/theme'
import shop from '../../styles/shop.module.css'
import styles from '../../styles/account.module.css'

type Purpose = 'signIn' | 'register' | 'reset'

/** Sign in by email and password, or create an account or set a new password with a code sent by email; this shop signs in by email only. */
export const SignInView = ({ purpose }: { purpose: Purpose }) => {
  const { t } = useStorefront()
  const s = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<Partial<Record<'email' | 'password' | 'to' | 'code' | 'name', FieldProblem>>>({})
  const problem = (p: FieldProblem | undefined, field?: 'password' | 'code') =>
    p === 'required' ? t('shop.checkout.required') : p === 'invalid' ? (field === 'password' && purpose !== 'signIn' ? t('shop.account.passwordRule') : field === 'code' ? t('shop.account.codeRule') : t('shop.checkout.invalid')) : null
  const refusal = (code: string) =>
    code === 'SIGN_IN_REFUSED'
      ? t('shop.account.refused.signIn')
      : code === 'CODE_REFUSED'
        ? t('shop.account.refused.code')
        : code === 'WEAK_PASSWORD'
          ? t('shop.account.passwordRule')
          : code === 'RATE_LIMITED'
            ? t('shop.account.refused.tooMany')
            : code === 'METHOD_OFF'
              ? t('shop.account.refused.methodOff')
              : t('shop.account.refused.other')
  const title = purpose === 'register' ? t('pages.register.title') : purpose === 'reset' ? t('pages.forgotPassword.title') : t('pages.signIn.title')

  if (s.previewOnly) {
    return (
      <section className={styles.auth}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.alert} role="status">
          {t('shop.account.preview')}
        </p>
        <Link href="/" className={shop.secondary}>
          {t('shop.order.keepShopping')}
        </Link>
      </section>
    )
  }

  const sentTo = s.sent?.to ?? ''
  return (
    <section className={styles.auth}>
      <h1 className={styles.title}>{title}</h1>
      {purpose === 'register' ? <p className={styles.lead}>{t('pages.register.lead')}</p> : purpose === 'reset' && !s.sent ? <p className={styles.lead}>{t('shop.account.resetLead')}</p> : null}
      {s.error ? (
        <p className={styles.alert} role="alert">
          {refusal(s.error)}
        </p>
      ) : null}
      {s.sent ? (
        <Form
          className={styles.form}
          onSubmit={() =>
            void s.verify({ code, remember, ...(purpose === 'register' ? { name, password } : purpose === 'reset' ? { password } : {}) }).then(setErrors)
          }
        >
          <p className={styles.note}>{t('shop.account.codeSent', { to: sentTo })}</p>
          <TextField label={t('shop.account.code')} inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={setCode} error={problem(errors.code, 'code')} className={styles.field} />
          {purpose === 'reset' ? <TextField label={t('shop.account.newPassword')} type="password" autoComplete="new-password" value={password} onChange={setPassword} hint={t('shop.account.passwordRule')} error={problem(errors.password, 'password')} className={styles.field} /> : null}
          <SubmitButton className={shop.primary} disabled={s.busy}>
            {purpose === 'register' ? t('shop.account.create') : purpose === 'reset' ? t('shop.account.saveAndSignIn') : t('pages.signIn.title')}
          </SubmitButton>
          <button type="button" className={styles.link} onClick={s.restart}>
            {t('shop.account.another')}
          </button>
        </Form>
      ) : purpose === 'signIn' ? (
        <Form className={styles.form} onSubmit={() => void s.signIn({ email, password, remember }).then(setErrors)}>
          <TextField label={t('shop.checkout.email')} type="email" autoComplete="username" value={email} onChange={setEmail} error={problem(errors.email)} className={styles.field} />
          <TextField label={t('shop.account.password')} type="password" autoComplete="current-password" value={password} onChange={setPassword} error={problem(errors.password)} className={styles.field} />
          <div className={styles.between}>
            <Checkbox checked={remember} onChange={setRemember} className={styles.check}>
              {t('shop.account.remember')}
            </Checkbox>
            <Link href="/forgot-password/" className={styles.link}>
              {t('shop.account.forgot')}
            </Link>
          </div>
          <SubmitButton className={shop.primary} disabled={s.busy}>
            {t('pages.signIn.title')}
          </SubmitButton>
        </Form>
      ) : (
        <Form
          className={styles.form}
          onSubmit={() => {
            if (purpose === 'register') {
              const own: typeof errors = {}
              if (!name.trim()) own.name = 'required'
              if (password.length < 10) own.password = password ? 'invalid' : 'required'
              if (Object.keys(own).length > 0) return setErrors(own)
            }
            void s.sendCode({ channel: 'email', to: email }).then(setErrors)
          }}
        >
          {purpose === 'register' ? <TextField label={t('shop.account.name')} autoComplete="name" value={name} onChange={setName} error={problem(errors.name)} className={styles.field} /> : null}
          <TextField label={t('shop.checkout.email')} type="email" autoComplete="email" value={email} onChange={setEmail} error={problem(errors.to)} className={styles.field} />
          {purpose === 'register' ? <TextField label={t('shop.account.password')} type="password" autoComplete="new-password" value={password} onChange={setPassword} hint={t('shop.account.passwordRule')} error={problem(errors.password, 'password')} className={styles.field} /> : null}
          <SubmitButton className={shop.primary} disabled={s.busy}>
            {t('shop.account.emailMe')}
          </SubmitButton>
        </Form>
      )}
      <p className={styles.switch}>
        {purpose === 'signIn' ? (
          <Link href="/register/" className={styles.link}>
            {t('pages.signIn.action')}
          </Link>
        ) : (
          <Link href="/sign-in/" className={styles.link}>
            {purpose === 'register' ? t('pages.register.action') : t('pages.forgotPassword.action')}
          </Link>
        )}
      </p>
    </section>
  )
}
