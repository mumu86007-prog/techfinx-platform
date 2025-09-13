import { useEffect, useRef } from 'react'

// 声明全局类型
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface AdSenseBannerProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  responsive?: boolean
  className?: string
}

const AdSenseBanner = ({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '' 
}: AdSenseBannerProps) => {
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }
  }, [])

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-xxxxxxxxxx" // 替换为实际的AdSense客户端ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}

export default AdSenseBanner
