(function () {
  /* 이스터에그: ctrl 키 → F1 Circuit 게임 팝업 창 */
  var f1Egg = document.querySelector('[data-easter="f1"]');

  // iframe 임베드 대신 팝업 창으로 연다 — 게임이 localStorage를 쓰기 때문에
  // 서드파티 컨텍스트(iframe)에서는 브라우저가 저장소를 막아 화면이 뜨지 않는다.
  // 클릭과 키보드 입력이 같은 경로를 타도록 하나의 함수로 처리한다.
  function openF1Circuit() {
    if (!f1Egg) return;
    var url = f1Egg.href;
    var w = Math.min(1024, Math.max(360, window.screen.availWidth - 120));
    var h = Math.min(720, Math.max(320, window.screen.availHeight - 160));
    var left = Math.round((window.screen.availWidth - w) / 2);
    var top = Math.round((window.screen.availHeight - h) / 2);
    var win = window.open(
      url, 'f1-circuit',
      'popup=yes,width=' + w + ',height=' + h + ',left=' + left + ',top=' + top
    );
    // 팝업 창이 막히면 새 탭으로, 새 탭도 막히면 현재 탭에서 연다
    if (!win) win = window.open(url, '_blank');
    if (!win) {
      window.location.href = url;
      return;
    }
    win.focus();
  }

  if (f1Egg) {
    f1Egg.addEventListener('click', function (e) {
      e.preventDefault();
      openF1Circuit();
    });
  }

  var modal = document.getElementById('miniapp-modal');
  if (!modal) return;

  var cards = modal.querySelectorAll('[data-modal-letter]');
  var openLetter = null;

  function cardFor(letter) {
    return modal.querySelector('[data-modal-letter="' + letter + '"]');
  }

  function open(letter) {
    var card = cardFor(letter);
    if (!card) return;
    cards.forEach(function (c) { c.hidden = true; });
    card.hidden = false;
    modal.hidden = false;
    openLetter = letter;
    document.body.style.overflow = 'hidden';
    var closeBtn = card.querySelector('.miniapp-modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    modal.hidden = true;
    openLetter = null;
    document.body.style.overflow = '';
  }

  // 키캡 클릭 → 팝업
  document.querySelectorAll('.key--active[data-letter]').forEach(function (key) {
    key.addEventListener('click', function () {
      open(key.dataset.letter);
    });
  });

  // 백드롭 / 닫기 버튼
  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) close();
  });

  function physKey(code) {
    return document.querySelector('.key[data-phys="' + code + '"]');
  }

  // e.code가 비어 있는 환경(합성 이벤트 등)을 위해 key/keyCode/location으로 보정
  function codeOf(e) {
    if (e.code) return e.code;
    var side = e.location === 2 ? 'Right' : 'Left';
    switch (e.key) {
      case 'Shift': return 'Shift' + side;
      case 'Control': return 'Control' + side;
      case 'Alt': return 'Alt' + side;
      case 'Meta': return 'Meta' + side;
      case ' ': return 'Space';
    }
    switch (e.keyCode) {
      case 32: return 'Space';
      case 16: return 'Shift' + side;
      case 17: return 'Control' + side;
      case 18: return 'Alt' + side;
      case 91: return 'MetaLeft';
      case 93: return 'MetaRight';
      default: return '';
    }
  }

  // 물리 키 위치(e.code) 기준 알파벳 판별 — 한글 등 다른 자판에서도 동작
  function letterOf(e) {
    if (/^Key[A-Z]$/.test(e.code)) return e.code.charAt(3).toLowerCase();
    if (/^[a-zA-Z]$/.test(e.key)) return e.key.toLowerCase();
    return '';
  }

  // 실제 키보드 입력: 화면의 키캡을 누르는 효과 + 키별 동작
  document.addEventListener('keydown', function (e) {
    // 화면 키캡 눌림 효과 (수식키 포함)
    var code = codeOf(e);
    var phys = physKey(code);
    if (phys) phys.classList.add('is-pressed');

    var gameModal = document.getElementById('game-modal');
    var gameOpen = gameModal && !gameModal.hidden;
    // 2048 게임이 열려 있으면 게임 쪽에서 키를 처리
    if (gameOpen) return;

    // 키를 누르고 있는 동안의 자동 반복은 무시 (팝업이 여러 번 열리는 것 방지)
    if (e.repeat) return;

    // 왼쪽 ctrl → F1 Circuit 게임 (수식키 판별보다 먼저 처리)
    if (code === 'ControlLeft' && !openLetter) {
      e.preventDefault();
      openF1Circuit();
      return;
    }

    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === 'Escape' && openLetter) {
      close();
      return;
    }

    // 스페이스바 → Info 탭
    if (code === 'Space' && !openLetter) {
      e.preventDefault();
      var space = physKey('Space');
      if (space && space.href) window.location.href = space.href;
      return;
    }

    // 왼쪽 shift → 2048 게임
    if (code === 'ShiftLeft' && !openLetter) {
      var egg = document.querySelector('[data-easter="2048"]');
      if (egg) egg.click();
      return;
    }

    var letter = letterOf(e);
    if (!letter) return;

    var key = document.querySelector('.key[data-letter="' + letter + '"]');
    if (key) key.classList.add('is-pressed');

    if (!openLetter) {
      open(letter);
    }
  });

  document.addEventListener('keyup', function (e) {
    var phys = physKey(codeOf(e));
    if (phys) phys.classList.remove('is-pressed');

    var letter = letterOf(e);
    if (!letter) return;
    var key = document.querySelector('.key[data-letter="' + letter + '"]');
    if (key) key.classList.remove('is-pressed');
  });
})();
