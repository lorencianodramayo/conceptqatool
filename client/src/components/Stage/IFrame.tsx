import React, { FC } from 'react';
import { RootStateOrAny, useSelector } from "react-redux";
import './IFrame.less';

const IFrame: FC = () => {
    const templates = useSelector((state: RootStateOrAny) => state.playground.value);
    return(
        <div className="IFrame">
            <iframe 
                width={templates.selectedWidth} 
                height={templates.selectedHeight} 
                title={templates.selected.name} 
                src={templates.selectedURL} 
                frameBorder="0"
            />
        </div>
    )
}

export default IFrame;