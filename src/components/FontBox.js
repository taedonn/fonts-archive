import { Link } from "react-router-dom";
import DummyText from "./DummyText";

function FontBox({data}) {
    return (
        <>
            <div className="font_area_wrap">
                {
                    data.map((dataEach) => (
                        <Link className="font_box fade_in" to={`/fonts-archive/DetailPage/${dataEach.c[0].v}`} key={dataEach.c[0].v}>
                            <div className="font_name">{dataEach.c[1].v}</div>
                            <div className="type_face">{dataEach.c[3].v}</div>
                            <div className="font_text" style={{fontFamily:dataEach.c[2].v}}><DummyText/></div>
                            <link href={dataEach.c[8].v} rel="stylesheet" itemProp="url"/>
                        </Link>
                    ))
                }
            </div>
        </>
    )
}

export default FontBox;