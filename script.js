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
  if (progressBar) progressBar.style.transform = `scaleX(${progress})`;

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
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => link.closest('details')?.removeAttribute('open'));
});
updatePageState();

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const CATEGORIES = ['Open', 'Memory', 'Precision', 'Long-Horizon'];
const MODELS = [
  { id: 'roboicl', name: 'RoboICL', short: 'RoboICL', color: '#4f9690', overall: 50.64, categories: [54.75, 70.00, 38.53, 44.11], note: 'Frozen GPT-6 Astra; zero-shot on Open and one-shot elsewhere.' },
  { id: 'roboprobe', name: 'GPT-6 Astra · RoboProbe', short: 'RoboProbe', color: '#dda38f', overall: 26.86, categories: [34.36, 43.04, 12.65, 21.45], note: 'Official zero-shot GPT-6 Astra controller.' },
  { id: 'physicalrsi', name: 'PhysicalRSI', short: 'PhysicalRSI', color: '#6676b8', overall: 39.56, categories: [28.88, 46.74, 38.05, 46.37], note: 'Official leaderboard snapshot. Overall is recomputed on the paper\'s same 30 tasks.' },
  { id: 'simate', name: 'Simate-beta', short: 'Simate-beta', color: '#ad96c0', overall: 33.68, categories: [9.12, 33.33, 34.35, 57.84], note: 'Published VLA/WAM result reproduced from the RoboDojo leaderboard.' },
  { id: 'vpp2', name: 'VPP2-Preview', short: 'VPP2-Preview', color: '#d6b55d', overall: 30.13, categories: [5.83, 50.78, 33.75, 35.31], note: 'Official RoboDojo leaderboard result contributed by RobotEra.' },
  { id: 'liber', name: 'Liber-0 Preview', short: 'Liber-0 Preview', color: '#91aabd', overall: 31.81, categories: [6.68, 37.77, 38.28, 45.98], note: 'Published VLA/WAM result reproduced from the RoboDojo leaderboard.' }
];

