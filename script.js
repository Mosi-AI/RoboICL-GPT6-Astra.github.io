const progressBar = document.querySelector('#progress-bar');
const navLinks = [...document.querySelectorAll('.site-header nav a')];
const sections = [...new Set(navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean))];
let pageStateFrame = 0;

function updatePageState() {
  pageStateFrame = 0;
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  const progress = maxScroll > 0 ? Math.min(1, scrollY / maxScroll) : 0;
  progressBar.style.transform = `scaleX(${progress})`;

  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 130) active = section;
  }
  navLinks.forEach(link => {
    link.classList.toggle('active', Boolean(active) && link.hash === `#${active.id}`);
  });
}

function schedulePageState() {
  if (!pageStateFrame) pageStateFrame = requestAnimationFrame(updatePageState);
}

addEventListener('scroll', schedulePageState, { passive: true });
addEventListener('resize', schedulePageState, { passive: true });
addEventListener('hashchange', schedulePageState);
updatePageState();

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => link.closest('details')?.removeAttribute('open'));
});

const shotSeries = [
  {
    id: 'bottles',
    points: [{ shot: 0, score: 0.34 }, { shot: 1, score: 0.55 }, { shot: 2, score: 0.52 }, { shot: 3, score: 0.88 }]
  },
  {
    id: 'tower',
    points: [{ shot: 0, score: 0.04 }, { shot: 1, score: 0.32 }, { shot: 2, score: 0.30 }, { shot: 3, score: 0.82 }]
  }
];

