---
name: Neckle
tab: Neckle            # 탭에 표시될 이름 (생략 시 name 사용)
order: 1               # 탭 정렬 순서
tagline: AirPods과 함께하는 간단한 목 운동
icon: /assets/icons/big/neckle.png
appstore_url: https://apps.apple.com/kr/app/neckle/id6742444201
github_url: https://github.com/PictureHouse/Neckle
privacy: neckle        # 개인정보처리방침 앱 키 (_privacy/neckle.md · neckle-en.md)
# screenshots:
#   - /assets/icons/big/neckle-shot-1.png
#   - /assets/icons/big/neckle-shot-2.png
---

## 소개

Neckle은 누구나 쉽게 목 운동을 할 수 있도록 도와주는 앱입니다.
AirPods을 착용하고 음성 안내에 따라 고개를 움직이면, AirPods의 모션 센서가
머리의 움직임을 인식해 운동을 올바르게 수행했는지 확인해줍니다.

**🍎 WWDC25 Swift Student Challenge Winner** 수상작으로, 이후 App Store에 정식 출시했습니다.

## 주요 기능

- AirPods의 모션 센서(CoreMotion)로 머리 움직임을 인식하는 인터랙티브 목 운동
- 음성 안내(AVFoundation)에 따라 화면을 보지 않고도 운동 가능
- 한 번 착용한 AirPods을 자동으로 기억하는 간편한 연결
- 한국어·영어·일본어·중국어·독일어·이탈리아어·스페인어·포르투갈어 등 8개 언어 지원

## 지원 환경

- iOS 17.0+ / iPadOS 17.0+ / macOS 14.0+ (Apple Silicon) / visionOS 1.0+
- 모션 인식이 가능한 AirPods (AirPods Pro, AirPods 3세대 이상 등)

## 기술

SwiftUI · CoreMotion · AVFoundation — Xcode App Playground로 개발했습니다.
