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

    var letter = e.key.toLowerCase();
    if (!/^[a-z]$/.test(letter)) return;

    var key = document.querySelector('.key[data-letter="' + letter + '"]');
    if (key) key.classList.add('is-pressed');

    if (!openLetter) {
      open(letter);
    }
  });

  document.addEventListener('keyup', function (e) {
    var phys = physKey(codeOf(e));
    if (phys) phys.classList.remove('is-pressed');

    var letter = e.key.toLowerCase();
    if (!/^[a-z]$/.test(letter)) return;
    var key = document.querySelector('.key[data-letter="' + letter + '"]');
    if (key) key.classList.remove('is-pressed');
  });
})();
