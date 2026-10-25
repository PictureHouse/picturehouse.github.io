# picturehouse.github.io

Jekyll 기반 개인 프로젝트 소개 사이트. GitHub Pages가 자동으로 빌드하므로 파일을 push하면 바로 배포됩니다.

## 구조

| 경로 | 역할 |
|---|---|
| `_data/miniapps.yml` | 미니앱 목록 → `/mini-apps/` 키보드 UI에 반영 |
| `_data/webprojects.yml` | 웹 프로젝트 목록 → `/web-projects/` 카드 UI에 반영 |
| `_includes/web-art/*.html` | 웹 프로젝트 카드 일러스트 (프로젝트 `id`별 SVG) |
| `_services/*.md` | 서비스(미니앱이 아닌 앱) 랜딩 페이지 (파일당 앱 1개, 상단 탭 자동 생성) |
| `_privacy/*.md` | 개인정보처리방침 (파일당 앱 1개) |
| `_terms/*.md` | 이용약관 (파일당 앱 1개, 개인정보처리방침과 같은 방식) |
| `assets/icons/mini/` | 미니앱 아이콘 |
| `assets/icons/web/` | 웹 프로젝트 아이콘 |

## 콘텐츠 추가 방법

### 새 미니앱 추가

1. 아이콘을 `assets/icons/mini/<알파벳>.png`(또는 svg)로 업로드
2. `_data/miniapps.yml`에 항목 추가:

```yaml
- letter: b
  name: Bloom
  tagline: 한 줄 소개
  icon: /assets/icons/mini/b.png
  platforms: [iOS, Web]
  store_url: https://apps.apple.com/...   # iOS·iPadOS·macOS 태그 → App Store
  web_url: https://...                     # Web 태그 → 웹페이지
  # toss_url: https://...                  # Toss 태그 → 미니앱
  github_url: https://github.com/...       # 하단 버튼
  privacy: bloom            # 방침이 있으면 _privacy/bloom.md 생성 후 지정 (하단 버튼)
  terms: bloom              # 약관이 있으면 _terms/bloom.md 생성 후 지정 (하단 버튼)
  # terms_url: https://...                 # 외부 약관 링크를 쓸 때 (terms가 없을 때만)
```

플랫폼 태그는 링크가 있으면 클릭 시 해당 링크로 이동합니다. 하단 버튼(GitHub · 개인정보처리방침 · 이용약관)은 값이 있을 때만 표시됩니다.

`letter`에 `ctrl` · `opt`를 쓰면 키보드 하단 왼쪽 ctrl · opt 키에 배치됩니다 (현재 ctrl = Neckle, opt = 집가고싶다).

### 새 웹 프로젝트 추가

1. 아이콘을 `assets/icons/web/<id>.png`로 업로드
2. `_data/webprojects.yml`에 항목 추가 (`id`, `name`, `tagline`, `kicker`, `icon`, `url`, `platforms: [Web]`, `theme`의 `bg`·`accent`·`on_accent`, `chips`, `description`)
3. 카드 일러스트를 `_includes/web-art/<id>.html`에 SVG로 작성 — 기존 파일처럼 `include.uid`로 id를 접두하고, 팝업 배너에서 잘리지 않도록 배경은 좌우로 넉넉히(`x="-600" width="1600"`) 깔아둡니다.

### 새 서비스(탭) 추가

`_services/앱이름.md` 생성 — front matter에 `name`, `order`(탭 순서), `tagline`, `icon`, `platforms`와 플랫폼 링크(`appstore_url`·`web_url`·`toss_url`), 하단 버튼 링크(`github_url`·`privacy`·`terms`·`terms_url`), `screenshots` 목록, `media`(본문 상단 이미지/영상 1개, `assets/media/`에 파일이 있을 때만 표시 — 미니앱은 `_data/miniapps.yml`에 동일하게 지정)를 적고, 본문에는 마크다운으로 소개를 작성합니다. 탭은 자동으로 추가됩니다.

### 개인정보처리방침 추가/개정

한국어 문서는 `_privacy/앱이름.md`, 영어 문서는 `_privacy/앱이름-en.md`로 **언어별 파일을 따로** 만듭니다.
**필요한 언어만 만들면 됩니다.**

- 한 언어만 있으면 → 그 문서만 보이고 전환 버튼은 나타나지 않습니다.
- 두 언어가 다 있으면 → 페이지 상단에 `한국어 / English` 전환 버튼이 자동으로 표시됩니다.

묶는 기준은 `app` 값입니다. 나중에 다른 언어를 추가할 때도 `app`만 같게 맞추면 버튼이 알아서 생깁니다.

```yaml
# _privacy/bloom.md — 한국어
---
title: Bloom 개인정보처리방침
app: bloom               # 언어별 문서를 묶는 키 (같은 앱이면 동일하게)
app_name: Bloom
lang: ko
updated: 2026-09-06      # 개정일
---
```

```yaml
# _privacy/bloom-en.md — 영어 (필요할 때만)
---
title: Bloom Privacy Policy
app: bloom
app_name: Bloom
lang: en
updated: 2026-09-06
permalink: /privacy/bloom/en/   # 영어 문서는 permalink를 직접 지정
---
```

개정할 때는 `updated`를 갱신하세요. 공개 URL은 아래와 같으며 스토어 심사 제출용으로 사용 가능합니다.

- 한국어: `https://picturehouse.github.io/privacy/앱이름/`
- 영어: `https://picturehouse.github.io/privacy/앱이름/en/` (영어 문서를 만든 경우)

`_data/miniapps.yml`과 `_services/*.md`의 `privacy:` 값에는 **앱 키만** 적으면 되고, 링크는 한국어 문서로 연결됩니다.

### 이용약관 추가/개정

개인정보처리방침과 똑같은 방식입니다. `_terms/앱이름.md`(한국어), `_terms/앱이름-en.md`(영어, `permalink: /terms/앱이름/en/`)를 만들고 `app` 값으로 묶습니다. 두 언어가 있으면 전환 버튼이 자동으로 생깁니다.

- 한국어: `https://picturehouse.github.io/terms/앱이름/`
- 영어: `https://picturehouse.github.io/terms/앱이름/en/`

`_data/miniapps.yml` 등의 `terms:` 값에 **앱 키만** 적으면 하단 이용약관 버튼이 한국어 문서로 연결됩니다.

## 로컬 미리보기

```sh
bundle install
bundle exec jekyll serve
```
