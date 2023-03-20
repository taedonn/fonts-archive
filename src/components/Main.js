import { useEffect } from 'react';
import '../css/Main.css';

// 더미 텍스트
const dummyTextLong = [
  '흔히들 말한다. 상대가 원하는 걸 해주는게 사랑이라고. 하지만 그건 작은 사랑인지도 모른다. 상대가 싫어하는 걸 하지 않는 것이야말로 큰 사랑이 아닐까',

  '너무 치열하게 살지 마라. 인생은 우리에게 주어진 선물이지, 맹목적으로 전진만 하다가 그렇게 죽어가라고 주어진 것이 아니다.',

  '우선은 맛있는 것을 먹기로 했다.  그래야 바닥에 내팽개쳐진 내 존엄을 다시 챙길 수 있을 테니까.  맛있는 것을 먹고 나면 기분이 좋아질 테니, 기분이 좋아진 상태에서 하고 싶은 작은 일을 하면 된다.',

  '바쁜 일상속에 간혹 비치는 오아시스 앞에 앉은 듯한 고요한 순간이 찾아와도 우리는 그것이 우리 삶의 다음 단계로의 이행을 예비해주는 귀중한 순간이라는 걸 알지못한다.',

  '내일을 위한 목적함수를 설계하고, 그에 맞는 수단매체를 우회축적해야 한다. 우회 축적은 단기적으로 희생이 따르지만 장기적으로는  그 희생을 보상하고도 남을 수 있는 현명한 길이다.',

  '세상에서 가장 설득하기 힘든 것은 나 자신이다. 세상에 지지 말자. 안될 거라고 말하는 세상에 쉽게 설득 당하지 말자.',

  '삶이라는 모든 영화에는 "나"라는 주인공이 있고, 그 영화 속 모든 선택은 언제나 주인공이 하는 거다.',

  '우리는 정말로 책임이 있는 권력자에게 소리를 내지를 수가 없기에 우리가 비난을 해도 가장 너그럽게 보아주리라 확신하는 사람에게 화를 낸다.',

  '우리가 사랑하는 사람에게 퍼붓는 비난들은 딱히 이치에 닿지 않는다. 세상 다른 어떤 사람에게도 그런 부당한 말들을 발설하지 않는다.',

  '하지만 우리의 난폭한 비난은 친밀함과 신뢰의 독특한 증거이자 사랑 그 자체의 한 증상이고, 제 나름대로 헌신을 표현하는 비꾸러진 징표다.',

  '24. 천재는 노력하는 사람을 이기지 못하고, 노력하는 사람은 즐기는 사람을 이기지 못한다. 그러나 즐기는 사람도 돈 받고 일하는 사람에게는 이길 수 없다.',

  '나는 신념에 가득 찬 자들을 신뢰하지 않습니다. 나는 오히려 의심에 가득 찬 자들을 신뢰합니다.',

  '인류를 사랑한 사람의 할 일은 사람들로 하여금 진리를 비웃게 하고, 진리로 하여금 웃도록 만드는 데 있는 거야. 유일한 진리는 진리에 대한 광적인 정열에서 우리가 해방하는 길을 배우는데 있기 때문이지.',

  '왜 사람들은 이동할까? 무엇 때문에 뿌리를 내리고 모르는 게 없던 곳을 떠나 수평선 너머 미지의 세계로 향할까? 어디서나 답은 하나겠지. 사람들은 더 나은 삶을 소망하며 이주한다.',

  '말하자면 호밀밭의 파수꾼이 되고 싶다고나 할까. 바보 같은 이야기라는 건 알고 있어. 하지만 정말 내가 되고 싶은 건 그거야. 바보 같겠지만 말이야.',

  '내가 가지지 못한 것에 대해 생각할 시간은 없다. 내가 가진 것을 활용하여 무엇을 할 수 있는지를 생각해야 한다.',

  '삶이 열려 있음을 아는 것, 다음 산을 넘으면, 다음 골목으로 접어들면, 아직 알지 못하는 지평이 놓여 있으리라는 기대는 우리를 행복하게 한다.',

  '누구에게든 아무 말도 하지 말아라. 말을 하게 되면 모든 사람들이 그리워지기 시작하니까.',

  '그러므로 우리는 물결을 거스르는 배처럼, 쉴 새 없이 과거 속으로 밀려나면서도 끝내 앞으로 나아가는 것이다.',

  '다른 사람에게는 결코 열어주지 않는 문을 당신에게만 열어주는 사람이 있다면 그 사람이야 말로 당신의 진정한 친구이다.'
]

