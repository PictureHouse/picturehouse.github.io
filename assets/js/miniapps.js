(function () {
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
    // 팝업을 닫으면 재생 중인 소개 영상도 멈춘다
    modal.querySelectorAll('video').forEach(function (v) { v.pause(); });
    modal.hidden = true;
    openLetter = null;
    document.body.style.overflow = '';
  }

  // 키캡 클릭 → 팝업 (Web Projects 카드는 data-modal-open으로 같은 팝업을 연다)
  document.querySelectorAll('.key--active[data-letter], [data-modal-open]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      open(trigger.dataset.letter || trigger.dataset.modalOpen);
    });
  });

  // 백드롭 / 닫기 버튼
  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) close();
  });

  // 키보드 화면이 없는 페이지(Web Projects)는 Escape로 닫기만 지원
  if (!document.querySelector('.keyboard')) {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openLetter) close();
    });
    return;
  }

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

    // 왼쪽 ctrl·opt → 해당 미니앱 모달 (수식키 판별보다 먼저 처리)
    var modLetter = { ControlLeft: 'ctrl', AltLeft: 'opt' }[code];
    if (modLetter && !openLetter) {
      var modKey = document.querySelector('.key--active[data-letter="' + modLetter + '"]');
      if (modKey) {
        e.preventDefault();
        open(modLetter);
        return;
      }
    }

    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === 'Escape' && openLetter) {
      close();
      return;
    }

    // 스페이스바 → 메인 화면
    if (code === 'Space' && !openLetter) {
      e.preventDefault();
      var space = physKey('Space');
      if (space && space.href) window.location.href = space.href;
      return;
    }

    // 오른쪽 shift → 2048 게임
    if (code === 'ShiftRight' && !openLetter) {
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
