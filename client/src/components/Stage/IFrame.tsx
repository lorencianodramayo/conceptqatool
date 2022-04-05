import React, { FC } from 'react';
import { useSetState } from 'ahooks';
import { Button, Col, Row, Slider } from 'antd';
import { CaretRightOutlined, ReloadOutlined, PauseOutlined } from '@ant-design/icons';
import { RootStateOrAny, useSelector } from "react-redux";
import './IFrame.less';

interface State {
    counter: number;
    isPlay: boolean;
}

const IFrame: FC = () => {
    const templates = useSelector((state: RootStateOrAny) => state.playground.value);

    const [state, setState] = useSetState<State>({
        counter: 0,
        isPlay: true
    })

    const onChange = () => {

    }

    const onAfterChange = () => {

    }
    
    const loadTemplate = (e:any) => {
        window.addEventListener("message", (event) => getDynamic(event));
    }

    const getDynamic = (e:any) => {
        console.log(e.data.t)
    }

    const reloadFrame = () => {
        setState({counter: state.counter + 1});
    }

    const onPlay = () => {
        setState({isPlay: !state.isPlay})
    }

    return(
        <div className="IFrame">
            <Row style={{width: 'min-content'}}>
                <Col flex="auto" style={{lineHeight: 0}}>
                    <iframe
                        key={state.counter}
                        width={templates.selectedWidth}
                        height={templates.selectedHeight}
                        title={templates.selected.name}
                        src={templates.selectedURL}
                        frameBorder="0"
                        onLoad={(e:any) => loadTemplate(e)}
                    />
                </Col>
                <Col span={24}>
                    <Row style={{ backgroundColor: "#000000a8", alignItems: "center", marginTop: '2px', padding:'0 0.3em'}}>
                        <Col><Button onClick={onPlay} style={{color:"#ddd"}} type="link" size="small" icon={ state.isPlay ? <PauseOutlined/> : <CaretRightOutlined /> } /></Col>
                        <Col flex="auto"><Slider defaultValue={30} onChange={onChange} onAfterChange={onAfterChange} /></Col>
                        <Col><Button onClick={reloadFrame} style={{ color: "#ddd" }} type="link" size="small" icon={<ReloadOutlined />} /></Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default IFrame;