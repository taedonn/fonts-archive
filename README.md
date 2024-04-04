<p align="center">
  <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/logo_squared.png"  alt="로고" align="center" height="120">
  <h1 align="center">폰트 아카이브</h1>
  <p align="center">
    <img src="https://img.shields.io/badge/node-v18.+-%231B73E7" alt="Node version badge"/> 
    <img src="https://img.shields.io/github/v/release/taedonn/fonts-archive?color=1B73E7" alt="Release badge"/>
    <img src="https://img.shields.io/github/release-date/taedonn/fonts-archive?color=1B73E7" alt="Release date badge"/>
    <img src="https://img.shields.io/badge/license-GPL%20v3.0-%231B73E7" alt="License badge"/>
  </p>
</p>

&nbsp;

## 폰트 아카이브의 주요 기능

### 🌐 웹 폰트 링크 제공

> 웹 폰트에 사용되는 CDN 링크는 Github과 NPM을 통해 제작하고 있으며, `@font-face`, `@import`, `<link/>` 3가지 형식으로 제공하고 있습니다. 하지만 원작자가 재배포를 허락하지 않는 경우 웹 폰트 링크도 재배포의 한 형태로 판단해 링크를 제공하지 않고 있으니, 이용에 참고 부탁드립니다. 또한 폰트의 라이센스가 변경되거나, 원작자의 요청이 있을 경우 제공은 중지될 수 있습니다.

<table align=center>
  <tr>
    <td>
      <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/readme_webfont.png" alt="Show webfont"/>
    </td>
    <td>
      <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/readme_webfont_hide.png" alt="Hide webfont"/>
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
      <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/readme_webfont_structure.svg" alt="Webfont structure"/>
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

<table align=center>
  <tr>
    <td>
      <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/readme_font_search.gif" alt="Font searching"/>
    </td>
    <td>
      <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/readme_font_filtering.gif" alt="Font filtering"/>
    </td>
  </tr>
  <tr>
    <td>
      <p align=center>폰트 검색</p>
    </td>
    <td>
      <p align=center>목록 필터링</p>
    </td>
  </tr>
</table>

&nbsp;

### 🖋️ 문구 및 스타일 변경

> 폰트 미리보기에서 문구와 색상 / 크기 / 자간 / 행간 등을 조정해 내가 사용하기에 적합한 폰트인지 미리 확인할 수 있습니다.

<table align=center>
  <tr>
    <td>
      <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/readme_change_size.gif" alt="Change size"/>
    </td>
    <td>
      <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/readme_change_color.gif" alt="Change color"/>
    </td>
  </tr>
  <tr>
    <td>
      <p align=center>크기 변경</p>
    </td>
    <td>
      <p align=center>색상 변경</p>
    </td>
  </tr>
</table>

&nbsp;

### 💙 댓글, 좋아요

> 로그인 시 댓글, 좋아요를 통해 마음에 든 폰트를 저장하고 기록할 수 있습니다. 작성한 댓글과 좋아요는 별도의 목록을 통해 확인할 수 있습니다.

<table align=center>
  <tr>
    <td>
      <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/readme_type_comment.gif" alt="Comment"/>
    </td>
    <td>
      <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/readme_type_like.gif" alt="Like"/>
    </td>
  </tr>
  <tr>
    <td>
      <p align=center>댓글</p>
    </td>
    <td>
      <p align=center>좋아요</p>
    </td>
  </tr>
</table>

&nbsp;

## 아키텍쳐

### 🧬 Serverless framework

> Next.js와 Next.js에서 기본 제공하는 SSR 기능을 사용해 별도의 서버를 두지 않고 운영하고 있습니다. 따라서 사용하는 인원이 한 동안 없었던 경우 부팅하는데 몇초의 시간이 걸릴 수 있습니다.

### 🛢 Database

> 데이터베이스는 AWS RDS for MySQL을 사용하고 있고, Node.js와 TypeScript 환경에 적합한 Prisma CLI를 사용해 데이터베이스에 접근하고 있습니다.

### 🪣 Storage

> 스토리지는 AWS S3를 사용하고 있고, aws-sdk에서 제공하는 `client-s3`와 `s3-request-presigner`를 사용해 AWS S3의 파일을 관리하고 있습니다.

<table align=center>
  <tr>
    <td>
      <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/readme_serverless_structure.svg" alt="Serverless structure"/>
    </td>
  </tr>
  <tr>
    <td>
      <p align=center>서비스 구성도</p>
    </td>
  </tr>
</table>

&nbsp;

## 기술 스택

