import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'

type Article = {
  title: string
  url: string
  date: string
  slug: string
}

const articlesData: Article[] = [
  {
    "title": "为什么「不做什么」比「做什么」更重要",
    "url": "/daily/2026-03-19-not-to-do.html",
    "date": "2026-03-19",
    "slug": "not-to-do"
  },
  {
    "title": "2026-03-16 科技金融热点速递（X 热门精选）",
    "url": "/daily/2026-03-16.html",
    "date": "2026-03-16",
    "slug": "2026-03-16-hot-news"
  }
]

// 文章内容数据 - 与 HTML 文件内容同步
const articleContents: Record<string, { title: string; date: string; content: JSX.Element }> = {
  "not-to-do": {
    title: "为什么「不做什么」比「做什么」更重要",
    date: "2026-03-19",
    content: (
      <>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-4 mb-8 italic text-gray-600 rounded-r-lg">
          严格执行「不为」清单，比研究「做什么」更重要，执行也更简单直接。
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 border-b-2 border-gray-200 pb-2 mb-4">🍽️ 一、饮食领域的「不为」清单</h2>
          <p className="text-gray-600 mb-4">在做到以下几点之前，谈论任何营养学都是<strong className="text-gray-800">本末倒置</strong>。</p>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🚫 绝对零烟酒</h3>
              <p className="text-gray-600">所有烟酒都有害，没有例外。所谓「红葡萄酒对心脏有好处」纯属商家营销，缺乏严谨临床数据支撑。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🚫 断绝游离糖与代饮</h3>
              <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
                <li>不喝可乐和果汁（白开水永远是最优解）</li>
                <li>拒绝甜食与各类糕点</li>
                <li>警惕调味汁和酱料中的隐形糖</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🚫 极简餐饮源</h3>
              <p className="text-gray-600">尽量少吃外卖，少下馆子。餐馆食品为了口味，糖分超标，且包含大量不可控、不可见、对身体有害的原料。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🚫 守住消化边界</h3>
              <p className="text-gray-600">晚饭到睡觉之间，必须保持<strong className="text-blue-600">至少三小时</strong>的空腹间隔。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🚫 执行默认否决</h3>
              <p className="text-gray-600">当对某种食物的成分或健康度「不确信」时，默认选项即为：<strong className="text-blue-600">少吃，或直接不吃</strong>。</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 border-b-2 border-gray-200 pb-2 mb-4">🛡️ 二、社交与博弈的「不为」清单</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🚫 设立高准入门槛</h3>
              <p className="text-gray-600">不要让任何未付出足够代价、未经过甄别的人接近你。个人边界感必须极其清晰。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🚫 王者不辩</h3>
              <p className="text-gray-600"><strong className="text-blue-600">绝不和人吵架</strong>，停止无意义的情绪消耗。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🚫 规避非对称劣势</h3>
              <p className="text-gray-600">不在自己没有任何结构性优势的地方和别人硬拼。永远不要在自己防守成本高、对方进攻成本低的地方，与人发生正面冲突。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🚫 停止向下解释</h3>
              <p className="text-gray-600"><strong className="text-blue-600">绝不对没有支付代价的人解释自己</strong>。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🚫 戒除自作多情</h3>
              <p className="text-gray-600">社交与商业的本质是<strong className="text-blue-600">价值互换</strong>。只有你能给别人带来利益，别人才会对你讲感情。</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 border-b-2 border-gray-200 pb-2 mb-4">⏳ 三、工作与生产力的「不为」清单</h2>
          <div className="grid gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 拒绝多任务并行</strong> — 同时处理多件事意味着每件事都做不好。单线程深度工作，完成一件再开始下一件。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不参与无效会议</strong> — 没有明确议程、没有预读材料、没有决策目标的会议，坚决拒绝或中途退出。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不做完美主义者</strong> — 交付 80 分的结果，远好于永远停留在 99% 的「即将完成」状态。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不立即回复消息</strong> — 关闭所有非紧急通知，固定时间段统一处理消息。即时响应是对自己时间的掠夺。</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 border-b-2 border-gray-200 pb-2 mb-4">💰 四、财务与投资的「不为」清单</h2>
          <div className="grid gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不碰不懂的领域</strong> — 永远只投自己能讲清楚逻辑的资产。如果解释不了为什么涨，就不该买。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不追涨杀跌</strong> — 市场情绪最狂热时坚决离场，最恐慌时敢于加仓。逆向而行，反人性操作。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不加杠杆</strong> — 永远不要借钱投资。杠杆放大收益的同时，也在放大归零的风险。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不分散过度</strong> — 持有超过 10 个品种不是分散风险，是分散注意力。集中优势兵力，精选少而精的标的。</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 border-b-2 border-gray-200 pb-2 mb-4">📵 五、信息消费的「不为」清单</h2>
          <div className="grid gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不刷算法推荐</strong> — 算法推荐是注意力收割机。主动搜索，被动投喂只会让你越来越蠢。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不看即时新闻</strong> — 99% 的新闻与你无关，且会在 24 小时后失去价值。周报、月报足以掌握必要信息。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不参与网络论战</strong> — 评论区吵架没有赢家，只有时间的小偷。看到对立观点，直接划走。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不收藏即弃用</strong> — 收藏夹是信息的坟墓。要么立即处理，要么干脆不收藏。定期清理，保持归零。</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 border-b-2 border-gray-200 pb-2 mb-4">🧠 六、心理与情绪的「不为」清单</h2>
          <div className="grid gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不反刍过去</strong> — 已经发生的事件，复盘一次就够了。反复咀嚼只会制造内耗，不产生任何价值。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不焦虑未来</strong> — 担忧 90% 不会发生，剩下 10% 发生时也总有办法。专注当下可控之事。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不寻求外部认可</strong> — 你的价值不取决于别人的评价。内部评分卡，远胜外部掌声。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不压抑负面情绪</strong> — 愤怒、悲伤都是正常信号，允许它们存在并流经自己，而不是强行正能量。</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 border-b-2 border-gray-200 pb-2 mb-4">📚 七、成长学习的「不为」清单</h2>
          <div className="grid gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不追求读书数量</strong> — 读 100 本书不如把 10 本经典读透。重读旧书，远胜泛读新书。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不盲目跟风课程</strong> — 报课前问自己：这个技能我未来 5 年会用吗？不能立刻实践的，都是伪学习。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不迷信权威</strong> — 任何观点都要经过自己的验证。专家也会错，保持独立判断。</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-600"><strong className="text-blue-600">🚫 不停留在舒适区</strong> — 只做已经擅长的事，是在透支过去的积累。刻意练习短板，才能持续进化。</p>
            </div>
          </div>
        </section>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mt-8 shadow-sm">
          <h3 className="text-green-800 font-bold mb-3 text-lg">💡 核心洞察</h3>
          <p className="text-green-700 font-medium mb-3">研究的成本远高于排除的成本。</p>
          <ul className="text-green-700 space-y-2">
            <li><strong>决策成本极低</strong> — 只需要说"不"</li>
            <li><strong>执行简单直接</strong> — 无需复杂准备</li>
            <li><strong>风险可控</strong> — 避坑就是赚</li>
            <li><strong>复利效应</strong> — 少犯错误，长期优势巨大</li>
          </ul>
          <p className="text-green-800 mt-4 font-medium">建立你的「不为」清单，比制定年度计划更有效。</p>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          简约生活，从说"不"开始。<br/>TechFinX · 2026-03-19
        </p>
      </>
    )
  }
}

