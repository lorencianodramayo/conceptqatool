import React, { FC } from 'react';
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Row, Col, Typography, Button, Select, Popover, Tooltip } from 'antd';
import { useSetState, useMount, useLocalStorageState } from 'ahooks';
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
import DrawerElement from '../global/DrawerElement';

import './Stage.less'

//reducers
import { setSelected } from '../reducers/playground';

const { Title } = Typography;
const { Option } = Select;

interface State {
    visible: boolean;
    template: any;
 }

const Stage: FC = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const templates = useSelector((state:RootStateOrAny) => state.playground.value);
    const [defaultTemplate, setDefaultTemplate] = useLocalStorageState(`${id}_default`);
    const [state, setState] = useSetState<State>({
        visible: false,
        template: []
    });
    
    useMount(() => {
        if(templates !== undefined){
            if(defaultTemplate === undefined){
                setDefaultTemplate(templates.data[0]);
                setState({template: templates.data[0]});
                dispatch(setSelected(templates.data[0]));
            }else{
                setState({template: defaultTemplate});
                dispatch(setSelected(defaultTemplate));
            }
        }
    });

    const handleChange = (e:any) => {
        setState({template: templates.data.find((item: { _id: any; }) => item._id === e)});
        setDefaultTemplate(templates.data.find((item: { _id: any; }) => item._id === e));
        dispatch(setSelected(templates.data.find((item: { _id: any; }) => item._id === e)));
    }

    const onClose = () => {
        setState({visible: !state.visible});
    }

    return (
        <Row className="Stage">
            {/* Header  */}
            <Col span={24} className="header">
                <Row>
                    <Col span={12}>
                        <Title level={4} style={{margin:0}} className="title">{state.template.name}</Title>
                    </Col>
                    <Col span={12}>
                        <Row style={{justifyContent: "flex-end"}} gutter={[4,0]}>
                            <Col span={8}>
                                <Select value={state.template._id} style={{width: "100%"}} onChange={handleChange}>
                                    {
                                        templates && templates.data.map((data: any) => {
                                            return <Option value={data._id} key={data._id}>{data.size}</Option>
                                        })
                                    }
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
            <DrawerElement isVisible={state.visible} onClose={onClose} />
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