<p align="center">
  <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/logo_squared.png"  alt="로고" align="center" height="120">
  <h1 align="center">폰트 아카이브</h1>
  <p align="center">
    <img src="https://img.shields.io/badge/Node-v18.+-%231B73E7" alt="노드 벳지"/> 
    <img src="https://img.shields.io/badge/Build-nextjs-%231B73E7" alt="빌드 뱃지"/>
    <img src="https://img.shields.io/badge/License-GPL%20v3.0-%231B73E7" alt="라이센스 뱃지"/>
  </p>
</p>

&nbsp;

## 폰트 아카이브의 주요 기능

### 🌐 웹 폰트 링크 제공

> 웹 폰트에 사용되는 CDN 링크는 Github과 NPM을 통해 제작하고 있으며, `@font-face`, `@import`, `<link/>` 3가지 형식으로 제공되고 있습니다. 하지만 원작자가 재배포를 허락하지 않는 경우, 웹 폰트 링크도 재배포의 한 형태로 판단해 링크를 제공하지 않고 있으니, 이용에 참고 부탁드립니다. 또한 폰트의 라이센스가 변경되거나, 원작자의 요청이 있을 경우 제공은 중지될 수 있습니다.

<table align=center>
  <tr>
    <td>
      <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/readme_webfont.png" alt="웹 폰트 제공 가능한 경우"/>
    </td>
    <td>
      <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/readme_webfont_hide.png" alt="웹 폰트 제공 불가능한 경우"/>
    </td>
  </tr>
  <tr>
    <td>
      <p align=center>웹 폰트를 제공하는 경우</p>
    </td>
    <td>
      <p align=center>웹 폰트 제공이 불가능한 경우</p>
    </td>
  </tr>
</table>

<table align=center>
  <tr>
    <td>
      <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/readme_webfont_structure.svg" alt="웹 폰트 구성도"/>
    </td>
  </tr>
  <tr>
    <td>
      <p align=center>웹 폰트 구성도</p>
    </td>
  </tr>
</table>

&nbsp;

### 🔍 폰트 검색 및 필터링

> 폰트명/회사명을 입력해 폰트를 검색하거나, 언어 / 폰트 타입 / 라이센스 허용 범위 별로 폰트 목록을 필터링 할 수 있습니다.

&nbsp;

### 💙 댓글, 좋아요

> 로그인 시 댓글, 좋아요를 통해 마음에 든 폰트를 저장하고 기록할 수 있습니다. 작성한 댓글과 좋아요를 누른 폰트는 별도의 목록을 통해 확인할 수 있습니다.

&nbsp;

### 🖋️ 문구 및 스타일 변경

> 폰트 미리보기에서 문구와 색상 / 크기 / 자간 / 행간 등을 조정해 내가 사용하기에 적합한 폰트인지 미리 확인할 수 있습니다.

&nbsp;

## 서비스 구성도

> Serverless architecture를 구현하기 위해 Next.js와 Vercel을 선택했습니다.

![Serverless framework](https://fonts-archive.s3.ap-northeast-2.amazonaws.com/readme-serverless-architecture.svg)

&nbsp;

## 사용 스택

- nextjs
  - Serverless framework
  - v14.1.3
- Prisma
  - Node.js and TypeScript ORM
  - v5.11.0
- MySQL
  - RDBMS
  - v8.0.35
- Vercel
  - Cloud platform
- AWS S3
  - Cloud storage
- AWS RDS
  - Cloud relational database

&nbsp;

## 바로가기

[홈페이지](https://fonts.taedonn.com)

[문의하기](https://fonts.taedonn.com/issue)

[공지사항](https://fonts.taedonn.com/notices)

[이메일 템플릿](https://github.com/taedonn/fonts-archive-email-template)

[깃허브 프로젝트](https://github.com/fonts-archive)

&nbsp;

## 라이센스

GNU v3.0 © 2023-PRESENT 태돈

[라이센스 전문](https://www.gnu.org/licenses/gpl-3.0.html)
