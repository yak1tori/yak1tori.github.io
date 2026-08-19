

const DISCORD_USER_ID = "1494573930009071656";
const LANYARD_URL = "https://api.lanyard.rest/v1/users/" + DISCORD_USER_ID;

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmtN = n => Math.floor(n).toLocaleString("ru-RU").replace(/,/g, " ");

const LOADER_TIMES = {
  i: 1.48,
  am: 2.42,
  iAmOut: 3.20,
  ya: 3.33,
  k1: 3.63,
  tori: 4.24,
  reveal: 4.24
};
let experienceStarted = false;
let dropLocked = false;

setTimeout(() => {
  const l = document.getElementById("loader");
  if (l && l.parentNode && !experienceStarted) {
    l.style.opacity = "0";
    l.style.pointerEvents = "none";
    setTimeout(() => l.remove(), 400);
  }
}, 6000);

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
try {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
} catch (e) {
}
const SY = () => (lenis ? lenis.scroll : 0) || window.scrollY || 0;

(function views() {
  const KEY = "yk_views";
  let v = parseInt(localStorage.getItem(KEY) || "0", 10);
  if (isNaN(v)) v = 0;
  v += 1;
  localStorage.setItem(KEY, String(v));
  const el = $("#viewsCount");
  if (el) el.textContent = fmtN(v);
})();

function heroIntro() {
  const D = 0.85;
  const tl = gsap.timeline();
  tl.from(".hero-inner", { scale: 0.88, duration: 1, ease: "power3.out", overwrite: "auto", clearProps: "scale" }, 0)
    .from(".nav", { y: -30, scale: 0.9, opacity: 0, duration: D, ease: "back.out(1.7)", overwrite: "auto", clearProps: "transform,opacity" }, 0)
    .from(".hero-badges .badge", {
      y: 46, scale: 0.5, opacity: 0, duration: D,
      stagger: 0.05, ease: "back.out(2)", overwrite: "auto", clearProps: "transform,opacity"
    }, 0.05)
    .from(".hero-title .t-char", {
      yPercent: 140, scale: 0.45, opacity: 0, duration: 0.95, ease: "back.out(1.5)",
      stagger: 0.04, clearProps: "transform,opacity"
    }, 0.08)
    .from(".hero-quote", { y: 44, scale: 0.6, opacity: 0, duration: D, ease: "back.out(1.9)", overwrite: "auto", clearProps: "transform,opacity" }, 0.12)
    .from(".dc", { y: 55, scale: 0.55, opacity: 0, duration: D, ease: "back.out(2)", overwrite: "auto", clearProps: "transform,opacity" }, 0.15)
    .from(".hero-cta .btn", {
      y: 48, scale: 0.5, opacity: 0, duration: D, stagger: 0.06,
      ease: "back.out(2)", overwrite: "auto", clearProps: "transform,opacity"
    }, 0.18)
    .from(".hero-scrollhint", { opacity: 0, duration: 0.8, overwrite: "auto", clearProps: "opacity" }, 0.3);
  dropLocked = true;
  setTimeout(() => { dropLocked = false; }, 2400);
}

