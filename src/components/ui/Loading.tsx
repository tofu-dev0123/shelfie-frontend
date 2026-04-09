import Image from 'next/image'
import styles from './styles/Loading.module.css'

export function Loading() {
  return (
    <div className={styles.screen}>
      <div className={styles.loader}>
        <div className={styles.logoWrap}>
          <Image src="/images/S-logo.png" alt="Shelfie" width={48} height={70} />
        </div>
        <div className={styles.orbit}>
          <div className={styles.dotArm}><div className={styles.dot} /></div>
          <div className={styles.dotArm}><div className={styles.dot} /></div>
          <div className={styles.dotArm}><div className={styles.dot} /></div>
          <div className={styles.dotArm}><div className={styles.dot} /></div>
          <div className={styles.dotArm}><div className={styles.dot} /></div>
          <div className={styles.dotArm}><div className={styles.dot} /></div>
          <div className={styles.dotArm}><div className={styles.dot} /></div>
          <div className={styles.dotArm}><div className={styles.dot} /></div>
        </div>
      </div>
    </div>
  )
}
