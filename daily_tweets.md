---
title: 2026-03-25 科技金融热点速递
cover: https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop
---

# 2026-03-25 科技金融热点速递

精选自 X 平台 AI 领域热门讨论，每日更新。

---

## 1. 您现在可以让 Claude 使用您的计算机来完成任务。  它可以打开您的应用程序、浏览浏览器、填写电...

**来源：** @claudeai

### 📝 原文

You can now enable Claude to use your computer to complete tasks.

It opens your apps, navigates your browser, fills in spreadsheets—anything you'd do sitting at your desk.

Research preview in Claude Cowork and Claude Code, macOS only.

### 🌐 专业翻译

您现在可以让 Claude 使用您的计算机来完成任务。

它可以打开您的应用程序、浏览浏览器、填写电子表格——您可以坐在办公桌前做的任何事情。

Claude Cowork 和 Claude Code 中的研究预览（仅限 macOS）。

### 💡 深度解读

AI服务暂时不可用，使用基础解读。

🏷️ **标签：** AI | 科技

📊 **数据：** 浏览 65310091 | 点赞 130730 | 转发 13498

🔗 [查看原文](https://x.com/claudeai/status/2036195789601374705)

---

## 2. LiteLLM 已被泄露，请勿更新。我们刚刚发现 LiteLLM pypi 版本 1.82.8。它已...

**来源：** @hnykda

### 📝 原文

LiteLLM HAS BEEN COMPROMISED, DO NOT UPDATE. We just discovered that LiteLLM pypi release 1.82.8. It has been compromised, it contains litellm_init.pth with base64 encoded instructions to send all the credentials it can find to remote server + self-replicate. link below

### 🌐 专业翻译

LiteLLM 已被泄露，请勿更新。我们刚刚发现 LiteLLM pypi 版本 1.82.8。它已被泄露，它包含 litellm_init.pth 和 base64 编码指令，用于将它能找到的所有凭据发送到远程服务器 + 自我复制。链接如下

### 💡 深度解读

AI服务暂时不可用，使用基础解读。

🏷️ **标签：** AI | 科技

📊 **数据：** 浏览 2731509 | 点赞 6607 | 转发 1637

🔗 [查看原文](https://x.com/hnykda/status/2036414330267193815)

---

## 3. Claude Code 推出全新功能：自动模式。  开发者无需再逐一审批每个文件写入和 bash 命...

**来源：** @claudeai

### 📝 原文

New in Claude Code: auto mode.

Instead of approving every file write and bash command, or skipping permissions entirely, auto mode lets Claude make permission decisions on your behalf.

Safeguards check each action before it runs.

### 🌐 专业翻译

Claude Code 推出全新功能：自动模式。

开发者无需再逐一审批每个文件写入和 bash 命令执行，也不必完全跳过权限控制。自动模式允许 Claude 代表用户做出权限决策。

内置安全防护机制会在每个操作执行前进行检查。

### 🎯 核心发现

Claude Code 引入了"信任中间层"——自动模式在完全手动审批和完全放权之间找到平衡点，通过 AI 代理自主判断操作风险等级，配合预执行安全检查机制，实现开发效率与安全性的动态平衡。

### 💡 深度解读

**背景分析**  
传统 AI 编程助手面临"效率-安全悖论"：要么每个操作都需人工确认（中断工作流），要么完全信任 AI（存在误操作风险）。这在企业级应用场景中尤为突出——开发者需要快速迭代，但 IT 部门要求严格的操作审计。

**行业意义**  
这标志着 AI Agent 从"工具"向"协作伙伴"的关键进化：
1. **决策权委托机制**：AI 不再是被动执行者，而是具备风险评估能力的自主代理
2. **分层信任架构**：通过 safeguards 实现"事前 AI 判断 + 事中系统校验"的双重保障
3. **人机协作新范式**：将人类从低价值的重复审批中解放，专注于高层决策

**为什么重要**  
这是 AI 编程工具商业化的关键突破。企业采购 AI 工具的最大顾虑是"失控风险"，自动模式通过可审计的决策日志 + 可配置的安全策略，为企业级部署扫清障碍。预计将推动 AI 编程助手从个人开发者市场向团队协作、企业 DevOps 场景渗透。

### 🔄 可迁移洞察

1. **金融风控领域**：自动化交易系统可借鉴"分层授权 + 实时风控"模式，让 AI 在预设风险阈值内自主决策，超限则触发人工审核

2. **医疗诊断辅助**：AI 可自主处理常规病例建议，复杂或高风险案例自动升级至专家会诊，提升诊疗效率同时保障安全

3. **供应链管理**：智能采购系统在正常波动范围内自动下单，异常价格或供应商变更则启动人工复核流程

4. **内容审核平台**：AI 自动处理明确违规/合规内容，灰色地带内容标记给人工审核，平衡效率与准确性

5. **企业 IT 运维**：AIOps 系统自主执行低风险操作（如日志清理、服务重启），关键变更（如配置修改、数据库操作）需人工确认

🏷️ **标签：** AI Agent 自主决策、人机协作范式、分层信任架构、开发者体验优化、企业级 AI 工具

📊 **数据：** 浏览 2122095 | 点赞 22886 | 转发 1423

🔗 [查看原文](https://x.com/claudeai/status/2036503582166393240)

---

## 4. 软件恐怖：litellm PyPI 供应链攻击。   简单的“pip install litellm...

**来源：** @karpathy

### 📝 原文

Software horror: litellm PyPI supply chain attack. 

Simple `pip install litellm` was enough to exfiltrate SSH keys, AWS/GCP/Azure creds, Kubernetes configs, git credentials, env vars (all your API keys), shell history, crypto wallets, SSL private keys, CI/CD secrets, database passwords.

LiteLLM itself has 97 million downloads per month which is already terrible, but much worse, the contagion spreads to any project that depends on litellm. For example, if you did `pip install dspy` (which depen

### 🌐 专业翻译

软件恐怖：litellm PyPI 供应链攻击。 

简单的“pip install litellm”足以泄露 SSH 密钥、AWS/GCP/Azure 凭证、Kubernetes 配置、git 凭证、环境变量（所有 API 密钥）、shell 历史记录、加密钱包、SSL 私钥、CI/CD 机密、数据库密码。

LiteLLM 本身每月有 9700 万次下载，这已经很糟糕了，但更糟糕的是，这种传染会蔓延到任何依赖 litellm 的项目。例如，如果您执行了“pip install dspy”（这取决于 litellm>=1.64.0），您也会被 pwnd 。对于任何其他依赖于 litellm 的大型项目也是如此。

事实上，中毒版本仅运行了不到 1 小时。该攻击有一个导致其被发现的错误 - Callum McMahon 在 Cursor 中使用了 MCP 插件，该插件将 litellm 作为传递依赖项引入。当安装 litellm 1.82.8 时，他们的机器内存不足并崩溃了。因此，如果攻击者没有对这次攻击进行振动编码，那么它可能会在几天或几周内未被检测到。

像这样的供应链攻击基本上是现代软件中可以想象到的最可怕的事情。每次安装任何依赖项时，您都可能会在整个依赖项树深处的任何位置拉入有毒的包。对于可能有很多依赖项的大型项目来说，这尤其危险。每次攻击中被盗的凭据可用于接管更多帐户并危害更多软件包。

经典软件工程会让你相信依赖关系是好的（我们正在用砖块建造金字塔），但在我看来，这必须重新评估，这就是为什么我越来越反对它们，更喜欢使用法学硕士来“yoink”功能，当它足够简单和可能时。

### 💡 深度解读

AI服务暂时不可用，使用基础解读。

🏷️ **标签：** AI | 科技

📊 **数据：** 浏览 2874905 | 点赞 12914 | 转发 2333

🔗 [查看原文](https://x.com/karpathy/status/2036487306585268612)

---

## 5. 肌萎缩侧索硬化症（ALS）逐渐剥夺了肯尼思的说话能力。通过 Neuralink 的 VOICE 临床...

**来源：** @neuralink

### 📝 原文

ALS has gradually taken away Kenneth’s ability to speak. Through Neuralink’s VOICE clinical trial, he’s exploring how a brain-computer interface designed to translate thought to speech could help restore autonomy in his daily life.

Watch to learn more:

### 🌐 专业翻译

肌萎缩侧索硬化症（ALS）逐渐剥夺了肯尼思的说话能力。通过 Neuralink 的 VOICE 临床试验，他正在探索旨在将思想转化为语音的脑机接口如何帮助他恢复日常生活的自主权。

观看以了解更多信息：

### 💡 深度解读

AI服务暂时不可用，使用基础解读。

🏷️ **标签：** AI | 科技

📊 **数据：** 浏览 11532104 | 点赞 10335 | 转发 1857

🔗 [查看原文](https://x.com/neuralink/status/2036489073091580011)

---

## 6. 我们即将告别 Sora。致所有使用 Sora 进行创作、分享作品并围绕它建立社区的用户：感谢你们。你...

**来源：** @soraofficialapp

### 📝 原文

We’re saying goodbye to Sora. To everyone who created with Sora, shared it, and built community around it: thank you. What you made with Sora mattered, and we know this news is disappointing.

We’ll share more soon, including timelines for the app and API and details on

### 🌐 专业翻译

我们即将告别 Sora。致所有使用 Sora 进行创作、分享作品并围绕它建立社区的用户：感谢你们。你们用 Sora 创造的内容意义重大，我们理解这一消息令人失望。

我们将很快分享更多信息，包括应用程序和 API 的时间表以及详细信息……

### 🎯 核心发现

OpenAI 的文生视频产品 Sora 宣布关闭服务。这是一次典型的 AI 产品生命周期终止公告，尽管拥有超过 130 万浏览量和活跃社区，产品仍面临停服。推文未完整披露后续安排的具体细节，暗示可能存在战略调整或技术迁移计划。

### 💡 深度解读

**背景分析**  
Sora 作为 OpenAI 在 2024 年推出的文生视频模型，曾引发行业轰动。此次关闭可能反映几个关键因素：(1) 计算成本与商业化收益不匹配；(2) 技术迭代导致产品架构需要重构；(3) 资源重新分配至更具战略价值的产品线。

**行业意义**  
这标志着生成式 AI 行业从"技术展示期"向"商业验证期"的转型阵痛。即使是头部 AI 公司，也必须面对产品可持续性的严峻考验。高浏览量和社区活跃度并不等同于健康的商业模型——这对整个 AI 创业生态是重要警示。

**为什么重要**  
此事件揭示了三个关键趋势：
- AI 产品的"烧钱换增长"模式正在被重新审视
- 用户参与度与商业价值之间存在显著鸿沟
- 大模型公司开始更谨慎地管理产品矩阵和资源分配

### 🔄 可迁移洞察

1. **SaaS 产品管理**：高用户参与度不等于产品成功，需建立清晰的价值变现路径
2. **创业公司战略**：技术领先性需要与单位经济效益平衡，避免过早扩张
3. **投资决策框架**：评估 AI 项目时，计算成本结构和边际成本曲线比 DAU/MAU 更关键
4. **平台生态建设**：依赖单一第三方 AI 能力的创业者需要制定技术迁移预案

🏷️ **标签：** AI产品生命周期、计算经济学、商业化验证、技术债务管理、生成式AI洗牌

📊 **数据：** 浏览 1330588 | 点赞 5223 | 转发 469

🔗 [查看原文](https://x.com/soraofficialapp/status/2036532795984715896)

---

## 7. 我们完成了750万美元融资，目标是终结AI生成的低质内容。  正式推出Moda：全球首个具备审美能力...

**来源：** @anvisha

### 📝 原文

We raised $7.5M to kill AI slop.

Introducing Moda: the world's first design agent with taste.

RT+ comment “Moda” and we’ll design your brand for FREE.

### 🌐 专业翻译

我们完成了750万美元融资，目标是终结AI生成的低质内容。

正式推出Moda：全球首个具备审美能力的设计Agent。

转发并评论"Moda"，我们将免费为您设计品牌形象。

### 🎯 核心发现

这是一个垂直领域AI Agent的典型GTM（Go-to-Market）策略案例：通过明确的问题定位（AI slop泛滥）+ 差异化价值主张（具备"taste"的设计能力）+ 病毒式营销手段（免费设计换取社交传播），在种子轮融资后快速获取早期用户和市场验证。182万浏览量证明了市场对"有品味的AI"这一概念的强烈共鸣。

### 💡 深度解读

**背景分析**  
"AI slop"已成为2024年AI行业的核心痛点——指代大量由生成式AI产出的平庸、同质化、缺乏创意的内容。设计领域尤其严重：Midjourney、DALL-E等工具虽然降低了创作门槛，但也导致视觉污染和品牌同质化。

**行业意义**  
Moda的定位揭示了AI Agent进化的关键方向：从"能做"到"做得好"。强调"taste"（审美判断力）意味着他们可能整合了：
- 设计原则的知识图谱（色彩理论、排版规范、品牌一致性）
- 基于人类反馈的强化学习（RLHF）来训练审美偏好
- 多模态评估系统来筛选输出质量

这标志着AI工具从"生产力放大器"向"专业替代者"的跃迁。

**为什么重要**  
750万美元的种子轮规模表明投资人认可两个趋势：
1. **垂直化Agent的商业价值** - 通用AI让位于深耕特定领域的专业Agent
2. **质量溢价市场的崛起** - 企业愿意为"有品味的AI"支付溢价，而非使用免费但平庸的工具

### 🔄 可迁移洞察

这个"反AI slop"的定位策略可应用于：

**内容创作领域** - "具备叙事能力的AI写作Agent"，对抗千篇一律的SEO文章  
**代码生成领域** - "遵循最佳实践的编程Agent"，而非仅能运行的代码片段  
**法律/财务咨询** - "具备行业经验判断的专业Agent"，超越简单的文档生成  
**教育培训** - "理解教学法的AI导师"，而非知识搬运工

核心逻辑：在AI民主化的下半场，**专业判断力和领域品味**将成为稀缺价值。

🏷️ **标签：** AI Agent、设计自动化、质量溢价、垂直SaaS、病毒式营销

📊 **数据：** 浏览 1825607 | 点赞 3203 | 转发 806

🔗 [查看原文](https://x.com/anvisha/status/2036474296353411290)

---

## 8. 人们花 700 美元购买 mac mini 来运行 openclaw 代理，观看 claude 以 ...

**来源：** @davidonchainx

### 📝 原文

People who spent $700 on a mac mini to run an openclaw agent watching claude launch all the features natively for $20

### 🌐 专业翻译

人们花 700 美元购买 mac mini 来运行 openclaw 代理，观看 claude 以 20 美元的价格原生推出所有功能

### 💡 深度解读

AI服务暂时不可用，使用基础解读。

🏷️ **标签：** AI | 科技

📊 **数据：** 浏览 4797239 | 点赞 31225 | 转发 1496

🔗 [查看原文](https://x.com/davidonchainx/status/2036233287115460852)

---

## 9. 现在，您可以使用 AI 代理直接在 Figma 画布上进行设计，并通过我们新的 use_figma ...

**来源：** @figma

### 📝 原文

Now you can use AI agents to design directly on the Figma canvas, with our new use_figma MCP tool and skills to teach them. Open beta starts today.

### 🌐 专业翻译

现在，您可以使用 AI 代理直接在 Figma 画布上进行设计，并通过我们新的 use_figma MCP 工具和技能来教授它们。公开测试版今天开始。

### 💡 深度解读

AI服务暂时不可用，使用基础解读。

🏷️ **标签：** AI | 科技

📊 **数据：** 浏览 2449812 | 点赞 5382 | 转发 524

🔗 [查看原文](https://x.com/figma/status/2036434766661296602)

---

## 10. Neuralink 正在帮助那些失去说话能力的人恢复言语能力

**来源：** @elonmusk

### 📝 原文

Neuralink is restoring speech to those who have lost the ability to speak

### 🌐 专业翻译

Neuralink 正在帮助那些失去说话能力的人恢复言语能力

### 💡 深度解读

AI服务暂时不可用，使用基础解读。

🏷️ **标签：** AI | 科技

📊 **数据：** 浏览 10711921 | 点赞 61730 | 转发 7925

🔗 [查看原文](https://x.com/elonmusk/status/2036507909815935003)

---


*生成时间：2026-03-25 06:32:03*