function beginExperience() {
  if (experienceStarted) return;
  experienceStarted = true;
  const loader = $("#loader");
  if (!loader) return;
  if (REDUCED) {
    loader.remove();
    return;
  }

  const T = LOADER_TIMES;
  loader.style.pointerEvents = "none";
  gsap.set(".w", { opacity: 0, y: 16 });
  const tl = gsap.timeline();
  tl.to(".w-i", { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, T.i)
    .to(".w-am", { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, T.am)
    .to(".lyr-iAm", { opacity: 0, y: -10, duration: 0.08, ease: "power2.in" }, T.iAmOut)
    .to(".w-ya", { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, T.ya)
    .to(".w-k1", { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, T.k1)
    .to(".w-tori", { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, T.tori)
    .to(".w-tori", { opacity: 0, filter: "blur(10px)", duration: 1.15, ease: "power2.inOut" }, T.reveal + 0.35)
    .to(".w-ya, .w-k1", { opacity: 0, duration: 0.55, ease: "power1.out" }, T.reveal + 0.4)
    .to(loader, {
      opacity: 0, duration: 1.35, ease: "power2.inOut",
      onComplete: () => loader.remove()
    }, T.reveal);
  tl.add(heroIntro, T.reveal);
}

(function cursor() {
  if (REDUCED || window.matchMedia("(hover: none)").matches) return;
  const dot = $(".cursor-dot");
  const ring = $(".cursor-ring");
  let mx = -100, my = -100, rx = -100, ry = -100;

  window.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    const t = e.target.closest("a,button,[data-cursor-grow],.s-card,.badge,.p-bar");
    ring.classList.toggle("grow", !!t);
  });

  (function loop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();

  document.addEventListener("mouseleave", () => {
    dot.style.opacity = ring.style.opacity = 0;
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = ring.style.opacity = 1;
  });
})();

(function magnetic() {
  if (window.matchMedia("(hover: none)").matches) return;
  $$("[data-magnetic]").forEach(el => {
    el.addEventListener("mousemove", e => {
      if (dropLocked) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.28;
      const dy = (e.clientY - r.top - r.height / 2) * 0.28;
      gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.45)" });
    });
  });
})();

(function nav() {
  const nav = $("#nav");
  const btt = $("#btt");
  const onScroll = () => {
    const y = SY();
    nav.classList.toggle("scrolled", y > 40);
    btt.classList.toggle("show", y > 640);
  };
  onScroll();
  if (lenis) lenis.on("scroll", onScroll);
  else addEventListener("scroll", onScroll, { passive: true });
  btt.addEventListener("click", () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

$$("[data-lenis]").forEach(a => {
  a.addEventListener("click", e => {
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    e.preventDefault();
    const target = $(href);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.4 });
    else target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

(function stars() {
  const cv = $("#stars");
  const ctx = cv.getContext("2d");
  let W, H, stars = [];
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  const resize = () => {
    W = cv.width = innerWidth * DPR;
    H = cv.height = innerHeight * DPR;
    cv.style.width = innerWidth + "px";
    cv.style.height = innerHeight + "px";
    const n = Math.min(150, Math.floor(innerWidth / 11));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: (Math.random() * 1.1 + 0.3) * DPR,
      a: Math.random() * 0.7 + 0.3,
      s: Math.random() * 0.025 + 0.005,
      p: Math.random() * Math.PI * 2
    }));
  };
  resize();
  addEventListener("resize", resize);

  let t = 0;
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.016;
    const scroll = SY() * DPR * 0.22;
    for (const st of stars) {
      const alpha = REDUCED ? st.a : st.a * (0.55 + 0.45 * Math.sin(t * st.s * 60 + st.p));
      ctx.beginPath();
      ctx.arc(st.x, (st.y - scroll % H + H) % H, st.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + alpha.toFixed(3) + ")";
      ctx.fill();
    }
    requestAnimationFrame(draw);
  })();
})();

(function moon() {
  const wrap = $(".bg-moon-wrap");
  if (!wrap) return;
  gsap.to(wrap, { y: -24, duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to(wrap, {
    yPercent: 55, opacity: 0.55, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });
})();

(function trees() {
  const layers = [
    [".bg-trees-far", 10],
    [".bg-trees-mid", 22],
    [".bg-trees-near", 38]
  ];
  layers.forEach(([sel, amt]) => {
    const el = $(sel);
    if (!el) return;
    gsap.to(el, {
      y: () => innerHeight * amt / 100 * 0.45,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
      }
    });
  });
})();

(function heroParallax() {
  gsap.to(".hero-inner", {
    yPercent: -16, opacity: 0.25, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });
  gsap.to(".hero-title .t-char", {
    yPercent: 40, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });
})();

(function heroTilt() {
  if (window.matchMedia("(hover: none)").matches) return;
  const hero = $(".hero-inner");
  if (!hero) return;
  window.addEventListener("mousemove", e => {
    const x = e.clientX / innerWidth - 0.5;
    const y = e.clientY / innerHeight - 0.5;
    gsap.to(hero, {
      rotateY: x * 4, rotateX: -y * 4, transformPerspective: 1200,
      duration: 0.7, ease: "power2.out"
    });
  });
  window.addEventListener("mouseleave", () => {
    gsap.to(hero, { rotateY: 0, rotateX: 0, duration: 0.9, ease: "power3.out" });
  });
})();

$$("[data-reveal]").forEach(el => {
  gsap.fromTo(el,
    { y: 70, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 1.05, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 84%" }
    });
});

(function socials() {
  const grid = $("#socialGrid");
  if (!grid) return;
  gsap.fromTo($$(".s-card", grid),
    { y: 90, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.09,
      scrollTrigger: { trigger: grid, start: "top 78%" }
    });
})();

$$(".count").forEach(el => {
  const target = +el.dataset.count;
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target, duration: 1.8, ease: "power2.out",
    scrollTrigger: { trigger: el, start: "top 88%" },
    onUpdate: () => { el.textContent = Math.round(obj.v); }
  });
});

(function scene() {
  const stage = $("#sceneStage");
  const ring = $("#sceneRing");
  if (!stage || REDUCED) return;

  gsap.timeline({
    scrollTrigger: {
      trigger: ".scene-section",
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  })
  .fromTo(stage, { scale: 1.22, rotate: 3.5, y: 110 }, { scale: 1, rotate: 0, y: 0, ease: "none" }, 0)
  .fromTo(ring, { rotate: 0 }, { rotate: 200, ease: "none" }, 0)
  .fromTo(".scene-meta", { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: "none" }, 0.15);
})();

(function discord() {
  if (DISCORD_USER_ID === "DISCORD_USER_ID") {
    $("#dcStatusText").textContent = "discord не настроен";
    $("#sceneActivity").textContent = "discord не настроен";
    $("#sceneSub").textContent = "оффлайн";
    return;
  }
  const STATUS_TXT = { online: "online", idle: "idle", dnd: "do not disturb", offline: "offline" };
  const STATUS_CLS = { online: "on", idle: "idle", dnd: "dnd", offline: "off" };
  const LS_LAST = "yk_lastOnline";

  const setStatus = (st) => {
    const cls = STATUS_CLS[st] || "off";
    document.documentElement.dataset.status = st || "offline";
    $("#dcStatusDot").className = "dc-statusdot " + cls;
    $("#heroDot").className = "dot dot--" + cls;
    const nd = $(".nav-dc .dot");
    if (nd) nd.className = "dot dot--" + cls;

    let txt = STATUS_TXT[st] || st;
    if (st !== "offline") {
      localStorage.setItem(LS_LAST, String(Date.now()));
    } else {
      const last = parseInt(localStorage.getItem(LS_LAST) || "0", 10);
      txt = "offline · был(а) в сети " + (last ? timeAgo(last) : "давно");
    }
    $("#dcStatusText").textContent = txt;
    $("#heroStatus").textContent = txt;
  };

  const timeAgo = (ts) => {
    const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
    if (s < 60) return "только что";
    const m = Math.floor(s / 60);
    if (m < 60) return m + " мин назад";
    const h = Math.floor(m / 60);
    if (h < 24) return h + " ч назад";
    const d = Math.floor(h / 24);
    return d + " дн назад";
  };

  const actInfo = (data) => {
    const acts = data.activities || [];
    const custom = acts.find(a => a.type === 4 && a.state);
    const game = acts.find(a => (a.type === 0 || a.type === 1 || a.type === 3) && a.name);
    const spotify = data.listening_to_spotify;
    if (custom) return { icon: "✧", text: custom.state.trim(), big: custom.state.trim() };
    if (spotify) return { icon: "♪", text: "слушает " + spotify.song + " — " + spotify.artist, big: spotify.song, sub: spotify.artist, art: spotify.album_art_url };
    if (game) {
      const sub = game.details || game.state || "";
      return { icon: "▶", text: "играет в " + game.name + (sub ? " · " + sub : ""), big: game.name, sub };
    }
    return null;
  };

  const render = (data) => {
    const u = data.discord_user;
    if (u) {
      const name = u.global_name || u.username || "yak1tori";
      const tag = "@" + (u.username || "yak1tori");
      $("#dcName").textContent = name;
      $("#dcTag").textContent = tag;
      if (u.avatar) {
        const ext = u.avatar.startsWith("a_") ? "gif" : "png";
        const url = "https://cdn.discordapp.com/avatars/" + DISCORD_USER_ID + "/" + u.avatar + "." + ext;
        $("#dcAvatar").src = url;
        $("#sceneAvatar").src = url;
      }
    }
    setStatus(data.discord_status || "offline");

    const act = actInfo(data);
    const actEl = $("#dcActivity");
    if (act) {
      actEl.innerHTML = "";
      const ic = document.createElement("span");
      ic.className = "act-icon";
      ic.textContent = act.icon;
      const tx = document.createElement("span");
      tx.textContent = act.text;
      actEl.append(ic, tx);
      $("#sceneActivity").textContent = act.big;
      $("#sceneSub").textContent = act.sub || (data.discord_status === "offline" ? "offline" : STATUS_TXT[data.discord_status]);
    } else {
      actEl.textContent = "";
      $("#sceneActivity").textContent = "nothing… yet";
      $("#sceneSub").textContent = "пока ничего не запущено";
    }
  };

  const poll = () => {
    fetch(LANYARD_URL)
      .then(r => r.json())
      .then(j => {
        if (j.success && j.data) {
          render(j.data);
        } else {
          const msg = "discord не подключён — открой lanyard.nekos.im";
          $("#dcStatusText").textContent = msg;
          $("#heroStatus").textContent = msg;
          $("#sceneActivity").textContent = "discord не подключён";
          $("#sceneSub").textContent = "зайди на lanyard.nekos.im и подключи аккаунт";
          $("#dcStatusDot").className = "dc-statusdot off";
          $("#heroDot").className = "dot dot--off";
        }
      })
      .catch(() => {});
  };
  poll();
  setInterval(poll, 45000);
})();

(function player() {
  const audio = new Audio();
  audio.preload = "metadata";
  const LS_VOL = "yk_vol";
  audio.volume = parseFloat(localStorage.getItem(LS_VOL) || "0.8");
  $("#pVol").value = audio.volume;
  $("#fsVol").value = audio.volume;

  const playBtn = $("#pPlay");
  const prevBtn = $("#pPrev");
  const nextBtn = $("#pNext");
  const bar = $("#pBar");
  const fill = $("#pFill");
  const curEl = $("#pCur");
  const durEl = $("#pDur");
  const pTitle = $("#pTitle");
  const pArtist = $("#pArtist");
  const cover = $("#pCoverImg");
  const bgPhoto = $(".bg-photo");
  const fs = $("#fs");
  const fsTitle = $("#fsTitle");
  const fsArtist = $("#fsArtist");
  const fsCover = $("#fsCover");
  const fsCur = $("#fsCur");
  const fsDur = $("#fsDur");
  const fsFill = $("#fsFill");
  const fsBar = $("#fsBar");
  const fsVol = $("#fsVol");
  const fsClose = $("#fsClose");
  const fsPlay = $("#fsPlay");
  const fsPrev = $("#fsPrev");
  const fsNext = $("#fsNext");

  const fmt = s => {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return m + ":" + String(sec).padStart(2, "0");
  };

  let queue = [];
  let pos = 0;
  let wasPlaying = false;
  let readyResolve;
  const queueReady = new Promise(r => { readyResolve = r; });
  let bassApi = null;

  
  let bassEl = null;
  let bassWired = false;

  function initBass() {
    if (bassApi) return bassApi;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const src = ctx.createMediaElementSource(audio);
      const mainGain = ctx.createGain();
      mainGain.gain.value = 1;
      src.connect(mainGain);
      mainGain.connect(ctx.destination);

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.72;
      const bin = analyser.frequencyBinCount;
      const freq = new Uint8Array(bin);
      const targets = [
        [".hero-cta", 0.15, 0.02],
        [".dc", 0.1, 0],
        [".stats", 0.06, 0],
        [".social-grid", 0.05, 0],
        [".player", 0.04, 0.006],
        [".hero-title", 0.03, 0.01]
      ].map(([sel, amp, breath]) => {
        const el = $(sel);
        return {
          q: el ? gsap.quickTo(el, "scale", { duration: 0.09, ease: "power3.out" }) : null,
          amp, breath
        };
      });
      let pulse = 0, prevFb = 0, t0 = performance.now();
      const loop = () => {
        analyser.getByteFrequencyData(freq);
        let fb = 0;
        for (let i = 0; i < 4; i++) fb += freq[i];
        fb = fb / 4 / 255;
        const env = Math.min(1, Math.max(0, (fb - 0.03) * 5));
        const jump = Math.min(1, Math.max(0, (fb - prevFb) * 6));
        prevFb = fb;
        pulse += (Math.min(1, env * 0.7 + jump * 0.5) - pulse) * 0.55;
        const breathe = 0.5 + 0.5 * Math.sin((performance.now() - t0) * 0.0045);
        for (const t of targets) {
          if (t.q) t.q(1 + t.breath * breathe + t.amp * pulse);
        }
        requestAnimationFrame(loop);
      };
      if (ctx.state === "running") {
        loop();
      } else {
        ctx.resume().then(loop).catch(loop);
      }
      bassApi = { ctx, analyser };
      ensureBassWired();
    } catch (e) {
      bassApi = null;
    }
    return bassApi;
  }

  function ensureBassWired() {
    if (!bassEl || !bassApi || bassWired) return;
    try {
      const bSrc = bassApi.ctx.createMediaElementSource(bassEl);
      const bGain = bassApi.ctx.createGain();
      bGain.gain.value = 0;
      bSrc.connect(bassApi.analyser);
      bassApi.analyser.connect(bGain);
      bGain.connect(bassApi.ctx.destination);
      bassWired = true;
    } catch (e) {
    }
  }

  const bassUrlOf = url => url ? url.replace(/\.\w+$/, "_bass.m4a") : null;

  async function syncBass() {
    const url = bassUrlOf(audio.src);
    if (!url) return;
    try {
      const ok = await exists(url);
      if (!ok) {
        if (bassEl && bassEl.src) { bassEl.pause(); bassEl.removeAttribute("src"); }
        return;
      }
      if (!bassEl) {
        bassEl = new Audio();
        bassEl.preload = "auto";
        ensureBassWired();
      }
      if (bassEl.getAttribute("src") !== url) {
        bassEl.src = url;
        if (!audio.paused) bassEl.play().catch(() => {});
      }
    } catch (e) {
    }
  }

  const setDisabled = (v) => {
    playBtn.disabled = prevBtn.disabled = nextBtn.disabled = v;
  };
  const setEmpty = (broken) => {
    pTitle.textContent = "треки не найдены";
    pArtist.textContent = broken ? "ошибка загрузки треков" : "треки не найдены";
    setDisabled(true);
  };

  async function exists(src) {
    try {
      const r = await fetch(src, { method: "HEAD", cache: "no-store" });
      return r.ok;
    } catch (e) {
      return true;
    }
  }

  async function buildQueue() {
    queue = [];
    for (let i = 0; i < TRACKS.length; i++) {
      if (await exists(TRACKS[i].src)) queue.push(i);
    }
    if (!queue.length) {
      setEmpty();
      readyResolve();
      return;
    }
    setDisabled(false);
    load(0, false);
    readyResolve();
  }

  const setMeta = (i) => {
    const tr = TRACKS[i];
    pTitle.textContent = tr.title;
    pArtist.textContent = tr.artist;
    cover.src = tr.cover;
    fsTitle.textContent = tr.title;
    fsArtist.textContent = tr.artist;
    fsCover.src = tr.cover;
    durEl.textContent = "0:00";
    curEl.textContent = "0:00";
    fsDur.textContent = "0:00";
    fsCur.textContent = "0:00";
    fill.style.width = "0%";
    fsFill.style.width = "0%";
    bgPhoto.style.opacity = "0";
    gsap.fromTo(".p-cover", { rotate: -6, scale: 0.92 }, { rotate: 0, scale: 1, duration: 0.6, ease: "power3.out" });
    gsap.fromTo(".p-meta", { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
  };

  const load = (offset, autoplay) => {
    if (!queue.length) return;
    pos = (pos + offset + queue.length) % queue.length;
    const tr = TRACKS[queue[pos]];
    audio.src = tr.src;
    syncBass();
    setMeta(queue[pos]);
    const g = "linear-gradient(180deg,#0a0b10 0%,#070708 34%,#050505 60%,#000 100%)";
    bgPhoto.style.opacity = "0";
    requestAnimationFrame(() => {
      bgPhoto.style.backgroundImage = `url("${tr.cover}"),${g}`;
      requestAnimationFrame(() => { bgPhoto.style.opacity = "1"; });
    });
    prevBtn.disabled = nextBtn.disabled = queue.length <= 1;
    if (autoplay) audio.play().catch(() => {});
  };

  const setPlaying = (p) => {
    $("#player").classList.toggle("is-playing", p);
    fs.classList.toggle("is-playing", p);
  };

  audio.addEventListener("loadedmetadata", () => {
    durEl.textContent = fmt(audio.duration);
    fsDur.textContent = fmt(audio.duration);
  });
  audio.addEventListener("timeupdate", () => {
    curEl.textContent = fmt(audio.currentTime);
    fsCur.textContent = fmt(audio.currentTime);
    if (audio.duration) {
      const w = (audio.currentTime / audio.duration * 100) + "%";
      fill.style.width = w;
      fsFill.style.width = w;
    }
  });
  audio.addEventListener("play", () => setPlaying(true));
  audio.addEventListener("pause", () => setPlaying(false));
  audio.addEventListener("ended", () => load(1, true));
  audio.addEventListener("error", () => {
    queue = queue.filter(i => TRACKS[i].src !== audio.src);
    if (queue.length) {
      load(0, wasPlaying);
    } else {
      setEmpty();
    }
  });

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      if (bassEl && bassEl.src) bassEl.play().catch(() => {});
    } else {
      audio.pause();
      if (bassEl && bassEl.src) bassEl.pause();
    }
  });
  prevBtn.addEventListener("click", () => {
    wasPlaying = !audio.paused;
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    load(-1, wasPlaying);
  });
  nextBtn.addEventListener("click", () => {
    wasPlaying = !audio.paused;
    load(1, wasPlaying);
  });

  bar.addEventListener("click", e => {
    if (!audio.duration) return;
    const r = bar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });

  $("#pVol").addEventListener("input", e => {
    audio.volume = +e.target.value;
    fsVol.value = e.target.value;
    localStorage.setItem(LS_VOL, e.target.value);
  });

  const syncFs = () => {
    fsTitle.textContent = pTitle.textContent;
    fsArtist.textContent = pArtist.textContent;
    fsCover.src = cover.src;
    fsCur.textContent = curEl.textContent;
    fsDur.textContent = durEl.textContent;
    fsFill.style.width = fill.style.width;
    fsVol.value = audio.volume;
    fs.classList.toggle("is-playing", !audio.paused);
  };
  const openFs = () => {
    syncFs();
    fs.classList.add("open");
    fs.setAttribute("aria-hidden", "false");
    if (lenis) lenis.stop();
    fsClose.focus();
  };
  const closeFs = () => {
    fs.classList.remove("open");
    fs.setAttribute("aria-hidden", "true");
    if (lenis) lenis.start();
  };

  $("#player").addEventListener("click", e => {
    if (e.target.closest(".p-btn,.p-vol,.p-bar")) return;
    openFs();
  });
  fsClose.addEventListener("click", closeFs);
  fs.addEventListener("click", e => {
    if (e.target === fs) closeFs();
  });
  fsPlay.addEventListener("click", () => playBtn.click());
  fsPrev.addEventListener("click", () => prevBtn.click());
  fsNext.addEventListener("click", () => nextBtn.click());
  fsBar.addEventListener("click", e => {
    if (!audio.duration) return;
    const r = fsBar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });
  fsVol.addEventListener("input", e => {
    audio.volume = +e.target.value;
    $("#pVol").value = e.target.value;
    localStorage.setItem(LS_VOL, e.target.value);
  });
  document.addEventListener("keydown", e => {
    if (e.code === "Escape" && fs.classList.contains("open")) closeFs();
  });

  document.addEventListener("keydown", e => {
    if (e.code === "Space" && !/input|textarea/i.test(e.target.tagName)) {
      e.preventDefault();
      playBtn.click();
    }
    if (e.code === "ArrowRight" && e.shiftKey) nextBtn.click();
    if (e.code === "ArrowLeft" && e.shiftKey) prevBtn.click();
  });

  if (typeof TRACKS === "undefined") {
    setEmpty(true);
  } else if (!TRACKS.length) {
    setEmpty(false);
  } else {
    buildQueue();
  }

  window.__player = {
    play: () => queueReady.then(() => {
      if (audio.src && audio.paused) {
        audio.play().catch(() => {});
        if (bassEl && bassEl.src) bassEl.play().catch(() => {});
      }
    }),
    initBass
  };
})();

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
  setTimeout(() => ScrollTrigger.refresh(), 800);
});

