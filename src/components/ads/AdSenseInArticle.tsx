import { useEffect, useRef } from 'react'

// 声明全局类型
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface AdSenseInArticleProps {
  slot: string
  className?: string
}

const AdSenseInArticle = ({ slot, className = '' }: AdSenseInArticleProps) => {
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
    <div className={`ad-container my-8 ${className}`}>
      <div className="text-center text-text-secondary text-sm mb-2">
        广告
      </div>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-xxxxxxxxxx" // 替换为实际的AdSense客户端ID
        data-ad-slot={slot}
        data-ad-format="fluid"
        data-layout-key="-6t+ed+2i-1n-4w"
      />
    </div>
  )
}

export default AdSenseInArticle
