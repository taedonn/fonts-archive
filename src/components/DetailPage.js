import { useParams } from "react-router-dom";

function DetailPage() {
    const { id } = useParams()

    return (
        <>
            <div className="font_detail_page">
                <div className="download_btn_wrap">
                    {id}
                </div> 
            </div>
        </>
    )
}

export default DetailPage;