const TASKS = [
  ['align_blocks', 'Align Blocks', 'Open', 50, [90, 50, 86, 0, 0, 0]],
  ['classify_objects_by_language', 'Classify Objects by Language', 'Open', 50, [70.8, 46, 20.93, 6, 1.8, 3.87]],
  ['general_pickup', 'General Pickup', 'Open', 50, [90, 84, 47.33, 49.33, 33.33, 34]],
  ['pick_from_conveyor_by_image', 'Pick from Conveyor by Image', 'Open', 50, [22, 4, 0, 0, 0, 0]],
  ['pour_by_language', 'Pour by Language', 'Open', 0, [0, 0.4, 10.13, 0, 0, 0]],
  ['solve_equation', 'Solve Equation', 'Open', 50, [86, 40, 60, 0, 0, 0]],
  ['stack_blocks_by_language', 'Stack Blocks by Language', 'Open', 50, [79.2, 48, 0, 17.33, 11.47, 15.6]],
  ['store_tools_in_toolbox', 'Store Tools in Toolbox', 'Open', 0, [0, 2.5, 6.67, 0.33, 0, 0]],
  ['cover_blocks', 'Cover Blocks', 'Memory', 20, [100, 49.3, 100, 100, 99.07, 100]],
  ['imitate_sorting_sequence', 'Imitate Sorting Sequence', 'Memory', 20, [75, 58.9, 1.1, 4.67, 2.27, 8.63]],
  ['match_and_pick_from_conveyor', 'Match & Pick from Conveyor', 'Memory', 20, [65, 62, 7.33, 56, 76, 64]],
  ['press_by_number', 'Press by Number', 'Memory', 20, [100, 70, 79.33, 0.67, 89.33, 0]],
  ['swap_t', 'Swap T', 'Memory', 20, [80, 18, 92.67, 0, 15.33, 53.33]],
  ['swap_blocks', 'Swap Blocks', 'Memory', 0, [0, 0, 0, 38.67, 22.67, 0.67]],
  ['build_tower', 'Build Tower', 'Precision', 50, [80.6, 16.4, 37.13, 87.4, 79.13, 84.33]],
  ['deposit_coin', 'Deposit Coin', 'Precision', 50, [78, 16, 62.27, 16.4, 17.6, 18.67]],
  ['fasten_screws', 'Fasten Screws', 'Precision', 50, [49.8, 36.4, 7.6, 40.93, 28.4, 61.8]],
  ['insert_key', 'Insert Key', 'Precision', 20, [15, 14.4, 48.43, 10.9, 14.1, 0.9]],
  ['insert_tubes', 'Insert Tubes', 'Precision', 50, [40.8, 6, 78.93, 41.2, 76.8, 82.53]],
  ['play_xylophone', 'Play Xylophone', 'Precision', 50, [44, 8, 0.67, 3.33, 0, 0]],
  ['plug_in_charger', 'Plug in Charger', 'Precision', 0, [0, 0, 30.67, 29.33, 6, 27.33]],
  ['pour_balls_into_vase', 'Pour Balls into Vase', 'Precision', 0, [0, 4, 38.67, 45.33, 48, 30.67]],
  ['classify_objects', 'Classify Objects', 'Long-Horizon', 50, [85.5, 69, 55.83, 61.63, 32.3, 19.73]],
  ['fill_egg_holder', 'Fill Egg Holder', 'Long-Horizon', 50, [21.3, 5.5, 1.9, 16.6, 4.1, 12.57]],
  ['fill_pen_holder', 'Fill Pen Holder', 'Long-Horizon', 50, [29.8, 5, 21.87, 50.37, 47.47, 49.77]],
  ['make_kong', 'Make a Kong in Mahjong', 'Long-Horizon', 0, [0, 0, 82, 76, 34.67, 18]],
  ['organize_table', 'Organize the Table', 'Long-Horizon', 20, [55, 39.5, 27.33, 71.83, 54.83, 47.5]],
  ['play_stacking_toy', 'Play Stacking Toy', 'Long-Horizon', 0, [0, 6.6, 0, 0, 8.47, 26.73]],
  ['play_tic_tac_toe', 'Play Tic-Tac-Toe', 'Long-Horizon', 20, [98.75, 10.7, 98.33, 86.27, 9.17, 95.67]],
  ['put_bottles_into_dustbin', 'Put Bottles into Dustbin', 'Long-Horizon', 20, [62.5, 35.3, 83.7, 100, 91.5, 97.9]]
].map(([id, name, category, count, scores]) => ({ id, name, category, count, scores }));

const PARTIAL_EVALUATION_TASKS = new Set([
  'pour_by_language',
  'store_tools_in_toolbox',
  'plug_in_charger',
  'pour_balls_into_vase',
  'make_kong',
  'play_stacking_toy',
  'swap_blocks'
]);

const score = value => Number(value).toFixed(2);
const CATEGORY_AXIS_MAX = 80;
let selectedModelIndex = 0;

