const dummyText: string[] = [
    '다른 이의 삶에 한눈팔며 살기엔, 내 인생은 너무 소중하다.',
  
    '너 지금 멋지게 헤엄치려고 숨 참는 것부터 하고 있다고 생각해.',
  
    '만만해 보이지 않으려다 나쁜 사람이 되었다. 착해 보이려다 만만한 사람이 되었다.',
  
    '지금 길을 잃어버린 것은 네가 가야만 할 길이 있기 때문이야.',
  
    '나의 언어의 한계는 나의 세계의 한계를 의미한다.',
  
    '마음을 다하되, 기대는 하지 말 것. 최선을 다하되, 자신을 버리지 말 것',
  
    '"넌 할 수 있어"라고 말해주세요. 그럼 우리는 무엇이든 할 수 있지요.',
  
    '어제는 멀고 오늘은 낯설며 내일은 두려운 격변의 시간이었다.',
  
    '사람이란게 의외로 단순해서 단편적인 모습만 기억한단 말이지. 지나간 모습은 다 잊고.',
  
    '난 괜찮은 사람이다. 너도 꽤 괜찮은 사람이고.',
  
    '인생은 경주가 아니야. 누가 1등으로 들어오냐로 성공을 따지는 경기가 아니지',
  
    '시간은 나는 게 아니라, 내는 것이고, 기운은 내는 게 아니라, 나는 것이다.',
  
    '나에겐 철학이 있어. 어려운 일이 있다면, 언젠가는 좋은 일도 있다는 거야.',
  
    '어떻게 말할까 하고 괴로울 땐 진실을 말해라.',
  
    '말하자면 호밀밭의 파수꾼이 되고 싶다고나 할까. 바보 같은 이야기라는 건 알고 있어.',
  
    '가장 좋은 스킬은 생각 즉시 행동하는 것이다.',
  
    '정말로 눈에 차는 것을 목표로 삼자. 눈에 들어오는 것 중 그나마 나은것에 안주하지 말자',
  
    '누구에게든 아무 말도 하지 말아라. 말을 하게 되면 모든 사람들이 그리워지기 시작하니까.',
  
    '가짜 친구는 소문을 믿고, 진짜 친구는 나를 믿는다.',
  
    '내일은 내일, 중요한건 오늘이다.'
]

const dummyTextEn: string[] = [
    'Man is the artificer of his own happiness.',

    'Remember that happiness is a way of travel, not a destination.',

    'If you do not walk today, you will have to run tomorrow.',

    'The only thing that overcomes hard luck is hard work.',

    'Life is a journey, not a guided tour.',

    'Never underestimate your own ignorance.',

    'Only the gentle are ever really strong.',

    'The best way to predict your future is to create it.',

    'Wherever you are, you can do anything.',

    'Stop asking God to bless what you are doing.',

    'Action is the foundational key to all success.',

    'Love is, above all else, the gift of oneself.',

    'The difficulty in life is making choices.',

    'Regret for wasted time is more wasting time.',

    'Nothing is impossible, the word itself  says I’m possible.',

    'Today’s special moments are tomorrow’s memories.',

    'Change the game, do not let the game change you.',

    'You will never find a rainbow if you are looking down.',

    'My mother is the heart, that keeps me alive.',

    'Stay positive. Good days are on their way.'
]

export default function DummyText({lang, text, randomNum}:{lang: string, text: string, randomNum: number}) {
    return (
        <>
            {
                lang === "KR" && text === ""
                ? dummyText[randomNum]
                : ( lang === "KR" && text !== ""
                    ? text
                    : ( lang === "EN" && text === ""
                        ? dummyTextEn[randomNum]
                        : text
                    )
                )
            }
        </>
    )
}