import DummyText from "./DummyText";

function FontBox({dataList}) {
    return (
        <>
            <div className="font_area_wrap">
                {
                    dataList.map((data, dataLength) => (
                        <div key={dataLength} className="font_box">
                            <div className="font_name">{data.c[1].v}</div>
                            <div className="type_face">{data.c[4].v}</div>
                            <div className="font_text" style={{fontFamily:data.c[4].v}}><DummyText/></div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default FontBox;