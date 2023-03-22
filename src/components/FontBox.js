import { Link } from "react-router-dom";
import DummyText from "./DummyText";

function FontBox({dataList}) {
    return (
        <>
            <div className="font_area_wrap">
                {
                    dataList.map((data) => (
                        <Link className="font_box" to={`/fonts-archive/DetailPage/${data.c[2].v}`} key={data.c[2].v}>
                            <div className="font_name">{data.c[1].v}</div>
                            <div className="type_face">{data.c[4].v}</div>
                            <div className="font_text" style={{fontFamily:data.c[2].v}}><DummyText/></div>
                            <link href={data.c[9].v} rel="stylesheet" itemProp="url"/>
                        </Link>
                    ))
                }
            </div>
        </>
    )
}

export default FontBox;