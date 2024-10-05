// next
import { NextSeo } from "next-seo";
import Link from "next/link";

// api
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

// components
import AdSense from "@/components/adSense";
import Footer from "@/components/footer";
import Header from "@/components/header";

const Privacy = ({ params }: any) => {
  const { theme, userAgent, user } = params;

  // 디바이스 체크
  const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

  return (
    <>
      {/* Head 부분*/}
      <NextSeo title="개인정보 처리방침 | 폰트 아카이브" />

      {/* 헤더 */}
      <Header isMac={isMac} theme={theme} user={user} />

      {/* 메인 */}
      <div className="w-full px-4 flex flex-col justify-center items-center">
        <div className="w-[45.5rem] tmd:w-full flex flex-col justify-center items-start mt-8 lg:mt-16 mb-24 lg:mb-32">
          {/* Google AdSense */}
          <div className="w-full flex">
            <AdSense
              pc={{
                style: "display: inline-block; width: 728px; height: 90px;",
                client: "ca-pub-7819549426971576",
                slot: "3707368535",
              }}
              mobile={{
                style: "display: inline-block; width: 300px; height: 100px;",
                client: "ca-pub-7819549426971576",
                slot: "1032069893",
              }}
            />
          </div>

          <div className="w-full flex mt-4 lg:mt-8 text-sm">
            <Link
              href="/terms"
              className="w-full lg:w-44 h-12 flex justify-center items-center border border-l-d dark:border-d-6 text-l-5 dark:text-d-c lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:font-medium lg:hover:underline"
            >
              서비스 이용약관
            </Link>
            <Link
              href="/privacy"
              className="w-full lg:w-44 h-12 flex justify-center items-center border-y border-r border-h-1 dark:border-f-8 bg-h-1 dark:bg-f-8 text-white dark:text-f-1 lg:hover:font-medium lg:hover:underline"
            >
              개인정보 처리방침
            </Link>
          </div>
          <h2 className="text-xl mt-20 relative text-l-2 dark:text-white font-bold">
            개인정보 처리방침
            <div className="w-full h-px bg-l-2 dark:bg-white mt-0.5"></div>
          </h2>
          <div className="w-full text-sm flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between mt-6 p-6 lg:p-8 border border-l-5 dark:border-d-c text-l-5 dark:text-d-c">
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
              <Link
                href="/privacy#article1"
                className="lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2"
              >
                제 1 조 (목적)
              </Link>
              <Link
                href="/privacy#article2"
                className="lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2"
              >
                제 2 조 (처리 및 보유 기간)
              </Link>
              <Link
                href="/privacy#article3"
                className="lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2"
              >
                제 3 조 (처리하는 항목)
              </Link>
              <Link
                href="/privacy#article4"
                className="lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2"
              >
                제 4 조 (제3자 제공)
              </Link>
              <Link
                href="/privacy#article5"
                className="lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2"
              >
                제 5 조 (위탁)
              </Link>
            </div>
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
              <Link
                href="/privacy#article6"
                className="lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2"
              >
                제 6 조 (파기)
              </Link>
              <Link
                href="/privacy#article7"
                className="lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2"
              >
                제 7 조 (권리·의무)
              </Link>
              <Link
                href="/privacy#article8"
                className="lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2"
              >
                제 8 조 (안전성 확보)
              </Link>
              <Link
                href="/privacy#article9"
                className="lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2"
              >
                제 9 조 (자동 수집 장치)
              </Link>
              <Link
                href="/privacy#article10"
                className="lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2"
              >
                제 10 조 (행태 정보)
              </Link>
            </div>
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
              <Link
                href="/privacy#article11"
                className="lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2"
              >
                제 11 조 (추가 이용·제공)
              </Link>
              <Link
                href="/privacy#article12"
                className="lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2"
              >
                제 12 조 (가명 정보)
              </Link>
              <Link
                href="/privacy#article13"
                className="lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2"
              >
                제 13 조 (개인 정보 보호책임자)
              </Link>
              <Link
                href="/privacy#article14"
                className="lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2"
              >
                제 14 조 (접수·처리하는 부서)
              </Link>
              <Link
                href="/privacy#article15"
                className="lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2"
              >
                제 15 조 (권익 침해)
              </Link>
            </div>
          </div>
          <div className="w-full h-px mt-16 mb-12 bg-l-2 dark:bg-white"></div>
          <div className="text-lg font-bold text-l-2 dark:text-white">개요</div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            태돈(&#39;
            <Link
              href="/"
              className="underline underline-offset-2 lg:hover:text-h-1 lg:hover:dark:text-f-8"
            >
              https://fonts.taedonn.com
            </Link>
            &#39; 이하 &#39;폰트 아카이브&#39;)은(는) 「개인정보 보호법」
            제30조에 따라 정보 주체의 개인정보를 보호하고 이와 관련한 고충을
            신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보
            처리방침을 수립·공개합니다.
            <br />
            <br />○ 이 개인정보처리방침은 2023년 12월 1부터 적용됩니다.
          </pre>
          <div className="relative mt-16 text-lg font-bold text-l-2 dark:text-white">
            제 1 조 (개인정보의 처리 목적)
            <div id="article1" className="absolute -top-28"></div>
          </div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            {`폰트 아카이브는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.

1. 홈페이지 회원가입 및 관리
회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증 목적으로 개인정보를 처리합니다.`}
          </pre>
          <div className="relative mt-16 text-lg font-bold text-l-2 dark:text-white">
            제 2 조 (개인정보의 처리 및 보유 기간)
            <div id="article2" className="absolute -top-28"></div>
          </div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            {`① 폰트 아카이브는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.

② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.

1. 홈페이지 회원가입 및 관리
홈페이지 회원가입 및 관리와 관련한 개인정보는 수집.이용에 관한 동의일로부터 3년까지 위 이용목적을 위하여 보유.이용됩니다.
보유근거 : 회원제 서비스 관리
관련법령 : 신용정보의 수집/처리 및 이용 등에 관한 기록 : 3년`}
          </pre>
          <div className="relative mt-16 text-lg font-bold text-l-2 dark:text-white">
            제 3 조 (처리하는 개인정보의 항목)
            <div id="article3" className="absolute -top-28"></div>
          </div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            {`① 폰트 아카이브는 다음의 개인정보 항목을 처리하고 있습니다.

1. 홈페이지 회원가입 및 관리
필수항목 : 이름, 로그인ID, 비밀번호, 이메일, 쿠키`}
          </pre>
          <div className="relative mt-16 text-lg font-bold text-l-2 dark:text-white">
            제 4 조 (개인정보의 제3자 제공에 관한 사항)
            <div id="article4" className="absolute -top-28"></div>
          </div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            {`① 폰트 아카이브는 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.

② 폰트 아카이브는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다.

1. 이태호
개인정보를 제공받는 자 : 이태호
제공받는 자의 개인정보 이용목적 : 회원제 서비스 관리
제공받는 자의 보유.이용기간: 3년`}
          </pre>
          <div className="relative mt-16 text-lg font-bold text-l-2 dark:text-white">
            제 5 조 (개인정보처리의 위탁에 관한 사항)
            <div id="article5" className="absolute -top-28"></div>
          </div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            {`① 폰트 아카이브는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.

1. 폰트 아카이브
위탁받는 자 (수탁자) : 이태호
위탁하는 업무의 내용 : 회원제 서비스 이용에 따른 본인확인
위탁기간 : 3년

② 폰트 아카이브는 위탁계약 체결시 「개인정보 보호법」 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적․관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리․감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.

③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.`}
          </pre>
          <div className="relative mt-16 text-lg font-bold text-l-2 dark:text-white">
            제 6 조 (개인정보의 파기절차 및 파기방법)
            <div id="article6" className="absolute -top-28"></div>
          </div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            {`① 폰트 아카이브는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.

② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
1. 법령 근거 : 신용정보의 수집/처리 및 이용 등에 관한 기록
2. 보존하는 개인정보 항목 : 이름, 로그인ID, 비밀번호, 이메일, 쿠키

③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.
1. 파기절차
폰트 아카이브는 파기 사유가 발생한 개인정보를 선정하고, 폰트 아카이브의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.

2. 파기방법
전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.`}
          </pre>
          <div className="relative mt-16 text-lg font-bold text-l-2 dark:text-white">
            제 7 조 (정보주체와 법정대리인의 권리·의무 및 그 행사방법에 관한
            사항)
            <div id="article7" className="absolute -top-28"></div>
          </div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            {`① 정보주체는 폰트 아카이브에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.

② 제1항에 따른 권리 행사는 폰트 아카이브에 대해 「개인정보 보호법」 시행령 제41조 제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 폰트 아카이브는 이에 대해 지체 없이 조치하겠습니다.

③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 “개인정보 처리 방법에 관한 고시(제2020-7호)” 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.

④ 개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조 제4항, 제37조 제2항에 의하여 정보주체의 권리가 제한 될 수 있습니다.

⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.

⑥ 폰트 아카이브는 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.`}
          </pre>
          <div className="relative mt-16 text-lg font-bold text-l-2 dark:text-white">
            제 8 조 (개인정보의 안전성 확보조치에 관한 사항)
            <div id="article8" className="absolute -top-28"></div>
          </div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            {`폰트 아카이브는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.

1. 개인정보 취급 직원의 최소화 및 교육
개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화 하여 개인정보를 관리하는 대책을 시행하고 있습니다.

2. 개인정보에 대한 접근 제한
개인정보를 처리하는 데이터베이스 시스템에 대한 접근권한의 부여, 변경, 말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입 차단 시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.

3. 접속기록의 보관 및 위변조 방지
개인 정보 처리 시스템에 접속한 기록을 최소 1년 이상 보관, 관리하고 있으며, 다만, 5만명 이상의 정보주체에 관하여 개인정보를 추가하거나, 고유식별정보 또는 민감정보를 처리하는 경우에는 2년 이상 보관, 관리하고 있습니다.
또한, 접속기록이 위변조 및 도난, 분실되지 않도록 보안기능을 사용하고 있습니다.

4. 해킹 등에 대비한 기술적 대책
폰트 아카이브는 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안 프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.`}
          </pre>
          <div className="relative mt-16 text-lg font-bold text-l-2 dark:text-white">
            제 9 조 (개인정보를 자동으로 수집하는 장치의 설치·운영 및 그 거부에
            관한 사항)
            <div id="article9" className="absolute -top-28"></div>
          </div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            {`① 폰트 아카이브 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를 사용합니다.
② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.

가. 쿠키의 사용 목적 : 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용 형태, 인기 검색어, 보안접속 여부, 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.
나. 쿠키의 설치•운영 및 거부 : 웹브라우저 상단의 도구 > 인터넷 옵션 > 개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부 할 수 있습니다.
다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.`}
          </pre>
          <div className="relative mt-16 text-lg font-bold text-l-2 dark:text-white">
            제 10 조 (행태정보의 수집·이용·제공 및 거부 등에 관한 사항)
            <div id="article10" className="absolute -top-28"></div>
          </div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            {`행태정보의 수집·이용·제공 및 거부등에 관한 사항

폰트 아카이브는 온라인 맞춤형 광고 등을 위한 행태정보를 수집·이용·제공하지 않습니다.`}
          </pre>
          <div className="relative mt-16 text-lg font-bold text-l-2 dark:text-white">
            제 11 조 (추가적인 이용·제공 판단 기준)
            <div id="article11" className="absolute -top-28"></div>
          </div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            {`폰트 아카이브는 ｢개인정보 보호법｣ 제15조 제3항 및 제17조 제4항에 따라 ｢개인정보 보호법 시행령｣ 제14조의 2에 따른 사항을 고려하여 정보주체의 동의 없이 개인정보를 추가적으로 이용·제공할 수 있습니다. 이에 따라 폰트 아카이브가 정보주체의 동의 없이 추가적인 이용·제공을 하기 위해서 다음과 같은 사항을 고려하였습니다.

▶ 개인정보를 추가적으로 이용·제공하려는 목적이 당초 수집 목적과 관련성이 있는지 여부

▶ 개인정보를 수집한 정황 또는 처리 관행에 비추어 볼 때 추가적인 이용·제공에 대한 예측 가능성이 있는지 여부

▶ 개인정보의 추가적인 이용·제공이 정보주체의 이익을 부당하게 침해하는지 여부

▶ 가명처리 또는 암호화 등 안전성 확보에 필요한 조치를 하였는지 여부

※ 추가적인 이용·제공 시 고려사항에 대한 판단기준은 사업자/단체 스스로 자율적으로 판단하여 작성·공개함.`}
          </pre>
          <div className="relative mt-16 text-lg font-bold text-l-2 dark:text-white">
            제 12 조 (가명정보를 처리하는 경우 가명정보 처리에 관한 사항)
            <div id="article12" className="absolute -top-28"></div>
          </div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            {`폰트 아카이브는 다음과 같은 목적으로 가명정보를 처리하고 있습니다.

▶ 가명정보의 처리 목적
- 회원제 서비스 관리

▶ 가명정보의 처리 및 보유기간
- 3년

▶ 가명정보의 제3자 제공에 관한 사항
- 담당 부서에 제공

▶ 가명정보 처리의 위탁에 관한 사항
- 담당 부서에 위탁

▶ 가명처리하는 개인정보의 항목
- 이름, 로그인ID, 비밀번호, 이메일, 쿠키

▶ 법 제28조의 4(가명정보에 대한 안전조치 의무 등)에 따른 가명정보의 안전성 확보조치에 관한 사항
- 담당 부서에서 조치`}
          </pre>
          <div className="relative mt-16 text-lg font-bold text-l-2 dark:text-white">
            제 13 조 (개인정보 보호책임자에 관한 사항)
            <div id="article13" className="absolute -top-28"></div>
          </div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            {`① 폰트 아카이브는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.

▶ 개인정보 보호책임자
성명 : 이태호
직급 : 대표
연락처 : taedonn@taedonn.com

▶ 개인정보 보호 담당 부서
담당자 : 이태호
연락처 : taedonn@taedonn.com
② 정보주체께서는 폰트 아카이브의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 폰트 아카이브는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.`}
          </pre>
          <div className="relative mt-16 text-lg font-bold text-l-2 dark:text-white">
            제 14 조 (개인정보의 열람청구를 접수·처리하는 부서)
            <div id="article14" className="absolute -top-28"></div>
          </div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            {`정보주체는 ｢개인정보 보호법｣ 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다.
폰트 아카이브는 정보 주체의 개인정보 열람 청구가 신속하게 처리되도록 노력하겠습니다.

▶ 개인정보 열람청구 접수·처리 부서
담당자 : 이태호
연락처 : taedonn@taedonn.com`}
          </pre>
          <div className="relative mt-16 text-lg font-bold text-l-2 dark:text-white">
            제 15 조 (정보주체의 권익침해에 대한 구제방법)
            <div id="article15" className="absolute -top-28"></div>
          </div>
          <pre className="font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white">
            정보주체는 개인정보침해로 인한 구제를 받기 위하여
            개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에
            분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타
            개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기
            바랍니다.
            <br />
            <br />
            1. 개인정보분쟁조정위원회 : (국번없이) 1833-6972 (
            <Link
              href="https://www.kopico.go.kr"
              target="_blank"
              className="underline lg:hover:text-h-1 lg:hover:dark:text-f-8"
            >
              www.kopico.go.kr
            </Link>
            )<br />
            2. 개인정보침해신고센터 : (국번없이) 118 (
            <Link
              href="https://privacy.kisa.or.kr"
              target="_blank"
              className="underline lg:hover:text-h-1 lg:hover:dark:text-f-8"
            >
              privacy.kisa.or.kr
            </Link>
            )<br />
            3. 대검찰청 : (국번없이) 1301 (
            <Link
              href="https://www.spo.go.kr"
              target="_blank"
              className="underline lg:hover:text-h-1 lg:hover:dark:text-f-8"
            >
              www.spo.go.kr
            </Link>
            )<br />
            4. 경찰청 : (국번없이) 182 (
            <Link
              href="https://ecrm.cyber.go.kr"
              target="_blank"
              className="underline lg:hover:text-h-1 lg:hover:dark:text-f-8"
            >
              ecrm.cyber.go.kr
            </Link>
            )<br />
            <br />
            「개인정보보호법」제35조(개인정보의 열람), 제36조(개인정보의
            정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에 대
            하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는 이익의
            침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을 청구할 수
            있습니다.
            <br />
            <br />※ 행정심판에 대해 자세한 사항은 중앙행정심판위원회(
            <Link
              href="https://www.simpan.go.kr"
              target="_blank"
              className="underline lg:hover:text-h-1 lg:hover:dark:text-f-8"
            >
              www.simpan.go.kr
            </Link>
            ) 홈페이지를 참고하시기 바랍니다.
          </pre>
        </div>
      </div>

      {/* 풋터 */}
      <Footer />
    </>
  );
};

export async function getServerSideProps(ctx: any) {
  try {
    // 쿠키 체크
    const { theme } = ctx.req.cookies;

    // 디바이스 체크
    const userAgent = ctx.req
      ? ctx.req.headers["user-agent"]
      : navigator.userAgent;

    // 유저 정보 불러오기
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    return {
      props: {
        params: {
          theme: theme ? theme : "light",
          userAgent: userAgent,
          user: session === null ? null : session.user,
        },
      },
    };
  } catch (error) {
    console.log(error);
  }
}

export default Privacy;
