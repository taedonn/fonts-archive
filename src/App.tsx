// 훅
// import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 컴포넌트
import Main from './Main';
import DetailPage from './DetailPage';
import useGoogleSheet from './GoogleSheet';

// 스타일
import './App.css';

const App = () => {
    const [data] = useGoogleSheet("#gid=0");
    const fontsList = ['font_code','font_name'];

    // 맨 위로 버튼 클릭 이벤트
    const goUp = () => { window.scrollTo({top:0,behavior:'smooth'}); }

    // 깃허브 저장소 바로가기 클릭 이벤트
    const goGitHub = () => { window.open('https://github.com/taedonn/fonts-archive','_blank'); }

    // 컬러 모드 변경하기 클릭 이벤트
    const goNightMode = (e:React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.checked) { document.body.classList.replace('night_mode','bright_mode'); }
        else { document.body.classList.replace('bright_mode','night_mode'); }
    }

    return (
        <>
            <div className={window.innerWidth > 1080 ? 'wrap expand' : 'wrap shrink'}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Main/>}></Route>
                        <Route path='/DetailPage/:id' element={<DetailPage/>}></Route>
                        <Route path='*' element={<Navigate replace to='/'/>}></Route>
                    </Routes>
                </BrowserRouter>
                <div className='profile_fixed'>
                    <div className='profile_fixed_btn' onClick={goGitHub}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                        <div className='profile_fixed_tooltip'>깃허브 저장소 바로가기</div>
                    </div>
                    <input id='color_mode' type="checkbox" onChange={goNightMode}/>
                    <label className='profile_fixed_btn' htmlFor='color_mode'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>
                        <div className='profile_fixed_tooltip'>컬러 모드 변경하기</div>
                    </label>
                    <div className='profile_fixed_btn' onClick={goUp}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/></svg>
                    </div>
                </div>
                {data.map((row) => {
                    return (<div>폰트 번호: {row[fontsList[0]]}, 폰트 이름: {row[fontsList[1]]}</div>);
                })}
            </div>
        </>
    )
}

export default App;