// 统一的头部导航
const Header = () => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <Link to="/" className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center hover:shadow-lg transition-shadow">
            <span className="text-white font-bold text-lg">X</span>
          </Link>
          <div>
            <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">TechFinX</Link>
            <p className="text-xs text-gray-500">科技金融 · 每日精选</p>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-sm ml-4">
            <Link to="/articles" className="text-blue-600 font-medium">个人文章</Link>
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">每日精选</Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <a href="https://x.com/mumu86007" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </header>
)

// 文章详情页
export const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const article = articleContents[slug || '']

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">文章未找到</h2>
            <p className="text-gray-500 mb-4">该文章可能不存在或已被移除</p>
            <Link to="/articles" className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              ← 返回文章列表
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>TechFinX | {article.title}</title>
        <meta name="description" content={article.title} />
      </Helmet>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <Link to="/articles" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回文章列表
          </Link>
        </div>

        <article className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
          <header className="mb-6 pb-4 border-b border-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{article.title}</h1>
            <time className="text-gray-400 text-sm">{article.date}</time>
          </header>
          
          <div className="prose prose-blue max-w-none">
            {article.content}
          </div>
        </article>
      </main>
    </div>
  )
}

// 文章列表页
const Articles = () => {
  const [items, setItems] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch('/data/articles.json')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!mounted) return
        // 兼容旧数据结构，如果没有 slug 则生成
        const processed = (Array.isArray(data) ? data : []).map((item: Article, idx: number) => ({
          ...item,
          slug: item.slug || `article-${idx}`
        }))
        setItems(processed)
        setLoading(false)
      })
      .catch(() => {
        if (!mounted) return
        // 使用本地数据作为 fallback
        setItems(articlesData)
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>TechFinX | 个人文章</title>
        <meta name="description" content="TechFinX 个人文章：原创内容归档，便于检索与阅读。" />
        <link rel="canonical" href="https://techfinx.top/articles" />
      </Helmet>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">个人文章</h1>
            <p className="text-gray-500">我的文章更新列表</p>
          </div>

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && items.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <div className="text-gray-400 mb-2">暂无文章</div>
              <p className="text-sm text-gray-500">敬请期待更新</p>
            </div>
          )}

          <div className="space-y-4">
            {items.map((a, idx) => (
              <Link
                key={idx}
                to={`/articles/${a.slug}`}
                className="block p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                      {a.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <span>点击查看全文</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 whitespace-nowrap bg-gray-50 px-3 py-1 rounded-full">
                    {new Date(a.date).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 pb-8">
          <p>© {new Date().getFullYear()} TechFinX</p>
          <p className="mt-2">
            联系邮箱：
            <a className="text-blue-500 hover:underline" href="mailto:Mumu86007@gmail.com">
              Mumu86007@gmail.com
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Articles
