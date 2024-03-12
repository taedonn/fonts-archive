// next
import { NextSeo } from 'next-seo';
import Link from 'next/link';

// api
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

// components
import Header from "@/components/header";
import Footer from '@/components/footer';
import KakaoAdFitTopBanner from '@/components/kakaoAdFitTopBanner';

const Terms = ({params}: any) => {
    const { theme, userAgent, user } = params;

    // 디바이스 체크
    const isMac: boolean = userAgent.includes("Mac OS") ? true : false;

    return (
        <>
            {/* Head 부분*/}
            <NextSeo 
                title={"서비스 이용약관 · 폰트 아카이브"}
                description={"서비스 이용약관 - 폰트 아카이브 · 상업용 무료 한글 폰트 저장소"}
            />

            {/* 헤더 */}
            <Header
                isMac={isMac}
                theme={theme}
                user={user}
            />

            {/* 메인 */}
            <div className='w-full px-4 flex flex-col justify-center items-center'>
                <div className='w-[45.5rem] tmd:w-full flex flex-col justify-center items-start mt-8 lg:mt-16 mb-24 lg:mb-32'>
                    <div className='w-full flex'>
                        <KakaoAdFitTopBanner/>
                    </div>
                    <div className='w-full flex mt-4 lg:mt-8 text-sm'>
                        <Link href='/terms' className='w-full lg:w-44 h-12 flex justify-center items-center border-y border-r border-h-1 dark:border-f-8 bg-h-1 dark:bg-f-8 text-white dark:text-f-1 lg:hover:font-medium lg:hover:underline'>서비스 이용약관</Link>
                        <Link href='/privacy' className='w-full lg:w-44 h-12 flex justify-center items-center border border-l-d dark:border-d-6 text-l-5 dark:text-d-c lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:font-medium lg:hover:underline'>개인정보 처리방침</Link>
                    </div>
                    <h2 className='text-xl mt-20 relative text-l-2 dark:text-white font-bold'>
                        서비스 이용약관
                        <div className='w-full h-px bg-l-2 dark:bg-white mt-0.5'></div>
                    </h2>
                    <div className='w-full text-sm flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between mt-6 p-6 lg:p-8 border border-l-5 dark:border-d-c text-l-5 dark:text-d-c'>
                        <div className='w-full lg:w-1/3 flex flex-col gap-4'>
                            <Link href='/terms#article1' className='lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2'>제 1 조 (목적)</Link>
                            <Link href='/terms#article2' className='lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2'>제 2 조 (정의)</Link>
                            <Link href='/terms#article3' className='lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2'>제 3 조 (약관)</Link>
                            <Link href='/terms#article4' className='lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2'>제 4 조 (서비스의 제공)</Link>
                            <Link href='/terms#article5' className='lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2'>제 5 조 (서비스의 중단)</Link>
                        </div>
                        <div className='w-full lg:w-1/3 flex flex-col gap-4'>
                            <Link href='/terms#article6' className='lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2'>제 6 조 (회원가입)</Link>
                            <Link href='/terms#article7' className='lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2'>제 7 조 (회원 탈퇴)</Link>
                            <Link href='/terms#article8' className='lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2'>제 8 조 (회원에 대한 통지)</Link>
                            <Link href='/terms#article9' className='lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2'>제 9 조 (개인정보보호)</Link>
                            <Link href='/terms#article10' className='lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2'>제 10 조 (의무)</Link>
                        </div>
                        <div className='w-full lg:w-1/3 flex flex-col gap-4'>
                            <Link href='/terms#article11' className='lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2'>제 11 조 (회원의 ID 및 비밀번호)</Link>
                            <Link href='/terms#article12' className='lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2'>제 12 조 (이용자의 의무)</Link>
                            <Link href='/terms#article13' className='lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2'>제 13 조 (저작권의 귀속)</Link>
                            <Link href='/terms#article14' className='lg:hover:text-l-2 lg:hover:dark:text-white lg:hover:underline underline-offset-2'>제 14 조 (분쟁해결)</Link>
                        </div>
                    </div>
                    <div className='w-full h-px mt-16 mb-12 bg-l-2 dark:bg-white'></div>
                    <div className='relative text-lg font-bold text-l-2 dark:text-white'>
                        제 1 조 (목적)
                        <div id="article1" className='absolute -top-28'></div>
                    </div>
                    <pre className='font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white'>
{`이 약관은 태돈 회사(소프트웨어 개발 사업)가 운영하는 "폰트 아카이브" 온라인 소프트웨어 서비스(이하 "폰트 아카이브")에서 제공하는 온라인 소프트웨어 서비스(이하 “서비스”라 한다)를 이용함에 있어 폰트 아카이브와 이용자의 권리․의무 및 책임사항을 규정함을 목적으로 합니다.

※「PC통신, 무선 등을 이용하는 전자상거래에 대해서도 그 성질에 반하지 않는 한 이 약관을 준용합니다.」`}
                    </pre>
                    <div className='relative mt-16 text-lg font-bold text-l-2 dark:text-white'>
                        제 2 조 (정의)
                        <div id="article2" className='absolute -top-28'></div>
                    </div>
                    <pre className='font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white'>
{`① ‘서비스’란 폰트 아카이브에 접속하여 이 약관에 따라 폰트 아카이브가 제공하는 서비스를 말합니다.

① ‘이용자’란 폰트 아카이브에 접속하여 이 약관에 따라 폰트 아카이브가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.

② ‘회원’이라 함은 폰트 아카이브에 회원등록을 한 자로서, 계속적으로 폰트 아카이브가 제공하는 서비스를 이용할 수 있는 자를 말합니다.

③ ‘비회원’이라 함은 회원에 가입하지 않고 폰트 아카이브가 제공하는 서비스를 이용하는 자를 말합니다.`}
                    </pre>
                    <div className='relative mt-16 text-lg font-bold text-l-2 dark:text-white'>
                        제 3 조 (약관 등의 명시와 설명 및 개정)
                        <div id="article3" className='absolute -top-28'></div>
                    </div>
                    <pre className='font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white'>
{`① 폰트 아카이브는 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전자우편주소, 사업자등록번호, 개인정보관리책임자등을 이용자가 쉽게 알 수 있도록 폰트 아카이브의 초기 서비스 화면(전면)에 게시합니다. 다만, 약관의 내용은 이용자가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.

② 폰트 아카이브는 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」, 「전자문서 및 전자거래기본법」, 「전자금융거래법」, 「전자서명법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「방문판매 등에 관한 법률」, 「소비자기본법」 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.

③ 폰트 아카이브가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 몰의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다. 다만, 이용자에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지합니다. 이 경우 폰트 아카이브는 개정 전 내용과 개정 후 내용을 명확하게 비교하여 이용자가 알기 쉽도록 표시합니다.

④ 폰트 아카이브가 약관을 개정할 경우에는 그 개정약관은 그 적용일자 이후에 체결되는 계약에만 적용되고 그 이전에 이미 체결된 계약에 대해서는 개정 전의 약관조항이 그대로 적용됩니다. 다만 이미 계약을 체결한 이용자가 개정약관 조항의 적용을 받기를 원하는 뜻을 제3항에 의한 개정약관의 공지기간 내에 폰트 아카이브에 송신하여 폰트 아카이브의 동의를 받은 경우에는 개정약관 조항이 적용됩니다.

⑤ 이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제 등에 관한 법률, 공정거래위원회가 정하는 전자상거래 등에서의 소비자 보호지침 및 관계법령 또는 상관례에 따릅니다.`}
                    </pre>
                    <div className='relative mt-16 text-lg font-bold text-l-2 dark:text-white'>
                        제 4 조 (서비스의 제공 및 변경)
                        <div id="article4" className='absolute -top-28'></div>
                    </div>
                    <pre className='font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white'>
{`① 폰트 아카이브는 다음과 같은 업무를 수행합니다.

1. 폰트 아카이브의 기술 서비스 제공

2. 기타 폰트 아카이브가 정하는 업무

② 폰트 아카이브는 서비스의 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할 서비스의 내용을 변경할 수 있습니다. 이 경우에는 변경된 서비스의 내용 및 제공일자를 명시하여 현재의 서비스의 내용을 게시한 곳에 즉시 공지합니다.

③ 폰트 아카이브가 제공하기로 이용자와 계약을 체결한 서비스의 기술적 사양의 변경 등의 사유로 변경할 경우에는 그 사유를 이용자에게 통지 가능한 주소로 즉시 통지합니다.

④ 전항의 경우 폰트 아카이브는 이로 인하여 이용자가 입은 손해를 배상합니다. 다만, 폰트 아카이브가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.`}
                    </pre>
                    <div className='relative mt-16 text-lg font-bold text-l-2 dark:text-white'>
                        제 5 조 (서비스의 중단)
                        <div id="article5" className='absolute -top-28'></div>
                    </div>
                    <pre className='font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white'>
{`① 폰트 아카이브는 컴퓨터 등 정보통신설비의 보수점검․교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.

② 폰트 아카이브는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, 폰트 아카이브가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.

③ 사업종목의 전환, 사업의 포기, 업체 간의 통합 등의 이유로 서비스를 제공할 수 없게 되는 경우에는 폰트 아카이브는 제8조에 정한 방법으로 이용자에게 사전에 통지합니다.`}
                    </pre>
                    <div className='relative mt-16 text-lg font-bold text-l-2 dark:text-white'>
                        제 6 조 (회원가입)
                        <div id="article6" className='absolute -top-28'></div>
                    </div>
                    <pre className='font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white'>
{`① 이용자는 폰트 아카이브가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.

② 폰트 아카이브는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.

1. 가입신청자가 이 약관 제7조제3항에 의하여 이전에 회원자격을 상실한 적이 있는 경우, 다만 제7조제3항에 의한 회원자격 상실 후 3년이 경과한 자로서 폰트 아카이브의 회원재가입 승낙을 얻은 경우에는 예외로 한다.

2. 등록 내용에 허위, 기재누락, 오기가 있는 경우

3. 기타 회원으로 등록하는 것이 폰트 아카이브의 기술상 현저히 지장이 있다고 판단되는 경우

③ 회원가입계약의 성립 시기는 폰트 아카이브의 승낙이 회원에게 도달한 시점으로 합니다.

④ 회원은 회원가입 시 등록한 사항에 변경이 있는 경우, 상당한 기간 이내에 폰트 아카이브에 대하여 회원정보 수정 등의 방법으로 그 변경사항을 알려야 합니다.`}
                    </pre>
                    <div className='relative mt-16 text-lg font-bold text-l-2 dark:text-white'>
                        제 7 조 (회원 탈퇴 및 자격 상실 등)
                        <div id="article7" className='absolute -top-28'></div>
                    </div>
                    <pre className='font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white'>
{`① 회원은 폰트 아카이브에 언제든지 탈퇴를 요청할 수 있으며 폰트 아카이브는 즉시 회원탈퇴를 처리합니다.

② 회원이 다음 각 호의 사유에 해당하는 경우, 폰트 아카이브는 회원자격을 제한 및 정지시킬 수 있습니다.

1. 가입 신청 시에 허위 내용을 등록한 경우

2. 폰트 아카이브을 이용하여 구입한 재화 등의 대금, 기타 폰트 아카이브가용에 관련하여 회원이 부담하는 채무를 기일에 지급하지 않는 경우

3. 다른 사람의 폰트 아카이브 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우

4. 폰트 아카이브을 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우

③ 폰트 아카이브가 회원 자격을 제한․정지 시킨 후, 동일한 행위가 2회 이상 반복되거나 30일 이내에 그 사유가 시정되지 아니하는 경우 폰트 아카이브는 회원자격을 상실시킬 수 있습니다.

④ 폰트 아카이브가 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우 회원에게 이를 통지하고, 회원등록 말소 전에 최소한 30일 이상의 기간을 정하여 소명할 기회를 부여합니다.`}
                    </pre>
                    <div className='relative mt-16 text-lg font-bold text-l-2 dark:text-white'>
                        제 8 조 (회원에 대한 통지)
                        <div id="article8" className='absolute -top-28'></div>
                    </div>
                    <pre className='font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white'>
{`① 폰트 아카이브가 회원에 대한 통지를 하는 경우, 회원이 폰트 아카이브와 미리 약정하여 지정한 전자우편 주소로 할 수 있습니다.

② 폰트 아카이브는 불특정다수 회원에 대한 통지의 경우 1주일이상 폰트 아카이브 공지사항 게시판에 게시함으로서 개별 통지에 갈음할 수 있습니다. 다만, 회원 본인의 거래와 관련하여 중대한 영향을 미치는 사항에 대하여는 개별통지를 합니다.`}
                    </pre>
                    <div className='relative mt-16 text-lg font-bold text-l-2 dark:text-white'>
                        제 9 조 (개인정보보호)
                        <div id="article9" className='absolute -top-28'></div>
                    </div>
                    <pre className='font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white'>
{`① 폰트 아카이브는 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.

② 폰트 아카이브는 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.

③ 폰트 아카이브는 수집된 개인정보를 목적외의 용도로 이용할 수 없으며, 새로운 이용목적이 발생한 경우 또는 제3자에게 제공하는 경우에는 이용·제공단계에서 당해 이용자에게 그 목적을 고지하고 동의를 받습니다. 다만, 관련 법령에 달리 정함이 있는 경우에는 예외로 합니다.

④ 폰트 아카이브가 제2항과 제3항에 의해 이용자의 동의를 받아야 하는 경우에는 개인정보관리 책임자의 신원(소속, 성명 및 전화번호, 기타 연락처), 정보의 수집목적 및 이용목적, 제3자에 대한 정보제공 관련사항(제공받은자, 제공목적 및 제공할 정보의 내용) 등 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제22조제2항이 규정한 사항을 미리 명시하거나 고지해야 하며 이용자는 언제든지 이 동의를 철회할 수 있습니다.

⑤ 이용자는 언제든지 폰트 아카이브가 가지고 있는 자신의 개인정보에 대해 열람 및 오류정정을 요구할 수 있으며 폰트 아카이브는 이에 대해 지체 없이 필요한 조치를 취할 의무를 집니다. 이용자가 오류의 정정을 요구한 경우에는 폰트 아카이브는 그 오류를 정정할 때까지 당해 개인정보를 이용하지 않습니다.

⑥ 폰트 아카이브는 개인정보 보호를 위하여 이용자의 개인정보를 취급하는 자를  최소한으로 제한하여야 하며 이용자의 개인정보의 분실, 도난, 유출, 동의 없는 제3자 제공, 변조 등으로 인한 이용자의 손해에 대하여 모든 책임을 집니다.

⑦ 폰트 아카이브 또는 그로부터 개인정보를 제공받은 제3자는 개인정보의 수집목적 또는 제공받은 목적을 달성한 때에는 당해 개인정보를 지체 없이 파기합니다.

⑧ 폰트 아카이브는 개인정보의 수집·이용·제공에 관한 동의 란을 미리 선택한 것으로 설정해두지 않습니다. 또한 개인정보의 수집·이용·제공에 관한 이용자의 동의거절시 제한되는 서비스를 구체적으로 명시하고, 필수수집항목이 아닌 개인정보의 수집·이용·제공에 관한 이용자의 동의 거절을 이유로 회원가입 등 서비스 제공을 제한하거나 거절하지 않습니다.`}
                    </pre>
                    <div className='relative mt-16 text-lg font-bold text-l-2 dark:text-white'>
                        제 10 조 (의무)
                        <div id="article10" className='absolute -top-28'></div>
                    </div>
                    <pre className='font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white'>
{`① 폰트 아카이브는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를 제공하는데 최선을 다하여야 합니다.

② 폰트 아카이브는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보보호를 위한 보안 시스템을 갖추어야 합니다.

③ 폰트 아카이브가 서비스에 대하여 「표시․광고의 공정화에 관한 법률」 제3조 소정의 부당한 표시․광고행위를 함으로써 이용자가 손해를 입은 때에는 이를 배상할 책임을 집니다.

④ 폰트 아카이브는 이용자가 원하지 않는 영리목적의 광고성 전자우편을 발송하지 않습니다.`}
                    </pre>
                    <div className='relative mt-16 text-lg font-bold text-l-2 dark:text-white'>
                        제 11 조 (회원의 ID 및 비밀번호에 대한 의무)
                        <div id="article11" className='absolute -top-28'></div>
                    </div>
                    <pre className='font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white'>
{`① 제17조의 경우를 제외한 ID와 비밀번호에 관한 관리책임은 회원에게 있습니다.

② 회원은 자신의 ID 및 비밀번호를 제3자에게 이용하게 해서는 안됩니다.

③ 회원이 자신의 ID 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 바로 폰트 아카이브에 통보하고 폰트 아카이브의 안내가 있는 경우에는 그에 따라야 합니다.`}
                    </pre>
                    <div className='relative mt-16 text-lg font-bold text-l-2 dark:text-white'>
                        제 12 조 (이용자의 의무)
                        <div id="article12" className='absolute -top-28'></div>
                    </div>
                    <pre className='font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white'>
{`이용자는 다음 행위를 하여서는 안 됩니다.

1. 신청 또는 변경시 허위 내용의 등록

2. 타인의 정보 도용

3. 폰트 아카이브에 게시된 정보의 변경

4. 폰트 아카이브가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시

5. 폰트 아카이브 기타 제3자의 저작권 등 지적재산권에 대한 침해

6. 폰트 아카이브 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위

7. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 몰에 공개 또는 게시하는 행위`}
                    </pre>
                    <div className='relative mt-16 text-lg font-bold text-l-2 dark:text-white'>
                        제 13 조 (저작권의 귀속 및 이용제한)
                        <div id="article13" className='absolute -top-28'></div>
                    </div>
                    <pre className='font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white'>
{`① 폰트 아카이브가 작성한 저작물에 대한 저작권 기타 지적재산권은 폰트 아카이브에 귀속합니다.

② 이용자는 폰트 아카이브을 이용함으로써 얻은 정보 중 폰트 아카이브에게 지적재산권이 귀속된 정보를 폰트 아카이브의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.

③ 폰트 아카이브는 약정에 따라 이용자에게 귀속된 저작권을 사용하는 경우 당해 이용자에게 통보하여야 합니다.`}
                    </pre>
                    <div className='relative mt-16 text-lg font-bold text-l-2 dark:text-white'>
                        제 14 조 (분쟁해결)
                        <div id="article14" className='absolute -top-28'></div>
                    </div>
                    <pre className='font-sans font-light whitespace-pre-wrap tracking-wide leading-loose mt-4 text-l-2 dark:text-white'>
{`① 폰트 아카이브는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치․운영합니다.

② 폰트 아카이브는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 즉시 통보해 드립니다.`}
                    </pre>
                </div>
            </div>

            {/* 풋터 */}
            <Footer/>
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    try {
        // 쿠키 체크
        const { theme } = ctx.req.cookies;

        // 디바이스 체크
        const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

        // 유저 정보 불러오기
        const session = await getServerSession(ctx.req, ctx.res, authOptions);

        return {
            props: {
                params: {
                    theme: theme ? theme : 'light',
                    userAgent: userAgent,
                    user: session === null ? null : session.user,
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default Terms;