function renderShotChart(container) {
  const width = 320;
  const height = 390;
  const margin = { top: 24, right: 24, bottom: 44, left: 64 };
  const yAxisTitle = container.dataset.yAxisTitle
    ? `<text class="chart-axis-title" transform="translate(16 ${(margin.top + height - margin.bottom) / 2}) rotate(-90)" text-anchor="middle">${container.dataset.yAxisTitle}</text>`
    : '';
  const xTicks = [0, 1, 2, 3];
  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1];
  const x = shot => margin.left + (shot / 3) * (width - margin.left - margin.right);
  const y = score => height - margin.bottom - score * (height - margin.top - margin.bottom);
  const lines = yTicks.map(tick => `
    <line class="chart-grid" x1="${margin.left}" y1="${y(tick)}" x2="${width - margin.right}" y2="${y(tick)}"></line>
    <text class="chart-label" x="${margin.left - 7}" y="${y(tick) + 3}" text-anchor="end">${tick.toFixed(1)}</text>
  `).join('');
  const xLabels = xTicks.map(tick => `<text class="chart-label" x="${x(tick)}" y="${height - 18}" text-anchor="middle">${tick}</text>`).join('');
  const series = shotSeries.map(item => {
    const points = item.points;
    const solidPath = points.map((point, index) => `${index ? 'L' : 'M'} ${x(point.shot)} ${y(point.score)}`).join(' ');
    const chartPoints = points.map(point => `
      <circle class="chart-point complete ${item.id}" style="color:var(--${item.id})" cx="${x(point.shot)}" cy="${y(point.score)}" r="4"></circle>
      <text class="chart-value ${item.id}" x="${x(point.shot) - (point.shot === 3 ? 2 : 0)}" y="${y(point.score) - 10}" text-anchor="${point.shot === 3 ? 'end' : 'middle'}">${point.score.toFixed(2)}</text>
    `).join('');
    return `
      <path class="chart-path ${item.id}" d="${solidPath}"></path>
      ${chartPoints}
    `;
  }).join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="shot-chart-title shot-chart-desc">
      <title id="shot-chart-title">Shot comparison on two bimanual tasks</title>
      <desc id="shot-chart-desc">Five-layout mean task scores at zero, one, two, and three demonstration episodes for Put bottles in a bin and Build Tower.</desc>
      ${lines}
      <line class="chart-axis" x1="${margin.left}" y1="${height - margin.bottom}" x2="${width - margin.right}" y2="${height - margin.bottom}"></line>
      ${xLabels}
      ${series}
      ${yAxisTitle}
      <text class="chart-axis-title" x="${(margin.left + width - margin.right) / 2}" y="${height - 2}" text-anchor="middle"># demonstration episodes</text>
    </svg>
  `;
}

document.querySelectorAll('[data-shot-chart]').forEach(renderShotChart);

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const compactViewport = matchMedia('(max-width: 820px)');
const saveData = Boolean(navigator.connection?.saveData);
const teaserVideos = [...document.querySelectorAll('[data-teaser-video]')];
const previewVideos = teaserVideos.filter(video => !video.matches('[data-rollout-video]'));
let teaserObserver;

function requiresManualTeaserPlayback() {
  return reducedMotion.matches || compactViewport.matches || saveData;
}

function syncPreviewVideoControls() {
  const manualPlayback = requiresManualTeaserPlayback();
  previewVideos.forEach(video => {
    video.controls = manualPlayback;
    if (manualPlayback) video.pause();
  });
}

function playVisibleTeaser(video) {
  if (video.dataset.userPaused === 'true'
    || document.hidden
    || video.dataset.inView !== 'true') {
    video.pause();
    return;
  }
  if (requiresManualTeaserPlayback()) {
    return;
  }
  video.play().catch(() => {
    // Muted autoplay may still be disabled by browser or user policy.
  });
}

if ('IntersectionObserver' in window) {
  teaserObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.dataset.inView = String(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      playVisibleTeaser(entry.target);
    });
  }, { threshold: [0, 0.35, 1] });
  teaserVideos.forEach(video => teaserObserver.observe(video));
} else {
  teaserVideos.forEach(video => {
    video.dataset.inView = 'true';
    playVisibleTeaser(video);
  });
}

function refreshTeaserPlayback() {
  syncPreviewVideoControls();
  teaserVideos.forEach(playVisibleTeaser);
}

syncPreviewVideoControls();
reducedMotion.addEventListener?.('change', refreshTeaserPlayback);
compactViewport.addEventListener?.('change', refreshTeaserPlayback);
document.addEventListener('visibilitychange', () => teaserVideos.forEach(playVisibleTeaser));

const rolloutExamples = [
  ['arrange_largest_number', 'Arrange the largest number', 'S0', 'standard', 0, 1, 'success'],
  ['build_tower', 'Build Tower', 'L1', 'standard', 1, 1, 'success'],
  ['classify_objects', 'Classify objects', 'L0', 'standard', 0, 1, 'success'],
  ['fold_clothes', 'Fold clothes', 'S0', 'standard', 0, 1, 'success'],
  ['imitate_sorting_sequence', 'Imitate a sorting sequence', 'L3', 'standard', 3, 1, 'success'],
  ['make_kong', 'Make a Kong in Mahjong', 'L0', 'standard', 0, 0, 'failure'],
  ['organize_table', 'Organize the table', 'L0', 'standard', 0, 0.5, 'failure'],
  ['pack_objects_into_box', 'Pack objects into a box', 'R0', 'random', 0, 0.25, 'failure'],
  ['put_bottles_into_dustbin', 'Put bottles in a bin', 'L3', 'standard', 3, 1, 'success']
];

const rolloutData = Object.fromEntries(rolloutExamples.map(([
  taskId, label, id, variant, layout, score, outcome
]) => [taskId, {
  label,
  id,
  layout,
  variant,
  score,
  outcome,
  protocol: '3-shot · seed 0 · example',
  src: `assets/videos/trajectories/${taskId}--${id}.mp4?v=20260919-qualitative-hires`
}]));

const DEFAULT_ROLLOUT_TASK = 'imitate_sorting_sequence';
const ROLLOUT_STATE_VERSION = '2';
let rolloutPolicyData = { tasks: {} };

function initializeRolloutPlayer(player) {
  const taskSelect = player.querySelector('[data-task-select]');
  const video = player.querySelector('[data-rollout-video]');
  const policyDisplay = player.querySelector('[data-policy-display]');
  const policyLabel = player.querySelector('[data-policy-label]');
  const policyWall = player.querySelector('[data-policy-wall]');
  const policyNote = player.querySelector('[data-policy-note]');
  const policyStep = player.querySelector('[data-policy-step]');
  const policyRequest = player.querySelector('[data-policy-request]');
  const pauseButton = player.querySelector('[data-policy-pause]');
  const taskLabel = player.querySelector('[data-rollout-task]');
  const layoutLabel = player.querySelector('[data-rollout-layout]');
  const outcomeLabel = player.querySelector('[data-rollout-outcome]');
  const scoreLabel = player.querySelector('[data-rollout-score]');
  const protocolLabel = player.querySelector('[data-rollout-protocol]');
  const rateButtons = [...player.querySelectorAll('[data-playback-rate]')];
  let playbackRate = 1;
  let restoringUrl = false;
  let activePolicyTurn = null;

  Object.entries(rolloutData).forEach(([id, task]) => {
    taskSelect.add(new Option(task.label, id));
  });

  function currentTask() {
    return rolloutData[taskSelect.value];
  }

  function setVideoSource(target, source) {
    const resolvedSource = new URL(source, document.baseURI).href;
    if (target.currentSrc === resolvedSource || target.src === resolvedSource) return;
    target.pause();
    target.src = source;
    target.load();
  }

  function scoreText(layout) {
    return Number.isFinite(layout.score) ? layout.score.toFixed(2) : 'not scored';
  }

  function setOutcome(target, outcome) {
    target.textContent = outcome;
    target.dataset.outcome = outcome;
  }

  function writeUrlState() {
    if (restoringUrl) return location.href;
    try {
      const url = new URL(location.href);
      url.searchParams.set('task', taskSelect.value);
      url.searchParams.set('speed', String(playbackRate));
      url.searchParams.set('rollout_state', ROLLOUT_STATE_VERSION);
      history.replaceState(history.state, '', url);
      return url.href;
    } catch (_) {
      // The explorer still works when a restrictive local-file preview blocks History API writes.
      return location.href;
    }
  }

  function setPlaybackRate(rate, writeUrl = true) {
    playbackRate = [0.5, 1, 2, 4].includes(Number(rate)) ? Number(rate) : 1;
    video.playbackRate = playbackRate;
    rateButtons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.playbackRate) === playbackRate)));
    if (writeUrl) writeUrlState();
  }

  function formatVideoTime(seconds) {
    const value = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(value / 60);
    const remainder = value - minutes * 60;
    return `${String(minutes).padStart(2, '0')}:${remainder.toFixed(3).padStart(6, '0')}`;
  }

  function formatWallTime(timestamp) {
    if (!timestamp) return 'request start —';
    const match = timestamp.match(/T(\d{2}:\d{2}:\d{2})(?:\.(\d{3})\d*)?/);
    return match ? `request start ${match[1]}.${match[2] || '000'} UTC` : `request start ${timestamp}`;
  }

  function formatResponseTime(seconds) {
    return Number.isFinite(Number(seconds)) ? `${Number(seconds).toFixed(2)}s response` : 'response time —';
  }

  function updatePauseButton() {
    if (!pauseButton) return;
    const paused = video.paused;
    pauseButton.textContent = paused ? 'Play' : 'Pause';
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Play rollout' : 'Pause rollout');
  }

  function setPaused(paused) {
    if (paused) {
      video.dataset.userPaused = 'true';
      video.pause();
    } else {
      delete video.dataset.userPaused;
      video.play().catch(() => {
        // A browser may still block playback until a direct gesture reaches the video.
      });
    }
    updatePauseButton();
  }

  function renderPolicyAtTime(time = video.currentTime, force = false) {
    if (!policyDisplay) return;
    const taskPolicy = rolloutPolicyData.tasks?.[taskSelect.value];
    const decisions = taskPolicy?.decisions || [];
    if (!decisions.length) {
      policyLabel.textContent = 'GPT-6 Astra · recorded policy';
      policyWall.textContent = 'policy trace unavailable';
      policyNote.textContent = 'No recorded policy trace is bundled for this task.';
      policyStep.textContent = 'step — · t=—';
      policyRequest.textContent = 'request —';
      return;
    }
    const currentTime = Math.max(0, Number(time) || 0);
    let selected = decisions[0];
    for (const decision of decisions) {
      if (Number(decision.videoTimeS) <= currentTime + 0.04) selected = decision;
      else break;
    }
    if (!force && selected.turn === activePolicyTurn) return;
    activePolicyTurn = selected.turn;
    policyLabel.textContent = `GPT-6 Astra · recorded policy · ${taskPolicy.label}`;
    policyWall.textContent = formatWallTime(selected.startedAt);
    policyNote.textContent = selected.executionNote || 'No execution note recorded for this decision.';
    policyStep.textContent = `step ${selected.step} · t=${formatVideoTime(selected.videoTimeS)}`;
    policyRequest.textContent = `request ${selected.turn} · ${formatResponseTime(selected.responseElapsedS)}`;
  }

  function updateRollout(writeUrl = true) {
    const example = currentTask();
    video.pause();
    setVideoSource(video, example.src);
    video.playbackRate = playbackRate;
    playVisibleTeaser(video);
    taskLabel.textContent = example.label;
    layoutLabel.textContent = `3 shots · ${example.id} · ${example.variant} layout ${example.layout}`;
    setOutcome(outcomeLabel, example.outcome);
    scoreLabel.textContent = scoreText(example);
    protocolLabel.textContent = example.protocol;

    activePolicyTurn = null;
    renderPolicyAtTime(0, true);
    updatePauseButton();
    if (writeUrl) writeUrlState();
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    restoringUrl = true;
    const requestedTask = params.get('task');
    const hasCurrentState = params.get('rollout_state') === ROLLOUT_STATE_VERSION;
    taskSelect.value = hasCurrentState && rolloutData[requestedTask]
      ? requestedTask
      : DEFAULT_ROLLOUT_TASK;
    setPlaybackRate(params.get('speed') ?? 1, false);
    updateRollout(false);
    restoringUrl = false;
    writeUrlState();
  }

  taskSelect.addEventListener('change', () => {
    updateRollout();
  });
  rateButtons.forEach(button => button.addEventListener('click', () => setPlaybackRate(button.dataset.playbackRate)));
  pauseButton?.addEventListener('click', () => setPaused(!video.paused));
  video.addEventListener('play', () => {
    updatePauseButton();
  });
  video.addEventListener('playing', () => {
    updatePauseButton();
  });
  video.addEventListener('pause', () => {
    updatePauseButton();
  });
  video.addEventListener('waiting', () => {
    updatePauseButton();
  });
  video.addEventListener('ended', updatePauseButton);
  video.addEventListener('seeking', () => {
    renderPolicyAtTime();
  });
  video.addEventListener('seeked', () => {
    renderPolicyAtTime();
  });
  video.addEventListener('timeupdate', () => {
    renderPolicyAtTime();
  });
  video.addEventListener('loadedmetadata', () => renderPolicyAtTime(video.currentTime, true));
  video.addEventListener('ratechange', () => setPlaybackRate(video.playbackRate));
  video.addEventListener('error', () => {
    console.warn('The selected bundled H.264 rollout could not be loaded or decoded.');
  });
  restoreFromUrl();
  addEventListener('popstate', restoreFromUrl);

  function openTaskRollouts(requestedTask) {
    if (!rolloutData[requestedTask]) return;
    taskSelect.value = requestedTask;
    updateRollout();
    document.querySelector('#rollouts').scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }

  document.querySelectorAll('[data-open-rollout]').forEach(button => {
    button.addEventListener('click', () => openTaskRollouts(button.dataset.openRollout));
  });
}

fetch('assets/data/rollout-policy.json?v=20260919-policy-v2')
  .then(response => {
    if (!response.ok) throw new Error(`Policy trace request failed: ${response.status}`);
    return response.json();
  })
  .then(data => {
    rolloutPolicyData = data;
  })
  .catch(error => {
    console.warn('Recorded rollout policy traces could not be loaded.', error);
  })
  .finally(() => {
    document.querySelectorAll('[data-rollout-player]').forEach(initializeRolloutPlayer);
  });