function renderOverview() {
  const chart = document.querySelector('[data-overview-chart]');
  if (!chart) return;
  chart.innerHTML = `
    <div class="overview-legend" role="group" aria-label="Choose a comparison model">
      ${MODELS.map((model, index) => `<button type="button" data-model-index="${index}" aria-pressed="${index === selectedModelIndex}" style="--model-color:${model.color}"><i></i>${model.short}</button>`).join('')}
    </div>
    <div class="category-chart">
      ${CATEGORIES.map((category, categoryIndex) => {
        const roboiclValue = MODELS[0].categories[categoryIndex];
        const roboprobeValue = MODELS[1].categories[categoryIndex];
        const probeHeight = Math.min(roboprobeValue, CATEGORY_AXIS_MAX) / CATEGORY_AXIS_MAX * 100;
        const gainHeight = Math.min(roboiclValue - roboprobeValue, CATEGORY_AXIS_MAX) / CATEGORY_AXIS_MAX * 100;
        return `
          <section class="category-chart-group">
            <header><b>${category}</b><span>${TASKS.filter(task => task.category === category).length} tasks</span></header>
            <div class="category-model-bars${categoryIndex === 0 ? ' has-y-axis' : ''}">
              ${categoryIndex === 0 ? '<div class="category-y-axis" aria-hidden="true"><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span></div>' : ''}
              ${MODELS.map((model, modelIndex) => `
                <button type="button" data-model-index="${modelIndex}" data-category="${category}" aria-label="${model.name}, ${category}, ${score(model.categories[categoryIndex])}" aria-pressed="${modelIndex === selectedModelIndex}" style="--score:${Math.min(model.categories[categoryIndex], CATEGORY_AXIS_MAX) / CATEGORY_AXIS_MAX * 100}%;--model-color:${model.color};--bar-delay:${categoryIndex * 70 + modelIndex * 45}ms">
                  <span class="category-bar-track"><i></i></span>
                  ${modelIndex === 1 ? `<span class="category-gain-arrow" aria-hidden="true" style="--probe-score:${probeHeight}%;--gain-score:${gainHeight}%"><em>+${Math.round(roboiclValue - roboprobeValue)}</em></span>` : ''}
                </button>`).join('')}
            </div>
          </section>`;
      }).join('')}
    </div>`;
  chart.querySelectorAll('[data-model-index]').forEach(button => {
    button.addEventListener('click', () => {
      selectedModelIndex = Number(button.dataset.modelIndex);
      renderOverview();
      renderModelInspector();
    });
  });
}

function renderModelInspector() {
  const model = MODELS[selectedModelIndex];
  const modelName = document.querySelector('[data-inspector-model]');
  const overall = document.querySelector('[data-inspector-overall]');
  const note = document.querySelector('[data-inspector-note]');
  const swatch = document.querySelector('[data-inspector-swatch]');
  const bars = document.querySelector('[data-inspector-bars]');
  if (!bars) return;
  modelName.textContent = model.name;
  overall.textContent = score(model.overall);
  note.textContent = model.note;
  swatch.style.background = model.color;
  bars.innerHTML = CATEGORIES.map((category, index) => `
    <div><span>${category}</span><i><b style="width:${model.categories[index]}%;background:${model.color};--bar-delay:${index * 90}ms"></b></i><strong>${score(model.categories[index])}</strong></div>
  `).join('');
}

renderOverview();
renderModelInspector();

const growBenchmarkCharts = () => {
  document.querySelector('[data-overview-chart]')?.classList.add('is-grown');
  document.querySelector('[data-inspector-bars]')?.classList.add('is-grown');
};
const benchmarkOverview = document.querySelector('.benchmark-overview-figure');
if (reducedMotion.matches || !benchmarkOverview || !('IntersectionObserver' in window)) {
  growBenchmarkCharts();
} else {
  const benchmarkChartObserver = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    requestAnimationFrame(() => requestAnimationFrame(growBenchmarkCharts));
    benchmarkChartObserver.disconnect();
  }, { threshold: 0.2 });
  benchmarkChartObserver.observe(benchmarkOverview);
}

const categorySelect = document.querySelector('[data-category-select]');
const benchmarkTaskSelect = document.querySelector('[data-task-select]');
const categoryCount = document.querySelector('[data-category-count]');
let benchmarkCategory = 'Memory';
let benchmarkTaskId = 'imitate_sorting_sequence';

function tasksForCategory(category) {
  return TASKS.filter(task => task.category === category);
}

function populateBenchmarkTaskSelect() {
  if (!benchmarkTaskSelect) return;
  benchmarkTaskSelect.replaceChildren();
  tasksForCategory(benchmarkCategory).forEach(task => {
    const suffix = task.count
      ? ` · ${task.count} layouts`
      : PARTIAL_EVALUATION_TASKS.has(task.id)
        ? ' · partial evaluation'
        : '';
    benchmarkTaskSelect.add(new Option(`${task.name}${suffix}`, task.id));
  });
  benchmarkTaskSelect.value = benchmarkTaskId;
}

function markBenchmarkTask(taskId) {
  document.querySelectorAll('[data-task-id]').forEach(row => {
    const selected = row.dataset.taskId === taskId;
    row.classList.toggle('is-selected', selected);
    if (selected) row.setAttribute('aria-current', 'true');
    else row.removeAttribute('aria-current');
  });
}

