import { useLayoutEffect, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './Main'
import DetailPage from './DetailPage'

function App() {
    const [data, setData] = useState([])

    useEffect(() => {
        // 브라잇 모드 / 나잇 모드
        document.body.classList.add('bright_mode');
    })

    useLayoutEffect(() => {
        // 데이터 연동
        const sheetName = 'fonts';
        const query = 'Select *';
        const url = 'https://docs.google.com/spreadsheets/d/1ryt-0PI5_hWA3AnP0gcyTRyKh8kqAooApts_cI0yhQ0/gviz/tq?&sheet=' + sheetName + '&tq=' + query;

        fetch(url)
            .then(res => res.text())
            .then(rep => {
                // JSON만 추출
                let data = JSON.parse(rep.substring(47).slice(0, -2));
                let item = data.table.rows;
                setData(item);
            })
    })

    return (
        <>
            <div className={window.innerWidth > 1080 ? 'wrap expand' : 'wrap shrink'}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/fonts-archive' element={<Main data={data}/>}></Route>
                        <Route path='/fonts-archive/DetailPage/:id' element={<DetailPage data={data}/>}></Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    )
}

export default App;