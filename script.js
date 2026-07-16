// ============================================================
// Zenex Knowledge Hub — demo prototype behaviour
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- inject real site assets (logo, photos) if available ----
  if (window.ZENEX_ASSETS) {
    document.querySelectorAll('.js-logo').forEach(img => img.src = ZENEX_ASSETS.logo);
    document.querySelectorAll('[data-bg]').forEach(el => {
      const key = el.dataset.bg;
      if (ZENEX_ASSETS[key]) el.style.backgroundImage = `url(${ZENEX_ASSETS[key]})`;
    });
    document.querySelectorAll('[data-src]').forEach(img => {
      const key = img.dataset.src;
      if (ZENEX_ASSETS[key]) img.src = ZENEX_ASSETS[key];
    });
  }

  // ---- mega menu (click-to-toggle on touch/mobile, hover on desktop via CSS) ----
  document.querySelectorAll('.nav-item > a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 840) {
        e.preventDefault();
        const item = link.closest('.nav-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      }
    });
  });

  // ---- split hero: carousel-synced text + image, word-stagger entrance ----
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hsHeadline = document.getElementById('hs-headline');
  if (hsHeadline) {
    const heroSplitData = [
      {
        eyebrow: 'Independent grant-maker · Est. 1995',
        headline: 'Three decades of evidence that changed how South Africa teaches reading and maths.',
        paragraph: 'The Zenex Foundation invests in evidence-led programmes that strengthen language and mathematics teaching from Grade R to Grade 6 — and shares what we learn so others can use it.',
        btn1: 'View Strategy 2030 →', btn1href: '#',
        btn2: 'Explore the Knowledge Hub', btn2href: 'knowledge-hub.html',
        badgeNum: '30', badgeLabel: 'Years reading, connecting<br>and learning in education',
      },
      {
        eyebrow: 'Evidence-led grant-making',
        headline: 'Built on evidence, not assumptions about what South African classrooms need.',
        paragraph: 'Every programme we fund starts with research. Every result feeds back into how we fund the next one.',
        btn1: 'See our approach →', btn1href: '#',
        btn2: 'Explore the Knowledge Hub', btn2href: 'knowledge-hub.html',
        badgeNum: '4', badgeLabel: 'Provinces reached through<br>partnership programmes',
      },
      {
        eyebrow: 'Strategy 2030',
        headline: 'Leading, connecting and learning — across three decades of partnership.',
        paragraph: 'From early-grade literacy to senior-phase mathematics, our work follows the evidence of what actually improves outcomes for learners.',
        btn1: 'Read Strategy 2030 →', btn1href: '#',
        btn2: 'Explore the Knowledge Hub', btn2href: 'knowledge-hub.html',
        badgeNum: '1995', badgeLabel: 'Founded to strengthen<br>SA education outcomes',
      },
    ];

    const hsEyebrow = document.getElementById('hs-eyebrow');
    const hsPara = document.getElementById('hs-paragraph');
    const hsActions = document.getElementById('hs-actions');
    const hsBtn1 = document.getElementById('hs-btn1');
    const hsBtn2 = document.getElementById('hs-btn2');
    const hsBadgeNum = document.getElementById('hs-badge-num');
    const hsBadgeLabel = document.getElementById('hs-badge-label');
    const hsImgs = document.querySelectorAll('.hero-split-image .frame img');
    const hsDots = document.querySelectorAll('.hero-dot-v2');

    function splitIntoWords(el, text) {
      el.innerHTML = '';
      const words = text.split(' ');
      words.forEach((w, i) => {
        const span = document.createElement('span');
        span.className = 'split-word';
        span.textContent = w;
        el.appendChild(span);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    }

    let hsIndex = 0;
    function renderHeroSplit(index, animate) {
      const data = heroSplitData[index];
      hsEyebrow.textContent = data.eyebrow;
      hsPara.textContent = data.paragraph;
      hsBtn1.textContent = data.btn1; hsBtn1.href = data.btn1href;
      hsBtn2.textContent = data.btn2; hsBtn2.href = data.btn2href;
      hsBadgeNum.textContent = data.badgeNum;
      hsBadgeLabel.innerHTML = data.badgeLabel;
      splitIntoWords(hsHeadline, data.headline);

      hsImgs.forEach((img, i) => img.classList.toggle('active', i === index));
      hsDots.forEach((d, i) => d.classList.toggle('active', i === index));

      const words = hsHeadline.querySelectorAll('.split-word');
      if (animate && !reduceMotion) {
        [hsEyebrow, hsPara, hsActions].forEach(el => el.classList.remove('in'));
        words.forEach((w, i) => { w.classList.remove('in'); w.style.transitionDelay = Math.min(i * 35, 420) + 'ms'; });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            words.forEach(w => w.classList.add('in'));
            hsEyebrow.classList.add('in');
            setTimeout(() => hsPara.classList.add('in'), 160);
            setTimeout(() => hsActions.classList.add('in'), 300);
          });
        });
      } else {
        words.forEach(w => w.classList.add('in'));
        hsEyebrow.classList.add('in'); hsPara.classList.add('in'); hsActions.classList.add('in');
      }
    }

    let hsTimer;
    function goToHeroSplit(i) {
      hsIndex = (i + heroSplitData.length) % heroSplitData.length;
      renderHeroSplit(hsIndex, true);
    }
    function resetHsTimer() {
      clearInterval(hsTimer);
      hsTimer = setInterval(() => goToHeroSplit(hsIndex + 1), 6000);
    }
    hsDots.forEach((d, i) => d.addEventListener('click', () => { goToHeroSplit(i); resetHsTimer(); }));

    // wait one frame for asset injection (data-src images) to have run first
    requestAnimationFrame(() => {
      renderHeroSplit(0, true);
      resetHsTimer();
    });
  }

  // ---- impact carousel arrows ----
  const impactTrack = document.querySelector('.impact-grid');
  const impactPrev = document.querySelector('.impact-arrow.prev');
  const impactNext = document.querySelector('.impact-arrow.next');
  if (impactTrack && impactPrev && impactNext) {
    const cards = Array.from(impactTrack.children);
    let order = 0;
    function rotate(dir) {
      if (dir === 1) { impactTrack.appendChild(impactTrack.firstElementChild); }
      else { impactTrack.insertBefore(impactTrack.lastElementChild, impactTrack.firstElementChild); }
    }
    impactNext.addEventListener('click', () => rotate(1));
    impactPrev.addEventListener('click', () => rotate(-1));
  }

  // ---- mobile nav toggle ----
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.primary-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.style.display === 'flex';
      nav.style.display = open ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.gap = '14px';
      nav.style.position = 'absolute';
      nav.style.top = '88px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = 'var(--paper)';
      nav.style.padding = '18px 32px 24px';
      nav.style.borderBottom = '1px solid var(--line)';
      nav.style.zIndex = '55';
    });
  }

  // ---- dismissible demo note ----
  document.querySelectorAll('.demo-note button').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.demo-note').style.display = 'none');
  });

  // ---- scroll reveal (progressive enhancement) ----
  const revealTargets = document.querySelectorAll(
    '.section-head, .pub-card, .blog-card, .aud-tile, .aud-card-v3, .impact-card-v2, .strategy-block, .strategy-block-v2, .journey-step, .sidebar-card, .content-block, .filter-panel, .tab-panel-frame'
  );
  if (revealTargets.length && !reduceMotion) {
    const parentIndex = new Map();
    revealTargets.forEach(el => {
      el.classList.add('reveal-init');
      const p = el.parentElement;
      const i = parentIndex.get(p) || 0;
      el.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
      parentIndex.set(p, i + 1);
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => io.observe(el));
  }

  // ---- spotlight glow (cursor-following highlight, brand colours) ----
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover) {
    const glowTargets = document.querySelectorAll('.pub-card, .blog-card, .impact-card-v2, .sidebar-card');
    glowTargets.forEach(el => {
      el.classList.add('glow-card', 'glow-active');
      // audience tiles get their own accent colour glow; everything else uses brand orange
      const tileColor = getComputedStyle(el).getPropertyValue('--tile-color').trim();
      if (tileColor) {
        el.style.setProperty('--glow-color', `color-mix(in srgb, ${tileColor} 22%, transparent)`);
        el.style.setProperty('--glow-border', `color-mix(in srgb, ${tileColor} 70%, transparent)`);
      }
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // ---- citation format toggle ----
  const citeBtns = document.querySelectorAll('.cite-fmt-btn');
  if (citeBtns.length) {
    const citeText = document.getElementById('cite-text');
    const formats = {
      apa: 'Mthembu, N. (2023). <strong style="font-style:normal;">Early grade reading outcomes in multilingual classrooms: A longitudinal study across six provinces.</strong> Zenex Foundation.',
      harvard: 'Mthembu, N., 2023. <strong style="font-style:normal;">Early grade reading outcomes in multilingual classrooms: A longitudinal study across six provinces.</strong> Johannesburg: Zenex Foundation.',
      chicago: 'Mthembu, N. "<strong style="font-style:normal;">Early Grade Reading Outcomes in Multilingual Classrooms: A Longitudinal Study Across Six Provinces.</strong>" Zenex Foundation, 2023.',
    };
    citeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        citeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (citeText) citeText.innerHTML = formats[btn.dataset.fmt];
      });
    });
  }
  const copyCiteBtn = document.getElementById('copy-cite-btn');
  if (copyCiteBtn) {
    copyCiteBtn.addEventListener('click', () => {
      const original = copyCiteBtn.textContent;
      copyCiteBtn.textContent = '✓ Copied';
      setTimeout(() => copyCiteBtn.textContent = original, 1500);
    });
  }

  // ---- feedback yes/no toggle ----
  const fbYes = document.getElementById('fb-yes');
  const fbNo = document.getElementById('fb-no');
  if (fbYes && fbNo) {
    fbYes.addEventListener('click', () => { fbYes.classList.add('sel'); fbNo.classList.remove('sel'); });
    fbNo.addEventListener('click', () => { fbNo.classList.add('sel'); fbYes.classList.remove('sel'); });
  }

  // ---- browse-by-topic tiles ----
  const topicTiles = document.querySelectorAll('.topic-tile');
  if (topicTiles.length) {
    topicTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        topicTiles.forEach(t => t.classList.remove('active'));
        tile.classList.add('active');
      });
    });
  }

  // ============================================================
  // PUBLICATION PAGE — audience view switcher
  // Same content model, re-prioritised by audience via data-attrs.
  // ============================================================
  const modeTabs = document.querySelectorAll('[data-mode-tab]');
  if (modeTabs.length) {
    const modeMeta = {
      gov:      { label: 'Government (DBE / DHET)', color: 'var(--gov)',      note: 'Policy implications and a one-page executive summary lead. Full methodology is collapsed but one click away.' },
      ngo:      { label: 'Education NGO',            color: 'var(--ngo)',      note: 'Partnership fit and comparable programme evidence lead — this audience is evaluating Zenex, not just the study.' },
      donor:    { label: 'Education donor',           color: 'var(--donor)',   note: 'Rigour and governance signals lead — evaluation design and track record surface before narrative findings.' },
      research: { label: 'Knowledge creator',         color: 'var(--research)',note: 'Full methodology, dataset access and citation export lead. Nothing is collapsed for this audience.' },
    };

    function setMode(mode) {
      modeTabs.forEach(t => t.classList.toggle('active', t.dataset.modeTab === mode));
      document.querySelectorAll('[data-mode-tab]').forEach(t => {
        t.style.setProperty('--tab-color', modeMeta[t.dataset.modeTab].color);
      });

      document.documentElement.style.setProperty('--current-tab-color', modeMeta[mode].color);
      document.querySelectorAll('.mode-note, .callout').forEach(el => el.style.setProperty('--tab-color', modeMeta[mode].color));

      // reorder / show-hide blocks tagged for this mode
      document.querySelectorAll('[data-relevance]').forEach(block => {
        const rel = block.dataset.relevance.split(' ');
        const isCore = rel.includes(mode) || rel.includes('all');
        block.classList.toggle('hidden', rel.includes('hide-' + mode));
        block.classList.toggle('collapsed', rel.includes('collapse-' + mode));
        if (!rel.includes('collapse-' + mode)) block.classList.remove('collapsed');
      });

      // reorder using flex order via data-order-{mode}
      document.querySelectorAll('[data-order]').forEach(block => {
        const orders = JSON.parse(block.dataset.order);
        block.style.order = orders[mode] ?? 99;
      });

      const noteEl = document.getElementById('mode-note-text');
      const noteLabel = document.getElementById('mode-note-label');
      if (noteEl) noteEl.textContent = modeMeta[mode].note;
      if (noteLabel) noteLabel.textContent = 'Viewing as: ' + modeMeta[mode].label;
    }

    modeTabs.forEach(t => t.addEventListener('click', () => setMode(t.dataset.modeTab)));
    setMode('gov'); // default
  }

  // ============================================================
  // SEARCH PAGE — lightweight client-side filter demo
  // ============================================================
  const resultsList = document.querySelector('.results-list');
  if (resultsList && window.PUB_DATA) {
    const checkboxes = document.querySelectorAll('.filter-panel input[type="checkbox"]');
    const countEl = document.querySelector('.results-count');
    const activeFiltersEl = document.getElementById('active-filters');
    const sortSelect = document.getElementById('sort-select');

    function renderActiveFilters(active) {
      if (!activeFiltersEl) return;
      const chips = [];
      Object.keys(active).forEach(group => {
        active[group].forEach(val => chips.push({ group, val }));
      });
      if (!chips.length) {
        activeFiltersEl.classList.add('empty');
        activeFiltersEl.innerHTML = '';
        return;
      }
      activeFiltersEl.classList.remove('empty');
      activeFiltersEl.innerHTML = '<span class="af-label">Active filters:</span>' +
        chips.map(c => `<span class="af-pill" data-group="${c.group}" data-val="${c.val}">${c.val} ✕</span>`).join('') +
        '<span class="af-clear">Clear all</span>';

      activeFiltersEl.querySelectorAll('.af-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const cb = document.querySelector(`.filter-panel input[data-group="${pill.dataset.group}"][value="${pill.dataset.val}"]`);
          if (cb) { cb.checked = false; render(); }
        });
      });
      activeFiltersEl.querySelector('.af-clear').addEventListener('click', () => {
        checkboxes.forEach(cb => cb.checked = false);
        render();
      });
    }

    function render() {
      const active = { topic: [], phase: [], type: [], audience: [] };
      checkboxes.forEach(cb => { if (cb.checked) active[cb.dataset.group].push(cb.value); });

      let filtered = window.PUB_DATA.filter(pub => {
        return Object.keys(active).every(group => {
          if (!active[group].length) return true;
          return active[group].some(v => pub[group].includes(v));
        });
      });

      if (sortSelect && sortSelect.value === 'title') {
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      }

      renderActiveFilters(active);

      resultsList.innerHTML = '';
      if (!filtered.length) {
        resultsList.innerHTML = '<div class="empty-state">No results match this filter combination. Try clearing one of the facets.</div>';
      } else {
        filtered.forEach(pub => {
          const row = document.createElement('a');
          row.href = 'publication.html';
          row.className = 'result-row';
          row.style.textDecoration = 'none';
          row.style.color = 'inherit';
          row.innerHTML = `
            <div class="thumb">${pub.type.toUpperCase()}</div>
            <div>
              <h4>${pub.title}</h4>
              <p class="desc">${pub.desc}</p>
              <div class="tag-row">${pub.audience.map(a => `<span class="tag">${a}</span>`).join('')}<span class="tag tag-fmt">${pub.type}</span></div>
            </div>
            <div class="ref-code">${pub.ref}</div>
          `;
          resultsList.appendChild(row);
          if (canHover) {
            row.classList.add('glow-card', 'glow-active');
            row.addEventListener('pointermove', (e) => {
              const r = row.getBoundingClientRect();
              row.style.setProperty('--mx', (e.clientX - r.left) + 'px');
              row.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
          }
        });
      }
      if (countEl) countEl.textContent = `${filtered.length} result${filtered.length === 1 ? '' : 's'}`;
    }

    checkboxes.forEach(cb => cb.addEventListener('change', render));
    if (sortSelect) sortSelect.addEventListener('change', render);
    render();
  }

});
