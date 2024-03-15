<p align="center">
  <a href="#">
      <img src="https://fonts-archive.s3.ap-northeast-2.amazonaws.com/logo_squared.png" height="120">
      <h1 align="center">폰트 아카이브</h1>
  </a>
  <p align="center">
    <img src="https://img.shields.io/badge/Compatible%20with-Node%20v18.+-%2337873A"/>
    <img src="https://img.shields.io/badge/Protected%20under-GPL%20v3.0-blue"/>
  </p>
</p>

&nbsp;

## 개요

상업용으로 무료로 사용할 수 있는 폰트를 저장해둔 사이트입니다. 다른 사이트와 다른 점이 있다면 웹 폰트 정리가 잘 되어 있습니다.

&nbsp;

## 바로가기

[웹사이트](https://fonts.taedonn.com) · [깃허브 프로젝트](https://github.com/fonts-archive) · [이메일 양식](https://github.com/taedonn/fonts-archive-email-template)

&nbsp;

## Serverless architecture 구성도

Serverless architecture를 구현하기 위해 Next.js와 Vercel을 선택했습니다.

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

## CDN 서버

CDN 서버는 GitHub, NPM과 연동해서 사용할 수 있는 jsDelivr 서버를 사용했습니다.

![CDN Server](https://fonts-archive.s3.ap-northeast-2.amazonaws.com/readme-cdn-server.svg)

&nbsp;

## 개발 프로세스

개발 프로세스는 애자일(Agile) 방식으로 진행했습니다.

애자일 방식의 이점

- 사용자들의 요구를 신속하게 반영
- 빠르게 결함 식별 및 수정 가능
- 개발 과정이 빠르고 유연

&nbsp;

## 라이센스

This project is licensed under GNU General Public License v3.0.

[라이센스 전문](https://www.gnu.org/licenses/gpl-3.0.html)