<table>
  <thead>
    <tr>
      <th>category</th>
      <th>stacks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p align=center>Common</p>
      </td>
      <td>
        <img src="https://img.shields.io/badge/node-3C873A?logo=node.js&logoColor=ffffff" alt="Node badge"/>
        <img src="https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=ffffff" alt="NPM badge"/>
        <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000000" alt="JavaScript badge"/>
        <img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=ffffff" alt="TypeScript badge"/>
      </td>
    </tr>
    <tr>
      <td>
        <p align=center>Frontend</p>
      </td>
      <td>
        <img src="https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=ffffff" alt="Next.js badge"/>
        <img src="https://img.shields.io/badge/JSON%20Web%20Tokens-000000?logo=data:image/svg%2bxml;base64,PHN2ZyBoZWlnaHQ9IjI1MDAiIHZpZXdCb3g9Ii40IC4zIDk5LjcgMTAwIiB3aWR0aD0iMjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Im01Ny44IDI3LjItLjEtMjYuOWgtMTVsLjEgMjYuOSA3LjUgMTAuM3ptLTE1IDQ2LjF2MjdoMTV2LTI3bC03LjUtMTAuM3oiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJtNTcuOCA3My4zIDE1LjggMjEuOCAxMi4xLTguOC0xNS44LTIxLjgtMTIuMS0zLjl6bS0xNS00Ni4xLTE1LjktMjEuOC0xMi4xIDguOCAxNS44IDIxLjggMTIuMiAzLjl6IiBmaWxsPSIjMDBmMmU2Ii8+PHBhdGggZD0ibTMwLjYgMzYtMjUuNi04LjMtNC42IDE0LjIgMjUuNiA4LjQgMTIuMS00em0zMS44IDE4LjIgNy41IDEwLjMgMjUuNiA4LjMgNC42LTE0LjItMjUuNi04LjN6IiBmaWxsPSIjMDBiOWYxIi8+PHBhdGggZD0ibTc0LjUgNTAuMyAyNS42LTguNC00LjYtMTQuMi0yNS42IDguMy03LjUgMTAuM3ptLTQ4LjUgMC0yNS42IDguMyA0LjYgMTQuMiAyNS42LTguMyA3LjUtMTAuM3oiIGZpbGw9IiNkNjNhZmYiLz48cGF0aCBkPSJtMzAuNiA2NC41LTE1LjggMjEuOCAxMi4xIDguOCAxNS45LTIxLjh2LTEyLjd6bTM5LjMtMjguNSAxNS44LTIxLjgtMTIuMS04LjgtMTUuOCAyMS44djEyLjd6IiBmaWxsPSIjZmIwMTViIi8+PC9nPjwvc3ZnPg==" alt="JSON Web Tokens badge"/>
        <img src="https://img.shields.io/badge/Tailwind%20CSS-38BDF8?logo=tailwindcss&logoColor=ffffff" alt="Tailwind CSS badge"/>
        <img src="https://img.shields.io/badge/MUI-007FFF?logo=mui&logoColor=ffffff" alt="MUI badge"/>
        <img src="https://img.shields.io/badge/Framer-0055FF?logo=framer&logoColor=ffffff" alt="Framer badge"/>
      </td>
    </tr>
    <tr>
      <td>
        <p align=center>Backend</p>
      </td>
      <td>
        <img src="https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=ffffff" alt="MySQL badge"/>
        <img src="https://img.shields.io/badge/Amazon%20RDS-527FFF?logo=amazonrds&logoColor=ffffff" alt="Amazon RDS badge"/>
        <img src="https://img.shields.io/badge/Amazon%20S3-569A31?logo=amazons3&logoColor=ffffff" alt="Amazon S3 badge"/>
        <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=ffffff" alt="Prisma badge"/>
      </td>
    </tr>
    <tr>
      <td>
        <p align=center>Deployment</p>
      </td>
      <td>
        <img src="https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=ffffff" alt="Vercel badge"/>
        <img src="https://img.shields.io/badge/Amazon%20AWS-FF9900?logo=amazonaws&logoColor=ffffff" alt="Amazon AWS badge"/>
        <img src="https://img.shields.io/badge/Google%20Cloud%20Platform-4285F4?logo=google&logoColor=ffffff" alt="Google Cloud Platform badge"/>  
      </td>
    </tr>
    <tr>
      <td>
        <p align=center>CI/CD</p>
      </td>
      <td>
        <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?logo=github-actions&logoColor=ffffff" alt="Github Actions badge"/>
        <img src="https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?logo=visualstudiocode&logoColor=ffffff" alt="Visual Studio Code badge"/>
      </td>
    </tr>
  </tbody>
</table>

&nbsp;

## 바로가기

[홈페이지](https://fonts.taedonn.com)

[문의하기](https://fonts.taedonn.com/issue)

[공지사항](https://fonts.taedonn.com/notices)

[이메일 템플릿](https://github.com/taedonn/fonts-archive-email-template)

[깃허브 프로젝트](https://github.com/fonts-archive)

&nbsp;

## 라이센스

GPL v3.0 © 2023-PRESENT 태돈

[라이센스 전문](https://www.gnu.org/licenses/gpl-3.0.html)
