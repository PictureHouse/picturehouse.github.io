# picturehouse.github.io

Jekyll 기반 개인 프로젝트 소개 사이트. GitHub Pages가 자동으로 빌드하므로 파일을 push하면 바로 배포됩니다.

## 구조

| 경로 | 역할 |
|---|---|
| `_data/miniapps.yml` | 미니앱 목록 → `/mini-apps/` 키보드 UI에 반영 |
| `_services/*.md` | 서비스(미니앱이 아닌 앱) 랜딩 페이지 (파일당 앱 1개, 상단 탭 자동 생성) |
| `_privacy/*.md` | 개인정보처리방침 (파일당 앱 1개) |
| `assets/icons/mini/` | 미니앱 아이콘 |
| `assets/icons/big/` | 서비스 아이콘·스크린샷 |

## 콘텐츠 추가 방법

### 새 미니앱 추가

1. 아이콘을 `assets/icons/mini/<알파벳>.png`(또는 svg)로 업로드
2. `_data/miniapps.yml`에 항목 추가:

```yaml
- letter: b
  name: Bloom
  tagline: 한 줄 소개
  icon: /assets/icons/mini/b.png
  store_url: https://apps.apple.com/...
  privacy: bloom            # 방침이 있으면 _privacy/bloom.md 생성 후 지정
```

### 새 서비스(탭) 추가

`_services/앱이름.md` 생성 — front matter에 `name`, `order`(탭 순서), `tagline`, `icon`, 스토어 링크, `screenshots` 목록을 적고, 본문에는 마크다운으로 소개를 작성합니다. 탭은 자동으로 추가됩니다.

### 개인정보처리방침 추가/개정

한국어 문서는 `_privacy/앱이름.md`, 영어 문서는 `_privacy/앱이름-en.md`로 **언어별 파일을 따로** 만듭니다.
같은 `app` 값을 가진 문서가 둘 이상이면 페이지 상단에 `한국어 / English` 전환 버튼이 자동으로 표시됩니다.
(한 언어만 있으면 버튼은 나타나지 않습니다.)

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
# _privacy/bloom-en.md — 영어
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
- 영어: `https://picturehouse.github.io/privacy/앱이름/en/`

`_data/miniapps.yml`과 `_services/*.md`의 `privacy:` 값에는 **앱 키만** 적으면 되고, 링크는 한국어 문서로 연결됩니다.

## 로컬 미리보기

```sh
bundle install
bundle exec jekyll serve
```
