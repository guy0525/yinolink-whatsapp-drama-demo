window.DRAMA_JOURNEYS = [
  {
    id: "activate",
    group: "drama",
    badge: "短剧 · 激活",
    title: "新用户激活",
    subtitle: "CTWA → 预告片欢迎 → 首集观看",
    goal: "广告点击无缝进私域：自动欢迎 + 悬念预告片 + 观看 CTA，完成首次打开与第 1 集观看。",
    outcome: "用户点击「立即免费观看」进入 App/H5 第 1 集；激活事件回传 Ads。",
    steps: ["广告进线", "欢迎+预告", "首集观看", "激活回传"],
    events: [
      { time: "T-0", title: "IG CTWA click", desc: "短剧预告广告「Send message」", state: "done" },
      { time: "T+2s", title: "Welcome flow", desc: "视频预告 + 剧情介绍", state: "active" },
      { time: "T+会话", title: "First watch CTA", desc: "跳转 App / H5 第 1 集", state: "pending" },
      { time: "转化", title: "Activation event", desc: "首开 + 首集观看回传", state: "pending" },
    ],
    persona: {
      name: "Aisha Rahman",
      initials: "AR",
      meta: "ID · WhatsApp +62 8•••4412",
      info: [
        ["线索来源", "IG Reels · CTWA"],
        ["兴趣剧", "CEO's Secret Contract"],
        ["语言", "EN / ID"],
        ["阶段", "未激活游客"],
      ],
      tags: ["新用户", "CTWA", "激活"],
      insights: [
        "前 10 集免费是 Hook；首响必须带画面与一键观看。",
        "激活事件回传可降低后续获客 CPA。",
      ],
      agentHint: "优先推送预告视频与观看深链，少问开放题。",
    },
    script: [
      {
        messages: [
          { type: "day", text: "TODAY" },
          { type: "encryption", text: "Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them. Learn more" },
          { type: "system", text: "Opened from Instagram ad · Click-to-WhatsApp" },
          {
            type: "bot",
            text: "Welcome to *ReelNest* 🔥\nThis drama is blowing up right now — the CEO buys the whole company just to win her back…",
            receipt: "read",
          },
          {
            type: "video",
            title: "Trailer · Episode 1 teaser",
            body: "15s cliffhanger clip · auto-play muted",
          },
          {
            type: "bot",
            text: "Tap below to watch *Episode 1 for free* 👇",
            receipt: "read",
          },
        ],
        choices: [
          { label: "Watch Episode 1 free", next: 1, userText: "I want to watch Episode 1 free" },
        ],
      },
      {
        messages: [
          {
            type: "bot",
            text: "Opening Episode 1…\nhttps://app.reelnest.demo/watch/ep1\n\n🎁 New-user gift: *50 coins* unlocked after you finish Ep1.",
            receipt: "read",
          },
          { type: "system", text: "Outcome · First watch started · activation pixel fired" },
        ],
        choices: [],
        complete: true,
      },
    ],
  },

  {
    id: "cliffhanger",
    group: "drama",
    badge: "短剧 · 留存",
    title: "悬念召回 Cliffhanger",
    subtitle: "第10集流失 → 12/24h → 悬念视频 → 回归",
    goal: "对撞墙前流失用户，用第 11 集高能片段制造好奇心，驱动回 App 继续追剧。",
    outcome: "用户点击观看第 11 集；D1/D7 留存与人均观看集数提升。",
    steps: ["第10集流失", "冷静等待", "悬念视频", "继续追剧"],
    events: [
      { time: "T-0", title: "Ep10 completed", desc: "免费集结束 · 未进入付费", state: "done" },
      { time: "T+12h", title: "Wait window", desc: "避免打扰 · 观察自然回流", state: "done" },
      { time: "Now", title: "Cliffhanger template", desc: "Utility/Marketing 悬念视频", state: "active" },
      { time: "转化", title: "Resume watch", desc: "跳转 Ep11 播放", state: "pending" },
    ],
    persona: {
      name: "Bruno Silva",
      initials: "BS",
      meta: "BR · WhatsApp +55 11 ••• 8821",
      info: [
        ["行为", "看完 Ep10 · 未付费"],
        ["沉默", "14h"],
        ["偏好", "复仇 / 豪门"],
        ["风险", "撞墙流失"],
      ],
      tags: ["Cliffhanger", "留存", "行为触发"],
      insights: [
        "短剧洞察：行为触发比节日群发更有效。",
        "Utility 类追剧提醒送达/阅读率通常高于纯营销广播。",
      ],
      agentHint: "12–24h 窗口发送悬念片，CTA 直达 Ep11。",
    },
    script: [
      {
        messages: [
          { type: "day", text: "TODAY" },
          { type: "system", text: "Behavioral trigger · Ep10 finished · no paywall convert" },
          {
            type: "bot",
            text: "😱 He just found the truth…\nAnna's secret can't stay hidden. Episode 11 flips everything — you won't guess the villain.",
            receipt: "read",
          },
          {
            type: "video",
            title: "Episode 11 · 12s suspense cut",
            body: "Cliffhanger only · no full spoilers",
          },
        ],
        choices: [
          { label: "Watch Episode 11", next: 1, userText: "Show me Episode 11 now" },
          { label: "Remind me tonight", next: 2, userText: "Remind me tonight" },
        ],
      },
      {
        messages: [
          {
            type: "bot",
            text: "Jump back in 👇\nhttps://app.reelnest.demo/watch/ep11\nYour progress is saved at Ep10.",
            receipt: "read",
          },
          { type: "system", text: "Outcome · Resume watch · retention event" },
        ],
        choices: [],
        complete: true,
      },
      {
        messages: [
          {
            type: "bot",
            text: "Got it ✅ I'll ping you at 20:00 local with the Episode 11 clip.",
            receipt: "read",
          },
          { type: "system", text: "Outcome · Reminder scheduled" },
        ],
        choices: [],
        complete: true,
      },
    ],
  },

  {
    id: "paywall",
    group: "drama",
    badge: "短剧 · 变现",
    title: "付费墙挽回",
    subtitle: "撞墙退出 → 30min → 限时特惠 → 首充",
    goal: "支付页停留后流失用户，用限时金币包优惠完成 First Deposit。",
    outcome: "用户领取 6 折特惠并完成首充；付费墙转化事件回传。",
    steps: ["撞墙退出", "冷静 30min", "限时特惠", "首充成功"],
    events: [
      { time: "T-0", title: "Paywall exit", desc: "支付页停留 >5s 未付", state: "done" },
      { time: "T+30m", title: "Offer template", desc: "限时闪购 Marketing", state: "active" },
      { time: "转化", title: "First deposit", desc: "$2.99 / 500 coins", state: "pending" },
    ],
    persona: {
      name: "Mia Chen",
      initials: "MC",
      meta: "MY · WhatsApp +60 12 ••• 3098",
      info: [
        ["卡点", "Ep11 付费墙"],
        ["意图", "高 · 已看完免费集"],
        ["客单", "首充敏感"],
        ["时区", "GMT+8"],
      ],
      tags: ["付费墙", "首充", "限时优惠"],
      insights: [
        "冷静期避免打扰，同时制造紧迫感。",
        "深链直达支付，减少二次流失。",
      ],
      agentHint: "一次性优惠 + 支付链；勿连续轰炸。",
    },
    script: [
      {
        messages: [
          { type: "day", text: "TODAY" },
          { type: "system", text: "Paywall abandon · 30m delay elapsed" },
          {
            type: "bot",
            text: "⚡ *Flash deal · 1 hour left*\nDon't leave Anna alone… You're stuck on Episode 11 — the truth is about to drop.\n\nGet *500 coins for $2.99* (was $4.99).",
            receipt: "read",
          },
        ],
        choices: [
          { label: "Claim 40% off", next: 1, userText: "I want the 40% off coin pack" },
        ],
      },
      {
        messages: [
          {
            type: "bot",
            text: "Secure checkout 👇\nhttps://pay.reelnest.demo/first-deposit/MC992\nCoins unlock Episode 11–20 instantly after payment.",
            receipt: "read",
          },
          { type: "system", text: "Payment success · First Deposit $2.99" },
          {
            type: "bot",
            text: "✅ 500 coins added. Continue Episode 11 now:\nhttps://app.reelnest.demo/watch/ep11",
            receipt: "read",
          },
        ],
        choices: [],
        complete: true,
      },
    ],
  },

  {
    id: "welcome_pack",
    group: "retain",
    badge: "短剧 · 速赢",
    title: "新用户欢迎礼包",
    subtitle: "下载后未观看 → 礼包 + 追剧引导",
    goal: "安装未观看用户，用欢迎礼包与精选剧单完成冷启动。",
    outcome: "用户领取礼包并开始观看；安装→首看转化提升。",
    steps: ["下载未看", "欢迎礼包", "剧单推荐", "开始观看"],
    events: [
      { time: "D0", title: "App install", desc: "未产生观看事件", state: "done" },
      { time: "D0+2h", title: "Welcome utility", desc: "礼包 + 剧单", state: "active" },
      { time: "转化", title: "First session", desc: "开始观看", state: "pending" },
    ],
    persona: {
      name: "Omar Hassan",
      initials: "OH",
      meta: "AE · WhatsApp +971 5•••2201",
      info: [["状态", "已安装未观看"], ["来源", "FB App Install"], ["语言", "EN / AR"]],
      tags: ["欢迎礼包", "冷启动"],
      insights: ["下载后 2h 内触达最佳。"],
      agentHint: "礼包 + 1 部热剧即可，避免信息过载。",
    },
    script: [
      {
        messages: [
          { type: "day", text: "TODAY" },
          {
            type: "bot",
            text: "Welcome aboard 🎁 Your *starter pack* is ready:\n• 30 coins\n• 1 exclusive trailer\n\nPick a binge for tonight:",
            receipt: "read",
          },
          {
            type: "list",
            title: "Tonight's picks",
            body: "1) CEO's Secret Contract\n2) Revenge in Silk\n3) Married by Mistake",
            button: "Choose a drama",
          },
        ],
        choices: [
          { label: "CEO's Secret Contract", next: 1, userText: "Play CEO's Secret Contract" },
        ],
      },
      {
        messages: [
          {
            type: "bot",
            text: "Great pick. Gift applied ✅\nhttps://app.reelnest.demo/watch/ceo-ep1",
            receipt: "read",
          },
          { type: "system", text: "Outcome · Cold start converted" },
        ],
        choices: [],
        complete: true,
      },
    ],
  },

  {
    id: "coins_low",
    group: "retain",
    badge: "短剧 · Utility",
    title: "金币不足续充",
    subtitle: "余额不足 → Utility 提醒 → 续充解锁",
    goal: "追剧中金币耗尽时发送高期待 Utility 提醒，驱动续充。",
    outcome: "用户完成续充并继续观看；Utility 高阅读率支撑变现。",
    steps: ["余额不足", "Utility 提醒", "续充套餐", "解锁续看"],
    events: [
      { time: "T-0", title: "Coins = 0", desc: "Ep14 中断", state: "done" },
      { time: "T+5m", title: "Utility notice", desc: "余额不足提醒", state: "active" },
      { time: "转化", title: "Top-up", desc: "购买金币包", state: "pending" },
    ],
    persona: {
      name: "Sofia Alvarez",
      initials: "SA",
      meta: "MX · WhatsApp +52 55 ••• 7710",
      info: [["进度", "Ep14 / 60"], ["余额", "0 coins"], ["LTV", "已首充用户"]],
      tags: ["Utility", "续充", "粘性"],
      insights: ["金币不足属用户期待信息，送达/阅读率接近 Utility 上限。"],
      agentHint: "先提醒进度损失，再给套餐。",
    },
    script: [
      {
        messages: [
          { type: "day", text: "TODAY" },
          {
            type: "bot",
            text: "You're on *Episode 14* — coins ran out mid-twist 😮\nTop up to keep watching without losing your place.",
            receipt: "read",
          },
          {
            type: "list",
            title: "Coin packs",
            body: "1) 300 coins · $1.99\n2) 800 coins · $4.49 (Best)\n3) VIP weekly unlock",
            button: "Choose pack",
          },
        ],
        choices: [
          { label: "Buy 800 coins", next: 1, userText: "Buy the 800 coin pack" },
        ],
      },
      {
        messages: [
          {
            type: "bot",
            text: "Payment link:\nhttps://pay.reelnest.demo/topup/800\nResume Episode 14 after success.",
            receipt: "read",
          },
          { type: "system", text: "Outcome · Top-up success · resume watch" },
        ],
        choices: [],
        complete: true,
      },
    ],
  },

  {
    id: "vip_renew",
    group: "retain",
    badge: "短剧 · VIP",
    title: "VIP 到期续订",
    subtitle: "到期前 → 权益提醒 → 续订 / 降级挽留",
    goal: "VIP 到期前触达，用权益清单与限时续订完成留存。",
    outcome: "用户续订 VIP；ARPPU / 会员登录率提升。",
    steps: ["到期预警", "权益回顾", "续订优惠", "续订成功"],
    events: [
      { time: "T-3d", title: "VIP expiring", desc: "会员还剩 3 天", state: "done" },
      { time: "T-1d", title: "Renewal offer", desc: "Marketing 续订", state: "active" },
      { time: "转化", title: "VIP renewed", desc: "月卡续订", state: "pending" },
    ],
    persona: {
      name: "Priya Nair",
      initials: "PN",
      meta: "IN · WhatsApp +91 98•••4410",
      info: [["会员", "VIP Monthly"], ["到期", "明天"], ["观看", "高活跃"]],
      tags: ["VIP", "续订", "LTV"],
      insights: ["目标对齐：提升会员登录率与 LTV/ARPU。"],
      agentHint: "强调免广告 + 抢先看更新。",
    },
    script: [
      {
        messages: [
          { type: "day", text: "TODAY" },
          {
            type: "bot",
            text: "Your *VIP* ends tomorrow.\nKeep:\n• Ad-free binge\n• Early episode access\n• Weekly coin bonus\n\nRenew now: *20% off* for 24h.",
            receipt: "read",
          },
        ],
        choices: [
          { label: "Renew VIP 20% off", next: 1, userText: "Renew my VIP with 20% off" },
        ],
      },
      {
        messages: [
          {
            type: "bot",
            text: "Renewal checkout:\nhttps://pay.reelnest.demo/vip/renew\nThanks for staying with ReelNest 💜",
            receipt: "read",
          },
          { type: "system", text: "Outcome · VIP renewed" },
        ],
        choices: [],
        complete: true,
      },
    ],
  },

  {
    id: "live_remind",
    group: "live",
    badge: "直播 · 提醒",
    title: "开播提醒",
    subtitle: "预约用户 → Utility 开播 → 一键进房",
    goal: "对预约直播的用户发送开播 Utility，拉高进房率与峰值在线。",
    outcome: "用户一键进入 Meta Live / 卖场直播间；进房事件回传。",
    steps: ["预约成功", "开播前预热", "开播提醒", "进房观看"],
    events: [
      { time: "D-1", title: "RSVP saved", desc: "用户预约今晚直播", state: "done" },
      { time: "T-15m", title: "Warm-up", desc: "预告爆款清单", state: "done" },
      { time: "T-0", title: "Live now", desc: "Utility 开播提醒", state: "active" },
      { time: "转化", title: "Joined room", desc: "进房成功", state: "pending" },
    ],
    persona: {
      name: "Elena Rossi",
      initials: "ER",
      meta: "IT · WhatsApp +39 33 ••• 1902",
      info: [["兴趣", "美妆闪购"], ["预约", "今晚 21:00"], ["来源", "IG Live CTA"]],
      tags: ["开播提醒", "Meta Live", "Utility"],
      insights: ["开播提醒属高期待 Utility，打开率显著高于群发营销。"],
      agentHint: "开播瞬间发送，CTA 直达直播间。",
    },
    script: [
      {
        messages: [
          { type: "day", text: "TODAY" },
          {
            type: "bot",
            text: "🔴 *LIVE NOW*\nFlash beauty drop starts in the room — 3 SKUs with live-only prices.\nTap to join 👇",
            receipt: "read",
          },
        ],
        choices: [
          { label: "Join Live room", next: 1, userText: "Join the live room" },
        ],
      },
      {
        messages: [
          {
            type: "bot",
            text: "Opening LivePulse room…\nhttps://live.livepulse.demo/room/beauty-2100\nPin the chat for tonight's coupon code.",
            receipt: "read",
          },
          { type: "system", text: "Outcome · Joined live · room enter event" },
        ],
        choices: [],
        complete: true,
      },
    ],
  },

  {
    id: "live_flash",
    group: "live",
    badge: "直播 · 成交",
    title: "直播闪购成交",
    subtitle: "讲解中询价 → Catalog/支付 → 限时锁单",
    goal: "直播中高意向询单，用 Catalog + 限时支付链在会话内关单。",
    outcome: "用户完成闪购支付；直播 GMV 与消息订单归因打通。",
    steps: ["直播询价", "商品卡", "限时支付", "成交回传"],
    events: [
      { time: "Live", title: "Product ask", desc: "用户问色号 / 库存", state: "done" },
      { time: "T+20s", title: "Catalog card", desc: "会话内商品卡", state: "active" },
      { time: "T+2m", title: "Paid", desc: "闪购成交", state: "pending" },
    ],
    persona: {
      name: "Nina Park",
      initials: "NP",
      meta: "KR→US · WhatsApp +1 213 ••• 4408",
      info: [["场景", "美妆 Live"], ["意向 SKU", "Serum Rose 30ml"], ["顾虑", "色号 / 运费"]],
      tags: ["闪购", "Catalog", "直播成交"],
      insights: ["直播高峰靠自动化应答保住询单。"],
      agentHint: "15 分钟锁库存 + 支付链。",
    },
    script: [
      {
        messages: [
          { type: "day", text: "TODAY" },
          { type: "system", text: "Live chat ask · Serum Rose" },
          {
            type: "bot",
            text: "Yes — *Serum Rose 30ml* is on live price *$29* (was $42).\nShipping to US: 5–8 days · free over $45.",
            receipt: "read",
          },
          {
            type: "product",
            title: "Serum Rose 30ml · Live deal",
            body: "$29 · 15-min hold available",
            button: "Buy now",
          },
        ],
        choices: [
          { label: "Hold 15 min + pay", next: 1, userText: "Hold it 15 minutes and send pay link" },
        ],
      },
      {
        messages: [
          {
            type: "bot",
            text: "Held ✅ expires in 15:00\nPay here: https://pay.livepulse.demo/LP-8831",
            receipt: "read",
          },
          { type: "system", text: "Payment success · Live order LP-8831" },
          {
            type: "bot",
            text: "Order confirmed. We'll send tracking on WhatsApp when it ships.",
            receipt: "read",
          },
        ],
        choices: [],
        complete: true,
      },
    ],
  },

  {
    id: "live_replay",
    group: "live",
    badge: "直播 · 召回",
    title: "错过直播回放转化",
    subtitle: "未进房 → 回放切片 → 补单优惠",
    goal: "对预约但未进房用户发送回放精华与补单券，挽回 GMV。",
    outcome: "用户观看回放并完成补单；降低直播流量浪费。",
    steps: ["未进房", "回放切片", "补单券", "成交"],
    events: [
      { time: "T+1h", title: "Missed live", desc: "RSVP 但未进房", state: "done" },
      { time: "T+2h", title: "Replay clip", desc: "Marketing 回放", state: "active" },
      { time: "转化", title: "Catch-up order", desc: "补单成功", state: "pending" },
    ],
    persona: {
      name: "Daniel Okoro",
      initials: "DO",
      meta: "NG · WhatsApp +234 80 ••• 5521",
      info: [["状态", "预约未进房"], ["兴趣", "数码配件"], ["时区", "WAT"]],
      tags: ["回放", "补单", "召回"],
      insights: ["回放+限时券可回收 10–20% 错过流量。"],
      agentHint: "突出 live-only 价仍保留 2 小时。",
    },
    script: [
      {
        messages: [
          { type: "day", text: "TODAY" },
          {
            type: "bot",
            text: "You missed tonight's live — here's the *2-min best moments* + the same live price for 2 more hours.",
            receipt: "read",
          },
          {
            type: "video",
            title: "Replay highlights",
            body: "Top 3 deals from the show",
          },
        ],
        choices: [
          { label: "Shop live prices", next: 1, userText: "Show me the live prices" },
        ],
      },
      {
        messages: [
          {
            type: "bot",
            text: "Catch-up link (2h):\nhttps://shop.livepulse.demo/replay/deals\nCode *MISSED10* auto-applied.",
            receipt: "read",
          },
          { type: "system", text: "Outcome · Replay convert" },
        ],
        choices: [],
        complete: true,
      },
    ],
  },
];
