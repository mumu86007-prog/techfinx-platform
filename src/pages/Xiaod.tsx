import { Helmet } from 'react-helmet-async'

const steps = [
  ['01', '接收任务', '在飞书中发送公开链接、妙记链接或本地音频文件。'],
  ['02', '下载与转录', '提取音轨并转为带时间戳的完整原始转录。'],
  ['03', '整理与交付', '按语义分段，创建飞书文档并返回可访问链接。'],
]

const boundaries = [
  ['默认交付', '完整原始转录稿；保留时间戳，仅做分段。'],
  ['需要明确说明', '摘要、提纯、改写或阅读稿等二次加工。'],
  ['无法处理', '付费、登录受限或无权限访问的内容。'],
  ['人工核验', '专有名词、人名或听不清的片段会标记“[需核对]”。'],
]

export default function Xiaod() {
  return (
    <main className="min-h-screen bg-[#10110f] text-stone-100 selection:bg-amber-300 selection:text-stone-950">
      <Helmet>
        <title>小D｜音视频转录整理助手</title>
        <meta name="description" content="小D音视频转录整理助手的只读能力说明页。" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="border-b border-stone-800">
        <div className="mx-auto max-w-6xl px-6 py-6 sm:px-10">
          <p className="font-mono text-xs tracking-[0.18em] text-amber-300">D3 / INTERNAL SHOWCASE</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[1.25fr_0.75fr] lg:py-28">
        <div>
          <p className="mb-6 inline-flex rounded-full border border-stone-700 px-3 py-1 font-mono text-xs text-stone-300">
            展示页 · 只读 · 不接 API · 不处理上传内容
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.055em] text-stone-50 sm:text-7xl">
            小D｜音视频转录整理助手
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-stone-300">
            把播客、公开视频和会议录音，交付为便于查阅与回溯的飞书文档。它把人工下载、转录、排版和分享的流程，收束成一次明确交付。
          </p>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-stone-400">
            <a className="underline decoration-amber-300/70 underline-offset-4 hover:text-amber-200" href="#workflow">查看流程</a>
            <a className="underline decoration-amber-300/70 underline-offset-4 hover:text-amber-200" href="#boundaries">查看边界</a>
          </div>
        </div>
        <aside className="border-l border-stone-700 pl-6 lg:mt-8">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-stone-500">交付承诺</p>
          <p className="mt-4 text-2xl leading-tight text-stone-100">只在文档创建、权限确认、链接取得后三项齐备时，才报告“已交付”。</p>
          <p className="mt-5 text-sm leading-6 text-stone-400">处理失败会如实说明原因，不生成假链接，不把“正在处理”当作完成。</p>
        </aside>
      </section>

      <section className="border-y border-stone-800 bg-[#171915]" id="workflow">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-mono text-xs tracking-[0.18em] text-amber-300">工作方式</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">从链接到可查阅文档</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-stone-400">常规内容约 10 分钟进入交付流程；长音频会按实际时长拆分处理。</p>
          </div>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map(([number, title, description]) => (
              <li className="border-t border-stone-600 pt-5" key={number}>
                <p className="font-mono text-sm text-amber-300">{number}</p>
                <h3 className="mt-7 text-xl font-medium text-stone-100">{title}</h3>
                <p className="mt-3 leading-7 text-stone-400">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 sm:px-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-amber-300">交付物样式</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">完整，可追溯，可核对</h2>
          <p className="mt-5 max-w-md leading-7 text-stone-400">下面是虚构的排版样例，仅说明文档结构，不包含真实录音、人员或飞书数据。</p>
        </div>
        <article className="bg-[#f4f0e7] p-6 text-stone-900 shadow-2xl shadow-black/20 sm:p-9">
          <p className="font-mono text-xs tracking-[0.14em] text-stone-500">原始转录稿 · 示例</p>
          <h3 className="mt-5 text-2xl font-semibold">为什么先保留完整原始转录</h3>
          <div className="mt-8 space-y-5 border-l-2 border-amber-500 pl-5 text-[15px] leading-7 text-stone-700">
            <p><span className="mr-3 font-mono text-xs text-stone-400">00:03:12</span>发言人 A：我们最先确定的是，不把转录稿默认做成摘要。</p>
            <p><span className="mr-3 font-mono text-xs text-stone-400">00:03:27</span>发言人 B：对，后续讨论需要回到原话时，时间戳非常重要。</p>
            <p><span className="mr-3 font-mono text-xs text-stone-400">00:03:46</span>发言人 A：术语听不清的地方保留位置并标记 [需核对]。</p>
          </div>
        </article>
      </section>

      <section className="border-y border-stone-800 bg-[#171915]" id="boundaries">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
          <p className="font-mono text-xs tracking-[0.18em] text-amber-300">能力与边界</p>
          <div className="mt-10 grid gap-px overflow-hidden border border-stone-700 bg-stone-700 md:grid-cols-2">
            {boundaries.map(([title, description]) => (
              <article className="bg-[#171915] p-7" key={title}>
                <h3 className="text-lg font-medium text-stone-100">{title}</h3>
                <p className="mt-3 leading-7 text-stone-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <p className="font-mono text-xs tracking-[0.18em] text-amber-300">团队使用</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">在飞书中给小D发送内容即可</h2>
        <p className="mt-5 max-w-2xl leading-7 text-stone-400">适用输入包括公开播客和视频链接、飞书妙记/会议录音链接，以及本地 .mp3、.m4a、.wav 文件。实际运行需要由已授权成员在飞书 Bot 中发起。</p>
      </section>

      <footer className="border-t border-stone-800 px-6 py-8 text-center font-mono text-xs text-stone-500">
        本页为能力说明，不提供任务执行或数据访问。
      </footer>
    </main>
  )
}