function renderCategoryTable() {
  const body = document.querySelector('[data-category-table-body]');
  const foot = document.querySelector('[data-category-table-foot]');
  if (!body || !foot) return;
  const categoryIndex = CATEGORIES.indexOf(benchmarkCategory);
  const categoryTasks = tasksForCategory(benchmarkCategory);
  body.innerHTML = categoryTasks.map(task => {
    const max = Math.max(...task.scores);
    const cells = task.scores.map((value, index) => {
      const isOurs = MODELS[index].id === 'roboicl';
      const layoutMark = isOurs ? `<sup>${task.count}</sup>` : '';
      return `<td class="${value === max ? 'row-best' : ''}${isOurs ? ' ours-cell' : ''}">${score(value)}${layoutMark}</td>`;
    }).join('');
    const evaluationNote = PARTIAL_EVALUATION_TASKS.has(task.id)
      ? '<small>partial evaluation</small>'
      : '';
    return `<tr class="task-table-row${task.id === benchmarkTaskId ? ' is-selected' : ''}" data-task-id="${task.id}" tabindex="0" role="button" aria-current="${task.id === benchmarkTaskId ? 'true' : 'false'}" aria-label="Play ${task.name} rollouts"><th scope="row">${task.name}${evaluationNote}</th>${cells}</tr>`;
  }).join('');
  foot.innerHTML = `<tr class="category-mean"><th scope="row">${benchmarkCategory} mean</th>${MODELS.map(model => `<td class="${model.id === 'roboicl' ? 'ours-cell' : ''}">${score(model.categories[categoryIndex])}</td>`).join('')}</tr>`;
  if (categoryCount) categoryCount.textContent = categoryTasks.length;

  body.querySelectorAll('[data-task-id]').forEach(row => {
    const open = () => selectBenchmarkTask(row.dataset.taskId, { notify: true });
    row.addEventListener('click', open);
    row.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
}

function selectBenchmarkTask(taskId, { notify = false } = {}) {
  const task = TASKS.find(item => item.id === taskId);
  if (!task) return;
  const categoryChanged = task.category !== benchmarkCategory;
  benchmarkCategory = task.category;
  benchmarkTaskId = task.id;
  if (categorySelect) categorySelect.value = benchmarkCategory;
  if (categoryChanged || ![...benchmarkTaskSelect.options].some(option => option.value === task.id)) {
    populateBenchmarkTaskSelect();
    renderCategoryTable();
  } else {
    benchmarkTaskSelect.value = benchmarkTaskId;
    markBenchmarkTask(benchmarkTaskId);
  }
  if (notify) {
    window.dispatchEvent(new CustomEvent('roboicl:selectTask', { detail: { taskId } }));
  }
}

if (categorySelect && benchmarkTaskSelect) {
  CATEGORIES.forEach(category => categorySelect.add(new Option(category, category)));
  categorySelect.value = benchmarkCategory;
  populateBenchmarkTaskSelect();
  categorySelect.addEventListener('change', () => {
    benchmarkCategory = categorySelect.value;
    benchmarkTaskId = tasksForCategory(benchmarkCategory)[0]?.id || '';
    populateBenchmarkTaskSelect();
    renderCategoryTable();
    if (benchmarkTaskId) window.dispatchEvent(new CustomEvent('roboicl:selectTask', { detail: { taskId: benchmarkTaskId } }));
  });
  benchmarkTaskSelect.addEventListener('change', () => selectBenchmarkTask(benchmarkTaskSelect.value, { notify: true }));
}
renderCategoryTable();

function setVideoSource(video, source) {
  const resolved = source ? new URL(source, document.baseURI).href : '';
  if (source && (video.currentSrc === resolved || video.src === resolved)) return;
  video.pause();
  video.removeAttribute('src');
  if (source) video.src = source;
  video.load();
}

function initializeRolloutExplorer(manifest) {
  const player = document.querySelector('[data-rollout-player]');
  if (!player) return;
  const layoutSelect = player.querySelector('[data-layout-select]');
  const masterVideo = player.querySelector('[data-rollout-video]');
  const videos = [masterVideo];
  const triptych = player.querySelector('[data-rollout-triptych]');
  const placeholder = player.querySelector('[data-rollout-placeholder]');
  const taskLabel = player.querySelector('[data-rollout-task]');
  const layoutLabel = player.querySelector('[data-rollout-layout]');
  const scoreLabel = player.querySelector('[data-rollout-score]');
  const outcomeLabel = player.querySelector('[data-rollout-outcome]');
  const protocolLabel = player.querySelector('[data-rollout-protocol]');
  const summary = player.querySelector('[data-rollout-summary]');
  const policyLabel = player.querySelector('[data-policy-label]');
  const policyNote = player.querySelector('[data-policy-note]');
  const policyStep = player.querySelector('[data-policy-step]');
  const policyRequest = player.querySelector('[data-policy-request]');
  const pauseButton = player.querySelector('[data-policy-pause]');
  const restartButton = player.querySelector('[data-policy-restart]');
  const rateButtons = [...player.querySelectorAll('[data-playback-rate]')];
  const taskMap = new Map(manifest.tasks.map(task => [task.id, task]));
  const traceCache = new Map();
  let selectedTaskId = benchmarkTaskId;
  let playbackRate = 1;
  let userPaused = false;
  let activeTrace = [];
  let activePolicyTurn = null;
  let traceRequest = 0;

  const evaluatedCount = manifest.summary.fullEvaluationRolloutCount ?? manifest.summary.rolloutCount;
  const partialCount = Number(manifest.summary.partialEvaluationRolloutCount) || 0;
  const summaryCount = document.createElement('strong');
  const summaryText = document.createElement('span');
  summaryCount.textContent = String(evaluatedCount);
  summaryText.textContent = partialCount
    ? `full-evaluation + ${partialCount} partial-evaluation layouts · ${manifest.summary.playableTaskCount} playable tasks`
    : `evaluated layouts · ${manifest.summary.playableTaskCount} playable tasks`;
  summary.replaceChildren(summaryCount, summaryText);

  function currentTask() {
    return taskMap.get(selectedTaskId) || manifest.tasks.find(task => task.layouts.length);
  }

  function markTableTask(taskId) {
    markBenchmarkTask(taskId);
  }

  function displayOutcome(layout) {
    if (layout?.officialSuccess) return 'success';
    const officialScore = Number(layout?.officialScore ?? layout?.score);
    if (Number.isFinite(officialScore)) return officialScore > 0 ? 'partial' : 'failure';
    const label = String(layout?.outcomeLabel || layout?.outcome || '').trim().toLowerCase();
    if (label === 'no-progress' || label === 'no progress') return 'failure';
    return label || 'failure';
  }

  function populateLayouts(preferredLayout) {
    const task = currentTask();
    layoutSelect.replaceChildren();
    if (!task?.layouts.length) {
      layoutSelect.add(new Option('No recorded layout', ''));
      layoutSelect.disabled = true;
      return;
    }
    layoutSelect.disabled = false;
    task.layouts.forEach(layout => layoutSelect.add(new Option(`${layout.label} · ${displayOutcome(layout)}`, String(layout.id))));
    const requested = String(preferredLayout ?? '');
    layoutSelect.value = task.layouts.some(layout => String(layout.id) === requested) ? requested : String(task.layouts[0].id);
  }

  function updateUrl() {
    try {
      const url = new URL(location.href);
      url.searchParams.set('category', currentTask()?.category || benchmarkCategory);
      url.searchParams.set('task', selectedTaskId);
      if (layoutSelect.value) url.searchParams.set('layout', layoutSelect.value);
      else url.searchParams.delete('layout');
      url.searchParams.set('speed', String(playbackRate));
      history.replaceState(history.state, '', url);
    } catch (_) {}
  }

  function formatVideoTime(seconds) {
    const value = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(value / 60);
    const remainder = value - minutes * 60;
    return `${String(minutes).padStart(2, '0')}:${remainder.toFixed(3).padStart(6, '0')}`;
  }

  function renderPolicyAtTime(time = masterVideo.currentTime, force = false) {
    if (!activeTrace.length) {
      policyNote.textContent = 'No recorded policy decision is available for this layout.';
      policyStep.textContent = 'step — · t=—';
      policyRequest.textContent = 'request —';
      return;
    }
    const currentTime = Math.max(0, Number(time) || 0);
    let selected = activeTrace[0];
    for (const decision of activeTrace) {
      if (Number(decision.videoTimeS) <= currentTime + 0.04) selected = decision;
      else break;
    }
    if (!force && selected.turn === activePolicyTurn) return;
    activePolicyTurn = selected.turn;
    policyNote.textContent = selected.executionNote || 'No execution note was recorded for this decision.';
    policyStep.textContent = `step ${selected.step} · t=${formatVideoTime(selected.videoTimeS)}`;
    policyRequest.textContent = `request ${selected.request ?? selected.turn}`;
  }

  async function loadTrace(layout) {
    const requestId = ++traceRequest;
    activeTrace = [];
    activePolicyTurn = null;
    policyNote.textContent = 'Loading recorded decision trace…';
    policyStep.textContent = 'step — · t=—';
    policyRequest.textContent = 'request —';
    if (!layout?.trace) return renderPolicyAtTime(0, true);
    try {
      let payload = traceCache.get(layout.trace);
      if (!payload) {
        const response = await fetch(layout.trace);
        if (!response.ok) throw new Error(`Trace request failed: ${response.status}`);
        payload = await response.json();
        traceCache.set(layout.trace, payload);
      }
      if (requestId !== traceRequest) return;
      activeTrace = payload.decisions || [];
      renderPolicyAtTime(masterVideo.currentTime, true);
    } catch (error) {
      if (requestId !== traceRequest) return;
      renderPolicyAtTime(0, true);
      console.warn('Recorded policy trace could not be loaded.', error);
    }
  }

  function updatePauseButton() {
    const paused = masterVideo.paused;
    pauseButton.textContent = paused ? 'Play' : 'Pause';
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Play rollout' : 'Pause rollout');
  }

  function pauseAll(markAsUserAction = false) {
    if (markAsUserAction) userPaused = true;
    videos.forEach(video => video.pause());
    updatePauseButton();
  }

  function playAll(markAsUserAction = false) {
    if (markAsUserAction) userPaused = false;
    const time = masterVideo.currentTime;
    videos.forEach(video => {
      if (video !== masterVideo && Math.abs(video.currentTime - time) > 0.08) video.currentTime = time;
      video.playbackRate = playbackRate;
      video.play().catch(updatePauseButton);
    });
    updatePauseButton();
  }

  function setPlaybackRate(rate, writeUrl = true) {
    playbackRate = [0.5, 1, 2, 4].includes(Number(rate)) ? Number(rate) : 1;
    videos.forEach(video => { video.playbackRate = playbackRate; });
    rateButtons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.playbackRate) === playbackRate)));
    if (writeUrl) updateUrl();
  }

  function clearVideos() {
    videos.forEach(video => setVideoSource(video, ''));
  }

  function setLayoutVideos(layout) {
    setVideoSource(masterVideo, layout.video || '');
    masterVideo.playbackRate = playbackRate;
  }

  function updatePlayer(writeUrl = true) {
    const task = currentTask();
    const layout = task?.layouts.find(item => String(item.id) === layoutSelect.value);
    markTableTask(task?.id);
    taskLabel.textContent = task?.name || 'No task selected';
    policyLabel.textContent = task ? `GPT-6 Astra · recorded policy · ${task.name}` : 'GPT-6 Astra · recorded policy';

    if (!layout) {
      clearVideos();
      triptych.hidden = true;
      placeholder.hidden = false;
      layoutLabel.textContent = 'No recorded layout';
      scoreLabel.textContent = '—';
      outcomeLabel.textContent = 'unavailable';
      outcomeLabel.dataset.outcome = 'unavailable';
      protocolLabel.textContent = task ? `${task.shots}-shot · seed 0 · ${task.evaluationStatus || 'unavailable'}` : '—';
      loadTrace(null);
    } else {
      setLayoutVideos(layout);
      triptych.hidden = false;
      placeholder.hidden = true;
      layoutLabel.textContent = `${task.shots}-shot · L${layout.id} · ${layout.variant} layout ${layout.id}`;
      scoreLabel.textContent = score(Number(layout.officialScore ?? layout.score));
      outcomeLabel.textContent = displayOutcome(layout);
      outcomeLabel.dataset.outcome = layout.outcome;
      protocolLabel.textContent = `${task.shots}-shot · seed 0 · ${layout.variant}`;
      protocolLabel.title = '';
      loadTrace(layout);
      if (!userPaused) masterVideo.addEventListener('canplay', () => {
        if (!userPaused) playAll();
      }, { once: true });
    }
    if (writeUrl) updateUrl();
  }

  function selectTask(taskId, preferredLayout) {
    const task = taskMap.get(taskId);
    if (!task) return;
    selectedTaskId = task.id;
    selectBenchmarkTask(task.id);
    populateLayouts(preferredLayout);
    updatePlayer();
  }

  layoutSelect.addEventListener('change', () => updatePlayer());
  rateButtons.forEach(button => button.addEventListener('click', () => setPlaybackRate(button.dataset.playbackRate)));
  pauseButton.addEventListener('click', () => {
    if (masterVideo.paused) playAll(true);
    else pauseAll(true);
  });
  restartButton.addEventListener('click', () => {
    videos.forEach(video => {
      video.currentTime = 0;
      video.playbackRate = playbackRate;
    });
    activePolicyTurn = null;
    renderPolicyAtTime(0, true);
    playAll(true);
  });
  masterVideo.addEventListener('play', () => playAll());
  masterVideo.addEventListener('pause', updatePauseButton);
  masterVideo.addEventListener('playing', updatePauseButton);
  masterVideo.addEventListener('timeupdate', () => {
    const masterTime = masterVideo.currentTime;
    videos.forEach(video => {
      if (video !== masterVideo && video.readyState >= 2 && Math.abs(video.currentTime - masterTime) > 0.14) video.currentTime = masterTime;
    });
    renderPolicyAtTime(masterTime);
  });
  masterVideo.addEventListener('seeking', () => renderPolicyAtTime(masterVideo.currentTime, true));
  masterVideo.addEventListener('seeked', () => {
    const masterTime = masterVideo.currentTime;
    videos.forEach(video => { if (video !== masterVideo && video.readyState) video.currentTime = masterTime; });
    renderPolicyAtTime(masterTime, true);
  });
  videos.forEach(video => video.addEventListener('error', () => {
    placeholder.querySelector('b').textContent = 'One camera view could not be loaded.';
    placeholder.querySelector('span').textContent = 'Try another layout or refresh the preview server.';
  }));
  window.addEventListener('roboicl:selectTask', event => selectTask(event.detail.taskId));

  const params = new URLSearchParams(location.search);
  const requestedTask = taskMap.has(params.get('task')) ? params.get('task') : 'imitate_sorting_sequence';
  setPlaybackRate(params.get('speed') ?? 1, false);
  selectTask(requestedTask, params.get('layout') ?? 0);
}

fetch('assets/data/benchmark-rollouts.json?v=20260928-rollouts-v9')
  .then(response => {
    if (!response.ok) throw new Error(`Manifest request failed: ${response.status}`);
    return response.json();
  })
  .then(initializeRolloutExplorer)
  .catch(error => {
    const summary = document.querySelector('[data-rollout-summary]');
    const placeholder = document.querySelector('[data-rollout-placeholder]');
    if (summary) summary.textContent = 'Layout manifest unavailable';
    if (placeholder) {
      placeholder.hidden = false;
      placeholder.querySelector('b').textContent = 'The rollout manifest could not be loaded.';
      placeholder.querySelector('span').textContent = 'Serve this directory over HTTP rather than opening index.html directly.';
    }
    console.warn(error);
  });