const dummyTextShort = [
  '잊지 말자. 나는 어머니의 자부심이다.',

  '도망쳐서 도착한 곳에 낙원은 없다.',

  '단념하면 바로 그 때 시합은 끝나는거야. 희망을 버려선 안돼. 마지막까지.',

  '우리는 인생의 날들을 늘릴수는 없지만, 그 날들에 생기를 불어 넣을 수는 있다',

  '인간은 패배하도록 만들어진 것은 아니다. 인간은 파괴될 지언정 패배할 수는 없다.',

  '사막이 아름다운 것은, 어디엔가 샘을 숨기고 있기 때문이야.',

  '성공 그 자체에 파멸의 불씨가 들어 있을지도 모른다.',

  '삶에 후회를 남기지말고, 사랑하는 데 이유를 달지 마세요',

  '네 장미꽃을 그렇게 소중하게 만든 것은 그 꽃을 위해 네가 소비한 시간이란다.',

  '가장 중요한 것은 눈에 보이지 않는 법이야.',

  '인간은 가장 깊은 절망의 순간에서조차 아름다움의 법칙에 따라 자신의 삶을 작곡한다',

  '우리는 완벽하게 이해할 수 없어도 온전하게 사랑할 수는 있습니다',

  '반복되는 하루는 단 한번도 없다. 그러므로 너는 아름답다.',

  '수백 년 동안 졌다고 해서 시작하기도 전에 이기려는 노력도 하지 말아야 할 까닭은 없으니까.',

  '무소유란 아무것도 갖지 않는다는 것이 아니라 불필요한 것을 갖지 않는다는 뜻이다.',

  '우연이 아니야, 흘러온 것도 아니야. 우리 모든 걸 스스로 선택해서 여기까지 온거야',

  '전우들이여 생각컨데 이번 일도 언젠가는 우리에게 추억이 될 것이다.',

  '인생에 지나가는 사람들에게 상처받지 말자 그들은 어차피 인생에서 지나가는 사람들일 뿐이다.',

  '어른들은 누구나 처음에는 어린이였다. 그러나 그것을 기억하는 어른은 별로 없다.',

  '그리고 눈을 떴을 때, 너는 새로운 세계의 일부가 되어 있다.'
]

const randomLong = Math.floor(Math.random() * (dummyTextLong.length - 1));
const randomShort = Math.floor(Math.random() * (dummyTextShort.length - 1));

