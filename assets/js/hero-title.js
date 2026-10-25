(function () {
  var targets = document.querySelectorAll('[data-cursor-letters]');
  if (!targets.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var RADIUS = 140;      // 커서 영향 반경(px)
  var PUSH = 0.18;       // 최대 밀려나는 거리(글자 크기 대비 비율)
  var PUSH_MIN = 5;      // 작은 글자도 움직임이 보이도록 하는 최소 거리(px)
  var TILT = 8;          // 최대 기울기(deg)
  var EASE = 0.14;       // 목표 위치로 따라가는 속도
  var DECAY = 0.93;      // 커서가 멈추면 힘이 줄어드는 비율(프레임당)

  var letters = [];

  // 텍스트 노드를 단어(nowrap) > 글자(span) 단위로 쪼갠다. <br>, <em> 등 요소는 유지
  function split(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 1) { split(child); return; }
      if (child.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        var word = document.createElement('span');
        word.className = 'cursor-letters__word';
        word.setAttribute('aria-hidden', 'true');
        Array.prototype.forEach.call(part, function (ch) {
          var el = document.createElement('span');
          el.className = 'cursor-letters__char';
          el.textContent = ch;
          word.appendChild(el);
          letters.push({ el: el, cx: 0, cy: 0, push: 0, x: 0, y: 0, r: 0 });
        });
        frag.appendChild(word);
      });
      node.replaceChild(frag, child);
    });
  }

  Array.prototype.forEach.call(targets, function (target) {
    // 스크린리더에는 쪼개지 않은 원문을 따로 읽힌다
    var plain = target.cloneNode(true);
    plain.querySelectorAll('br').forEach(function (br) { br.replaceWith(' '); });
    var label = document.createElement('span');
    label.className = 'sr-only';
    label.textContent = plain.textContent.replace(/\s+/g, ' ').trim();

    split(target);
    target.appendChild(label);
  });

  // 각 글자의 기준(변형 전) 중심 좌표를 문서 기준으로 기록
  function measure() {
    letters.forEach(function (l) { l.el.style.transform = ''; });
    letters.forEach(function (l) {
      var rect = l.el.getBoundingClientRect();
      l.cx = rect.left + rect.width / 2 + window.scrollX;
      l.cy = rect.top + rect.height / 2 + window.scrollY;
      l.push = Math.max(PUSH_MIN, parseFloat(getComputedStyle(l.el).fontSize) * PUSH);
    });
    letters.forEach(apply);
  }

  function apply(l) {
    l.el.style.transform = 'translate(' + l.x.toFixed(2) + 'px,' + l.y.toFixed(2) + 'px) rotate(' + l.r.toFixed(2) + 'deg)';
  }

  var mouseX = 0;
  var mouseY = 0;
  var energy = 0;
  var running = false;

  function tick() {
    energy *= DECAY;
    var moving = false;

    letters.forEach(function (l) {
      var dx = l.cx - mouseX;
      var dy = l.cy - mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      var tx = 0;
      var ty = 0;
      var tr = 0;
      if (dist < RADIUS) {
        // 가까울수록 강하게, 반경 끝에서는 0이 되도록 부드럽게 감쇠
        var f = Math.pow(1 - dist / RADIUS, 2) * energy;
        tx = (dx / dist) * l.push * f;
        ty = (dy / dist) * l.push * f;
        tr = (dx / dist) * TILT * f;
      }
      l.x += (tx - l.x) * EASE;
      l.y += (ty - l.y) * EASE;
      l.r += (tr - l.r) * EASE;
      if (Math.abs(l.x) > 0.05 || Math.abs(l.y) > 0.05 || Math.abs(l.r) > 0.05) moving = true;
      else { l.x = 0; l.y = 0; l.r = 0; }
      apply(l);
    });

    if (moving || energy > 0.01) {
      requestAnimationFrame(tick);
    } else {
      running = false;
    }
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
    energy = 1;
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  });

  measure();
  window.addEventListener('resize', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
})();
