import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './Main'
import DetailPage from './DetailPage'

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/fonts-archive' element={<Main/>}></Route>
                    <Route path='/fonts-archive/DetailPage/:id' element={<DetailPage/>}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App;