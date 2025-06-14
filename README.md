
![Sequence 01_1](https://github.com/user-attachments/assets/340cc854-51c8-4305-9ed9-919a644d377d)

#### 즐겨찾기를 재해석한 나만의 로드맵 공유 플랫폼

PickRoad는 블로그, 유튜브 등 다양한 링크를 모아 큐레이션하고, 이를 하나의 로드맵으로 정리하여 공유할 수 있는 웹 서비스입니다. 단순한 즐겨찾기를 넘어, 자신만의 학습 흐름이나 관심 주제를 체계적으로 정리해 보여줄 수 있도록 설계되었습니다.

<h4>
  <a href="https://pick-road.com/">Pick Road Site</a>
</h4>

---
![Group 50](https://github.com/user-attachments/assets/12bcfcb8-a111-4ca7-8444-c9b31cf90641)


## Background

어떤 주제에 대해 정보를 모아서 소개하고 싶을때, 블로그 글, 유튜브 영상, 참고 자료 등 다양한 링크를 함께 정리해서 공유하고 싶을 때가 많았습니다.

하지만 매번 이런 자료들을 소개하기 위해 새롭게 글을 쓰는 건 번거롭고 시간이 많이 들었습니다. 그래서 단순히 링크만 모아도 하나의 보기 좋은 공유 페이지로 구성되고, 내가 모은 정보들을 큐레이션 형태로 보여줄 수 있는 도구가 필요하다고 느꼈습니다.

<br>

## Service Features

✨ **로드맵 만들기** | 이미지를 넣으면 자동으로 색상을 추천해주고, 링크만 넣어도 예쁜 프리뷰 카드가 완성돼요.

☁️ **간편한 공유** | 카카오톡 공유부터 링크 복사까지, 클릭 한 번으로 누구에게나 쉽게 전달할 수 있어요.

⭐ **즐겨찾기** | 좋아요와 즐겨찾기 기능으로 마음에 드는 로드맵을 저장하고 활동을 기록해보세요.

👍 **영감 얻기** | 다른 사람의 로드맵을 보며 나만의 방향과 아이디어를 발견해보세요.

<br>

## Purpose

이 프로젝트는 Next.js의 Server Action과 SSR(Server-Side Rendering) 기능을 실습하고, 실제 서비스 수준의 데이터 흐름을 구현해보는 것을 목표로 제작되었습니다.

React Query와 같은 서버 상태 관리 라이브러리 없이, 모든 데이터 흐름을 SSR과 Server Action 기반으로 처리하여, 서버 중심 아키텍처에 대한 실전 경험을 쌓고자 했습니다.

또한, 작은 규모이지만 데이터베이스 설계를 직접 경험해보고, 이를 바탕으로 Drizzle ORM의 사용법을 익히는 것도 중요한 목표 중 하나였습니다. 작성한 Drizzle의 DB 스키마로부터 Zod 스키마를 추출하여, 유효성 검증과 타입 연동성을 통합하는 구조를 구현한 점은 실제 서비스 개발에 필요한 기술을 체감하며 익힐 수 있었던 좋은 기회였습니다.

<br>

## Features

#### Drizzle ORM + Supabase PostgreSQL

Supabase의 PostgreSQL을 데이터베이스로 사용하고, Drizzle ORM을 통해 타입 안전성과 직관적인 쿼리 작성을 구현했습니다. 쿼리 함수는 모두 서버 전용(`/data` 폴더)으로 분리하여 구성했고, 서버 컴포넌트에서 직접 호출하는 구조로 설계했습니다.

<br>

#### Server Actions 기반의 로드맵 CRUD

Next.js의 App Router 환경에서 서버 액션(Server Actions)기능을 활용해 로드맵의 생성, 수정, 삭제 기능을 구현했습니다. API 라우트를 별도로 두지 않고, 클라이언트에서 직접 서버 함수를 호출하는 구조로 간결하고 일관된 데이터 흐름을 만들었습니다.

<br>

#### BetterAuth를 활용한 세션 기반 인증 시스템 (커스텀 카카오 로그인 포함)

BetterAuth를 통해 세션 기반 인증 시스템을 구현했습니다. 특히 카카오 로그인의 경우, 기본 제공되지 않기 때문에 커스텀 프로바이더를 직접 구현해 연동하였으며,이를 통해 로그인 흐름을 유연하게 제어하고, 서버 컴포넌트 내에서도 안전하게 세션 정보를 사용할 수 있도록 구성했습니다.

<br>

#### SSR과 쿼리 파라미터를 활용한 상태 기반 필터링

필터 조건은 URL 쿼리 파라미터로 관리되며, SSR 시점에 반영되도록 구성했습니다. 이를 통해 사용자는 특정 조건의 로드맵 리스트를 언제든지 링크로 공유하거나 다시 접근할 수 있습니다. 또한 쿼리 변경 시에는 `useTransition`과 `useOptimistic`을 활용하여 부드럽고 끊김 없는 UX를 제공할 수 있도록 처리했습니다.

<br>

#### Cloudflare R2 Presigned URL 업로드

이미지 업로드는 서버 액션을 통해 Presigned URL을 발급하고, 클라이언트에서 해당 URL로 직접 업로드하도록 구성했습니다. 이를 통해 서버의 업로드 용량 제한을 피하면서, Cloudflare R2로 안정적으로 파일을 전송할 수 있는 구조를 구현했습니다.

<br>

#### 동적으로 구성되는 정렬 가능한 링크 입력 폼 (useFieldArray)

서버 액션으로 Open Graph 메타데이터를 수집한 뒤, 자동으로 링크 입력 필드를 추가합니다. 이 동적 폼은 `react-hook-form`의 `useFieldArray`로 구성되며, 생성/삭제뿐만 아니라 순서 변경까지 지원합니다. 정렬은 DnDKit과 Motion을 사용하여 드래그 시 자연스러운 애니메이션으로 처리했습니다.

<br>

## Stacks

- Next.js (App Router)
- TypeScript
- Drizzle ORM
- Supabase PostgreSQL
- BetterAuth
- Tailwind CSS
- shadcn/ui

<br>

## Details

**데이터 흐름**

- 서버 컴포넌트에서 직접 DB를 조회하고, 그 결과를 props로 하위 컴포넌트에 전달하는 구조로 설계
- SSR 관점에서 데이터는 렌더링 시점에 미리 조회되어 HTML에 포함되며, 초기 로딩 성능과 SEO 측면에서 유리함
- DB 조회 로직은 기능별로 모듈화하여 별도 함수로 분리해 재사용성을 확보함

<br>

**캐싱전략, revalidate 처리**

- React Query와 같은 클라이언트 상태 관리 도구 없이, Next.js의 `unstable_cache`를 활용해 서버 측에서 데이터를 캐싱
- 데이터 변경이 발생하는 경우, 해당 변경이 반영되어야 하는 경로에 대해 `revalidatePath`를 호출함으로써 SSR 결과를 최신 상태로 유지
- 클라이언트 캐싱이 아닌 서버 중심의 캐싱/갱신 전략을 통해 단순하면서도 일관된 데이터 흐름을 유지

<br>

**서버액션 사용방법**

- `form`의 `onSubmit` 콜백 안에서 서버 액션을 직접 호출하는 방식을 채택
- 다만 서버 액션의 반환값은 자유도가 높아 구조가 혼란스러워질 수 있어, 응답 타입을 명시적으로 정의하여 통일성 있게 사용
- payload 또한 제네릭으로 선언 가능하도록 하여, 다양한 액션에서도 재사용 가능한 유연한 구조로 설계함

---

## Troubleshooting

- [URL 파라미터로 인해 서버 컴포넌트가 다시 요청되면서 발생하는 UI 프리징 현상 해결](https://heavybear-portfolio.vercel.app/post/nextjs-filter)
- [unstable_cache에서 headers 같은 dynamic API를 사용할 수 없을 때, 정적 캐싱과 동적 처리 분리 적용건](https://heavybear-portfolio.vercel.app/post/nextjs-unstable-cache)


---
## Screenshot
![Group 50](https://github.com/user-attachments/assets/ea15ac3f-ab8a-4850-b374-0c2772dcecee)
![Group 49](https://github.com/user-attachments/assets/fdbb4bde-4314-4921-acf5-8b2d62d60d18)
![Group 51](https://github.com/user-attachments/assets/e7c64b9a-3416-4934-8ecf-4d81d196fd5a)
![Group 52](https://github.com/user-attachments/assets/dffafb7b-be88-4a33-8455-9123643da35e)
![Group 53](https://github.com/user-attachments/assets/db1f3f7f-fc1b-4b58-bebc-71c50e8260a4)