const PH_AVATAR = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>" +
  "<defs><radialGradient id='g' cx='35%' cy='28%'><stop offset='0' stop-color='#3a3a40'/><stop offset='1' stop-color='#0c0c0e'/></radialGradient></defs>" +
  "<rect width='256' height='256' rx='128' fill='url(#g)'/>" +
  "<text x='128' y='166' font-family='Arial Black,Arial' font-size='110' font-weight='900' fill='rgba(255,255,255,.85)' text-anchor='middle'>y</text></svg>");
const PH_COVER = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>" +
  "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#2a2a30'/><stop offset='1' stop-color='#08080a'/></linearGradient></defs>" +
  "<rect width='256' height='256' fill='url(#g)'/>" +
  "<text x='128' y='160' font-family='Arial Black,Arial' font-size='90' font-weight='900' fill='rgba(255,255,255,.8)' text-anchor='middle'>♪</text></svg>");

$("#dcAvatar").onerror = () => { $("#dcAvatar").src = PH_AVATAR; };
$("#sceneAvatar").onerror = () => { $("#sceneAvatar").src = PH_AVATAR; };

(function theme() {
  const btn = $("#themeBtn");
  const apply = t => document.documentElement.classList.toggle("light", t === "light");
  apply(localStorage.getItem("yk_theme") || "dark");
  btn.addEventListener("click", () => {
    const light = !document.documentElement.classList.contains("light");
    apply(light ? "light" : "dark");
    localStorage.setItem("yk_theme", light ? "light" : "dark");
  });
})();

(function boot() {
  const btn = $("#startBtn");
  const P = window.__player;
  if (!btn) {
    if (P) P.play();
    beginExperience();
    return;
  }
  btn.addEventListener("click", () => {
    if (P) {
      P.initBass();
      P.play();
    }
    beginExperience();
    gsap.to(btn, {
      opacity: 0, y: 16, duration: 0.45, ease: "power2.out",
      onComplete: () => btn.remove()
    });
  });
})();
$("#pCoverImg").onerror = () => { $("#pCoverImg").src = PH_COVER; };