function Main() {
  useEffect(() => {
    // 브라잇 모드 / 나잇 모드
    document.body.classList.add('bright_mode');

    // 데이터 연동
    const base = 'https://docs.google.com/spreadsheets/d/1ryt-0PI5_hWA3AnP0gcyTRyKh8kqAooApts_cI0yhQ0/gviz/tq?';
    const sheetName = 'fonts';
    const query = 'Select A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W';
    const url = base + '&sheet=' + sheetName + '&tq=' + query;

    fetch(url)
        .then(res => res.text())
        .then(rep => {
          // JSON만 추출
          let data = JSON.parse(rep.substring(47).slice(0, -2));
          let item = data.table.rows;

          // 헤더에 폰트 링크 삽입
          for (let i = 1; i < item.length; i++) { document.head.innerHTML += '<link rel="stylesheet" href="'+item[i].c[9].v+'"/>' }

          // 메인에 폰트 박스 삽입
          document.getElementsByClassName('font_area_wrap')[0].innerHTML = '';
          for (let i = 1; i < item.length; i++) {
              document.getElementsByClassName('font_area_wrap')[0].innerHTML += 
              '<div class="font_box fade_in" data-num="'+(i+1)+'">'
                +'<div class="font_name">'+item[i].c[1].v+'</div>'
                +'<div class="type_face">'+item[i].c[4].v+'</div>'
                +'<div class="font_text" style="font-family:'+item[i].c[2].v+';">'+dummyTextLong[randomLong]+'</div>'
                +'<svg class="close_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>'
                +'<div class="font_detail_page_divider"></div>'
                +'<div class="font_detail_page_wrap">'
                  +'<div class="font_detail_page">'
                    +'<div class="download_btn_wrap">'
                      +'<a class="source_btn" style="border-color:'+item[i].c[6].v+'; color:'+item[i].c[6].v+'" href="'+item[i].c[7].v+'" target="_blank">'+item[i].c[5].v+' 방문하기</a>'
                      +'<a class="download_btn" href="'+item[i].c[8].v+'">폰트 다운로드</a>'
                    +'</div>'
                    +'<p class="font_detail_page_title">웹 폰트 사용하기</p>'
                    +'<div class="cdn_wrap">'
                      +'<input type="radio" id="cdn_css_'+i+'" name="cdn_'+i+'" checked/>'
                      +'<label for="cdn_css_'+i+'">CSS 설정하기</label>'
                      +'<input type="radio" id="cdn_link_'+i+'" name="cdn_'+i+'"/>'
                      +'<label for="cdn_link_'+i+'">link 방식</label>'
                      +'<input type="radio" id="cdn_import_'+i+'" name="cdn_'+i+'"/>'
                      +'<label for="cdn_import_'+i+'">import 방식</label>'
                      +'<input type="radio" id="cdn_url_'+i+'" name="cdn_'+i+'"/>'
                      +'<label for="cdn_url_'+i+'">URL 방식</label>'
                      +'<div class="cdn_code_wrap">'
                        +'<div class="cdn_code cdn_code_css">'
                          +'<div>'+item[i].c[10].v+'</div>'
                          +'<svg class="copy_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>'
                          +'<svg class="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>'
                        +'</div>'
                        +'<div class="cdn_code cdn_code_link">'
                          +'<div>&#60;'+item[i].c[11].v+'</div>'
                          +'<svg class="copy_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>'
                          +'<svg class="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>'
                        +'</div>'
                        +'<div class="cdn_code cdn_code_import">'
                          +'<div>'+item[i].c[12].v+'</div>'
                          +'<svg class="copy_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>'
                          +'<svg class="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>'
                        +'</div>'
                        +'<div class="cdn_code cdn_code_url">'
                          +'<div>'+item[i].c[9].v+'</div>'
                          +'<svg class="copy_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>'
                          +'<svg class="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>'
                        +'</div>'
                      +'</div>'
                      +'<p class="font_detail_page_title">폰트 두께</p>'
                      +'<div class="font_weight_wrap">'
                        +'<input class="font_weight_change" type="text" value="'+dummyTextShort[randomShort]+'"/>'
                      +'</div>'
                      +'<p class="font_detail_page_title">라이센스 사용 범위</p>'
                      +'<table class="license">'
                        +'<tr>'
                          +'<th>카테고리</th>'
                          +'<th>사용 범위</th>'
                          +'<th>허용 여부</th>'
                        +'</tr>'
                        +'<tr>'
                          +'<td rowspan="5">인쇄</td>'
                          +'<td>브로슈어, 카탈로그, DM, 전단지, 포스터, 패키지, 캘린더 등 인쇄물</td>'
                          +'<td class="license_yn">'+item[i].c[14].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>책, 만화책, 잡지, 정기간행물, 신문 등 출판물</td>'
                          +'<td class="license_yn">'+item[i].c[14].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>간판, 현수막, 판넬 등 제작물</td>'
                          +'<td class="license_yn">'+item[i].c[14].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>신문광고, 잡지광고, 차량광고 등 광고물</td>'
                          +'<td class="license_yn">'+item[i].c[14].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>인쇄 및 문서 공유를 위한 PDF 파일 제작</td>'
                          +'<td class="license_yn">'+item[i].c[14].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td rowspan="2">웹사이트</td>'
                          +'<td>웹페이지, 광고 배너, 메일, E-브로슈어 등</td>'
                          +'<td class="license_yn">'+item[i].c[15].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>웹서버용 폰트</td>'
                          +'<td class="license_yn">'+item[i].c[15].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td rowspan="5">영상</td>'
                          +'<td>방송 및 영상물 자막</td>'
                          +'<td class="license_yn">'+item[i].c[16].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>TV-CF, 온라인 영상광고</td>'
                          +'<td class="license_yn">'+item[i].c[16].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>영화(DVD / 비디오), 오프닝, 엔딩크레딧 자막</td>'
                          +'<td class="license_yn">'+item[i].c[16].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>개인 UCC 및 홍보물</td>'
                          +'<td class="license_yn">'+item[i].c[16].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>E-Learning 콘텐츠, 온라인 동영상강좌, 플래시 강좌</td>'
                          +'<td class="license_yn">'+item[i].c[16].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>포장지</td>'
                          +'<td>판매용 상품의 패키지</td>'
                          +'<td class="license_yn">'+item[i].c[17].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>임베딩</td>'
                          +'<td>웹사이트 및 프로그램 서버 내 폰트 탑재, E-book 제작</td>'
                          +'<td class="license_yn">'+item[i].c[18].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>BI/CI</td>'
                          +'<td>회사명, 브랜드명, 상품명, 로고, 마크, 슬로건, 캐치프레이즈</td>'
                          +'<td class="license_yn">'+item[i].c[19].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td rowspan="2">OFL</td>'
                          +'<td>폰트 파일의 수정, 편집 및 재배포</td>'
                          +'<td class="license_yn">'+item[i].c[20].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>폰트 파일의 유료 판매</td>'
                          +'<td class="license_yn">'+item[i].c[20].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td rowspan="2">용도</td>'
                          +'<td>폰트 파일의 수정, 편집 및 재배포</td>'
                          +'<td class="license_yn">'+item[i].c[21].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>상업적 용도 사용</td>'
                          +'<td class="license_yn">'+item[i].c[21].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>출처</td>'
                          +'<td>출처 표시</td>'
                          +'<td class="license_yn">권장</td>'
                        +'</tr>'
                      +'</table>'
                    +'</div>'
                  +'</div>'
                +'</div>'
              +'</div>';

              // 폰트 두께 각자 따로 적용
              if (item[i].c[13].v.indexOf('300') !== -1) { document.getElementsByClassName('font_weight_wrap')[i-1].innerHTML += '<div class="font_weight_title">Light 300</div><div class="font_weight_txt" style="font-family:'+item[i].c[2].v+'; font-weight:300;">'+dummyTextShort[randomShort]+'</div>'}
              if (item[i].c[13].v.indexOf('400') !== -1) { document.getElementsByClassName('font_weight_wrap')[i-1].innerHTML += '<div class="font_weight_title">Regular 400</div><div class="font_weight_txt" style="font-family:'+item[i].c[2].v+'; font-weight:400;">'+dummyTextShort[randomShort]+'</div>'}
              if (item[i].c[13].v.indexOf('700') !== -1) { document.getElementsByClassName('font_weight_wrap')[i-1].innerHTML += '<div class="font_weight_title">Bold 700</div><div class="font_weight_txt" style="font-family:'+item[i].c[2].v+'; font-weight:700;">'+dummyTextShort[randomShort]+'</div>'}
              if (item[i].c[13].v.indexOf('800') !== -1) { document.getElementsByClassName('font_weight_wrap')[i-1].innerHTML += '<div class="font_weight_title">ExtraBold 800</div><div class="font_weight_txt" style="font-family:'+item[i].c[2].v+'; font-weight:800;">'+dummyTextShort[randomShort]+'</div>'}

              // fade-in 초기화
              setTimeout(function(){document.getElementsByClassName('font_box')[i-1].classList.remove('fade_in')},600)
          }

          // 폰트 박스가 홀수일 때 정렬 맞춰주는 빈 div 생성, 뒷배경으로 사용될 div 생성
          document.getElementsByClassName('font_area_wrap')[0].innerHTML += '<div class="font_box_empty"></div><div class="font_area_divider"></div>';

          // 사이드에 폰트 리스트 삽입
          document.getElementsByClassName('font_list')[0].innerHTML = '';
          for (let i = 1; i < item.length; i++) { document.getElementsByClassName('font_list')[0].innerHTML += '<div class="font_name">'+item[i].c[1].v+'</div>'; }
      })
      .then(() => {
          // 폰트 박스 & 폰트 리스트 클릭 이벤트
          let fontBox = document.getElementsByClassName('font_box');
          let fontList = document.getElementsByClassName('font_name');
          for (let i = 0; i < fontBox.length; i++) {
            // 폰트 박스
            fontBox[i].addEventListener('click', (e) => {
              if(fontBox[i].classList.contains('clicked')) { return; }

              // clicked 이벤트 초기화
              for (let o = 0; o < fontBox.length; o++) { 
                fontBox[o].classList.remove('clicked');
                fontBox[o].classList.add('fade_in');
                setTimeout(function(){fontBox[o].classList.remove('fade_in');},600);

                // 폰트 두께 텍스트 변경 이벤트
                fontBox[o].getElementsByClassName('font_weight_change')[0].value = dummyTextShort[randomShort];
                let fontWeightTxt = fontBox[o].getElementsByClassName('font_weight_txt');
                for(let e = 0; e < fontWeightTxt.length; e++) { fontWeightTxt[e].innerText = fontBox[o].getElementsByClassName('font_weight_change')[0].value; }
              }

              // 새 clicked 이벤트
              fontBox[i].classList.add('clicked');
              fontBox[i].classList.add('fade_in');
              setTimeout(function(){fontBox[i].classList.remove('fade_in');},600);
            });

            // 폰트 리스트
            fontList[i].addEventListener('click', () => {
              for(let o = 0; o < fontBox.length; o++) { fontBox[o].classList.remove('clicked'); }
              fontBox[i].classList.add('clicked');
              fontBox[i].classList.add('fade_in');
              setTimeout(function(){fontBox[i].classList.remove('fade_in');},600);

              // 폰트 두께 텍스트 변경 이벤트
              fontBox[i].getElementsByClassName('font_weight_change')[0].value = dummyTextShort[randomShort];
              let fontWeightTxt = fontBox[i].getElementsByClassName('font_weight_txt');
              for(let e = 0; e < fontWeightTxt.length; e++) { fontWeightTxt[e].innerText = fontBox[i].getElementsByClassName('font_weight_change')[0].value; }
            });

            // 폰트 두께 텍스트 변경 이벤트
            fontBox[i].getElementsByClassName('font_weight_change')[0].addEventListener('input', (e) => {
              let fontWeightTxt = fontBox[i].getElementsByClassName('font_weight_txt');
              for(let o = 0; o < fontWeightTxt.length; o++) { fontWeightTxt[o].innerText = e.target.value; }
            });
          }

          // 뒤로가기 버튼 클릭 이벤트
          let closeBtn = document.getElementsByClassName('close_btn');
          for (let i = 0; i < closeBtn.length; i++) {
            closeBtn[i].addEventListener('click', () => { for (let o = 0; o < fontBox.length; o++) { if (fontBox[o].classList.contains('clicked')) { setTimeout(function(){fontBox[o].classList.remove('clicked'); fontBox[o].classList.add('fade_in'); setTimeout(function(){fontBox[o].classList.remove('fade_in');},600);},0); } } })
          }

          // 웹 폰트 적용하기 복사 버튼 클릭 이벤트
          let copyWebFont = document.getElementsByClassName('cdn_code');
          for (let i = 0; i < copyWebFont.length; i++) {
            copyWebFont[i].getElementsByClassName('copy_btn')[0].addEventListener('click', () => {
              window.navigator.clipboard.writeText(copyWebFont[i].getElementsByTagName('div')[0].innerText);

              copyWebFont[i].getElementsByClassName('copy_btn')[0].style.display = 'none';
              copyWebFont[i].getElementsByClassName('copy_chk_btn')[0].style.display = 'block';
              setTimeout(function() {
                copyWebFont[i].getElementsByClassName('copy_btn')[0].style.display = 'block';
                copyWebFont[i].getElementsByClassName('copy_chk_btn')[0].style.display = 'none';
              },1500);
            });
          }
      });

      // vh값 업데이트 (모바일 주소창 대응)
      var vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      window.addEventListener("resize", () => { vh = window.innerHeight * 0.01; document.documentElement.style.setProperty("--vh", `${vh}px`); });
  })

  const textChange = (e) => {
    let textArea = document.getElementsByClassName('font_text');
    for (let i = 0; i < textArea.length; i++) {
      textArea[i].innerText = e.target.value;
    }
  }

  const fontWeightChange = (e) => {
    let textArea = document.getElementsByClassName('font_text');
    for (let i = 0; i < textArea.length; i++) {
      textArea[i].style.fontWeight = e.target.value;
    }
  }

  const typeFaceChange = (e) => {
    let fontBox = document.getElementsByClassName('font_box');
    if (e.target.checked) {
      for (let i = 0; i < fontBox.length; i++) { fontBox[i].classList.remove('clicked'); fontBox[i].classList.add('fade_in'); setTimeout(function(){fontBox[i].classList.remove('fade_in');},600);; if (fontBox[i].getElementsByClassName('type_face')[0].innerText === e.target.value) { fontBox[i].style.display = 'block'; } }
    }
    else {
      for (let i = 0; i < fontBox.length; i++) { fontBox[i].classList.remove('clicked'); fontBox[i].classList.add('fade_in'); setTimeout(function(){fontBox[i].classList.remove('fade_in');},600); if (fontBox[i].getElementsByClassName('type_face')[0].innerText === e.target.value) { fontBox[i].style.display = 'none'; } }
    }
  }

  const searchChange = (e) => {
    let fontList = document.getElementsByClassName('font_list')[0].getElementsByClassName('font_name');
    let fontBox = document.getElementsByClassName('font_box');
    let typeFace = document.getElementsByClassName('category_1')[0].getElementsByTagName('input');

    for (let i = 0; i < fontList.length; i++) {
      if (fontList[i].innerText.indexOf(e.target.value) === -1) { fontList[i].style.display = 'none'; fontBox[i].style.display = 'none'; fontBox[i].classList.remove('clicked'); fontBox[i].classList.add('fade_in'); setTimeout(function(){fontBox[i].classList.remove('fade_in');},600); for(let o = 0; o < typeFace.length; o++) { typeFace[o].checked = true; } }
      else { fontList[i].style.display = 'block'; fontBox[i].style.display = 'block'; }
    }
  }

  // 사이드 메뉴 접기 / 펼치기
  const expandChk = (e) => {
    if(e.target.checked) {
      document.getElementsByClassName('wrap')[0].classList.remove('expand');
      document.getElementsByClassName('wrap')[0].classList.add('shrink');
    }
    else {
      document.getElementsByClassName('wrap')[0].classList.remove('shrink');
      document.getElementsByClassName('wrap')[0].classList.add('expand');
    }
  }

  const goUp = () => { window.scrollTo({top:0,behavior:'smooth'}); }

  const goGitHub = () => { window.open('https://github.com/taedonn/fonts-archive','_blank'); }

  const goNightMode = () => {
    if(document.body.classList.contains('bright_mode')) {
      document.body.classList.remove('bright_mode');
      document.body.classList.add('night_mode');
    }
    else {
      document.body.classList.remove('night_mode');
      document.body.classList.add('bright_mode');
    }
  }

  return (
    <>
        <div className={window.innerWidth > 1080 ? 'wrap expand' : 'wrap shrink'}>
            <div className='side_menu'>
              <div className='expand_btn_wrap'>
                <input type='checkbox' id='expand_btn' onClick={expandChk} defaultChecked={window.innerWidth > 1080 ? false : true}/>
                <label htmlFor='expand_btn'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>
                </label>
              </div>
              <div className='title'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
              </div>
              <div className='search_bar'>
                <input type='text' placeholder='Search Fonts' onChange={searchChange}/>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </div>
              <div className='font_list'></div>
            </div>
            <div className='main_menu'>
              <div className='main_menu_fixed'>
                <div className='search_bar'>
                  <input type='text' placeholder='Type Something' onChange={textChange} defaultValue={dummyTextLong[randomLong]}/>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/>
                  </svg>
                </div>
                <div className='category'>
                  <div className='category_1'>
                    <input type='checkbox' id='serif' onChange={typeFaceChange} value='Serif' defaultChecked/>
                    <label htmlFor='serif'>Serif</label>
                    <input type='checkbox' id='sansSerif' onChange={typeFaceChange} value='Sans Serif' defaultChecked/>
                    <label htmlFor='sansSerif'>Sans Serif</label>
                    <input type='checkbox' id='handWriting' onChange={typeFaceChange} value='Hand Writing' defaultChecked/>
                    <label htmlFor='handWriting'>Hand Writing</label>
                  </div>
                  <div className='divider'></div>
                  <div className='category_2'>
                    <input type='radio' onChange={fontWeightChange} name='fontWeight' id='light' value='300'/>
                    <label htmlFor='light'>Light</label>
                    <input type='radio' onChange={fontWeightChange} name='fontWeight' id='regular' value='400' defaultChecked/>
                    <label htmlFor='regular'>Regular</label>
                    <input type='radio' onChange={fontWeightChange} name='fontWeight' id='medium' value='500'/>
                    <label htmlFor='medium'>Medium</label>
                    <input type='radio' onChange={fontWeightChange} name='fontWeight' id='bold' value='700'/>
                    <label htmlFor='bold'>Bold</label>
                    <input type='radio' onChange={fontWeightChange} name='fontWeight' id='black' value='900'/>
                    <label htmlFor='black'>Black</label>
                  </div>
                </div>
              </div>
              <div className='font_area_wrap'></div>
              <div className='profile_fixed'>
                <div className='profile_star' onClick={goGitHub}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                </div>
                <div className='profile_color_mode' onClick={goNightMode}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>
                </div>
                <div className='profile_up' onClick={goUp}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/></svg>
                </div>
              </div>
            </div>
        </div>
    </>
  );
}

export default Main;