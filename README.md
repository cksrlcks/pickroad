![Logo](https://github.com/user-attachments/assets/bac0ca5e-6e1d-48e0-b559-a40e97bc059d)

#### 즐겨찾기를 재해석한 나만의 로드맵 공유 플랫폼

PickRoad는 블로그, 유튜브 등 다양한 링크를 모아 큐레이션하고, 이를 하나의 로드맵으로 정리하여 공유할 수 있는 웹 서비스입니다. 단순한 즐겨찾기를 넘어, 자신만의 학습 흐름이나 관심 주제를 체계적으로 정리해 보여줄 수 있도록 설계되었습니다.

<h4>
  <a href="https://pick-road.com/">Pick Road Site</a>
</h4>

---

## Purpose

이 프로젝트는 Next.js의 Server Action과 SSR(Server-Side Rendering) 기능을 실습하고, 실제 서비스 수준의 데이터 흐름을 구현해보는 것을 목표로 제작되었습니다.

React Query와 같은 클라이언트 상태 관리 라이브러리 없이, 모든 데이터 흐름을 SSR과 Server Action 기반으로 처리하여, 서버 중심 아키텍처에 대한 실전 경험을 쌓고자 했습니다.

또한, 작은 규모이지만 데이터베이스 설계를 직접 경험해보고, 이를 바탕으로 Drizzle ORM의 사용법을 익히는 것도 중요한 목표 중 하나였습니다. 작성한 Drizzle의 DB 스키마로부터 Zod 스키마를 추출하여, 유효성 검증과 타입 연동성을 통합하는 구조를 구현한 점은 실제 서비스 개발에 필요한 기술을 체감하며 익힐 수 있었던 좋은 기회였습니다.

---

## Features

#### Drizzle ORM + Supabase PostgreSQL

Supabase의 PostgreSQL을 데이터베이스로 사용하고, Drizzle ORM을 통해 타입 안정성과 직관적인 쿼리 작성을 실현했습니다. 쿼리 함수는 서버 전용 함수로 분리하여 구성하였으며(`/data` 폴더에 구성), 이를 서버 컴포넌트에서 직접 호출하는 구조로 구현했습니다.

#### Server Actions 기반의 로드맵 CRUD

Next.js App Router 환경에서 서버 액션(Server Actions)을 활용해 로드맵 생성/수정/삭제 기능을 구현했습니다. 클라이언트에서 직접 서버 함수를 호출하는 방식으로, API 라우트 없이 깔끔하게 데이터 조작을 처리할 수 있도록 했습니다.

#### BetterAuth를 활용한 세션 기반 인증 시스템 (커스텀 카카오 로그인 포함)

인증은 BetterAuth를 사용해 세션 기반으로 구현했습니다. 특히 카카오 로그인은 BetterAuth에서 기본으로 제공되지 않기 때문에 직접 커스텀 프로바이더를 구현하여 연동했습니다. 이를 통해 원하는 방식으로 로그인 흐름을 제어하고, 서버 컴포넌트에서 세션 정보를 안전하게 사용할 수 있도록 구성했습니다.

#### SSR과 쿼리 파라미터를 활용한 상태 기반 필터링

필터 조건을 URL 쿼리 파라미터에 저장함으로써, 서버 렌더링 시점에 필터 조건이 반영되고, 사용자는 언제든지 해당 조건을 링크 형태로 공유하거나 다시 접근할 수 있습니다. 또한, 쿼리 파라미터 변경 시 새로운 데이터를 패칭하는 동안 useTransition과 useOptimistic을 활용해 부드럽고 끊김 없는 사용자 경험을 제공하도록 구현했습니다.

#### Cloudflare R2 Presigned URL 업로드

사용자가 이미지를 업로드하면, 폼 제출 시점에 서버 액션을 통해 Presigned URL을 발급받고, 해당 URL로 클라이언트에서 Cloudflare R2에 직접 업로드가 이루어지도록 구성했습니다. (서버의 업로드 용량 제한을 우회하고, R2로 안전하게 파일을 전송하기 위한 구조)

#### 동적으로 구성되는 정렬 가능한 링크 입력 폼 (useFieldArray)

링크를 입력하면 서버 액션을 통해 Open Graph 메타데이터를 수집하고, 이를 기반으로 새로운 입력 필드가 자동 생성됩니다. 이 동적 필드는 react-hook-form의 **useFieldArray**를 사용해 구성되며, 생성/삭제/순서 변경이 모두 가능합니다. 정렬은 DnDKit과 motion을 활용해 자연스럽고 부드러운 애니메이션으로 처리했습니다.

---

## Stacks

- next.js
- typescript
- drizzle ORM
- better-auth
- tailwind css
- shadcn

---

## Quick Start

### Installation

```
$ npm install
$ npm run dev
```
