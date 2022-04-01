import React, { FC } from 'react';
import { Row, Col, Typography, Button, Select, Drawer } from 'antd';
import { useSetState } from 'ahooks';
import { UnorderedListOutlined } from '@ant-design/icons';

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
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                    <Option value="disabled" disabled>
                                        Disabled
                                    </Option>
                                    <Option value="Yiminghe">yiminghe</Option>
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
                test
            </Col>
            
            <Drawer mask={false} title="Basic Drawer" placement="right" onClose={onClose} visible={state.visible}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </Row>
    )
}

export default Stage;