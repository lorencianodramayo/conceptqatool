import React, { FC } from 'react';
import axios from 'axios';
import { Row, Col, Typography, Button, Select, Drawer, Popover, Tooltip } from 'antd';
import { useSetState, useMount } from 'ahooks';
import { 
    UnorderedListOutlined, 
    SettingOutlined,
    SaveFilled,
    TranslationOutlined,
    PictureOutlined,
    StrikethroughOutlined,
    FontSizeOutlined,
    CheckOutlined
} from '@ant-design/icons';

//components

import IFrame from './Stage/IFrame';

import './Stage.less'

const { Title } = Typography;
const { Option } = Select;

interface State {
    visible: boolean;
 }

const Stage: FC = () => {
    const [state, setState] = useSetState<State>({
        visible: false
    });
    
    useMount(() => {
        //axios.get()
    });

    const handleChange = () => {

    }

    const onClose = () => {
        setState({visible: !state.visible})
    }

    return (
        <Row className="Stage">
            {/* Header  */}
            <Col span={24} className="header">
                <Row>
                    <Col span={12}>
                        <Title level={4} style={{margin:0}} className="title">h3. Ant Design</Title>
                    </Col>
                    <Col span={12}>
                        <Row style={{justifyContent: "flex-end"}} gutter={[4,0]}>
                            <Col span={8}>
                                <Select defaultValue="lucy" style={{width: "100%"}} onChange={handleChange}>
                                    <Option value="jack">300x600</Option>
                                    <Option value="lucy">728x90</Option>
                                    <Option value="Yiminghe">120x600</Option>
                                </Select>
                            </Col>
                            <Col>
                                <Button type="primary" icon={<UnorderedListOutlined />} onClick={onClose}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            {/* Content  */}
            <Col span={24} className="content">
                <IFrame />
            </Col>
            
            <Drawer closable={false} maskStyle={{opacity: 0, background: 'transparent'}} title="Basic Drawer" placement="right" onClose={onClose} visible={state.visible}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
            <div className="affix-container">
                <Popover
                    placement="topLeft" 
                    content={
                        <Row gutter={[0, 8]}>
                            <Col span={24}>
                                <Tooltip title="Show Image" color="purple" placement="right">
                                    <Button style={{ backgroundColor: "#fff" }} type="primary" ghost shape="circle" icon={<PictureOutlined spin={false} />} />
                                </Tooltip>
                            </Col>
                            <Col span={24}>
                                <Tooltip title="Text Settings" color="purple" placement="right">
                                    <Button style={{ backgroundColor: "#fff" }} type="primary" ghost shape="circle" icon={<FontSizeOutlined spin={false} />} />
                                </Tooltip>
                            </Col>
                            <Col span={24}>
                                <Tooltip title="Split Text" color="purple" placement="right">
                                    <Button style={{ backgroundColor: "#fff" }} type="primary" ghost shape="circle" icon={<StrikethroughOutlined spin={false} />} />
                                </Tooltip>
                            </Col>
                            <Col span={24}>
                                <Tooltip title="Language" color="purple" placement="right">
                                    <Button style={{ backgroundColor: "#fff" }} type="primary" ghost shape="circle" icon={<TranslationOutlined spin={false} />} />
                                </Tooltip>
                            </Col>
                            <Col span={24}>
                                <Tooltip title="Add to preview" color="purple" placement="right">
                                    <Button style={{ backgroundColor: "#fff" }} type="primary" ghost shape="circle" icon={<SaveFilled spin={false} />} />
                                </Tooltip>
                            </Col>
                        </Row>
                        } 
                    trigger="click"
                >
                    <Button type="primary" shape="circle" size="large" icon={<SettingOutlined spin={false}/>}/>
                </Popover>
            </div>
        </Row>
    )
}

export default Stage;