import React, { FC, createRef, useRef } from 'react';
import axios from 'axios';
import { Row, Col, Card, Typography, Form, Button, Carousel, Checkbox, Select, Modal } from 'antd';
import { useMount, useSetState } from 'ahooks';


import Selection from '../global/Selection';

import './HomePage.less';

const { Title } = Typography;
const { Option } = Select;

interface Objects {
    id: number;
    userId?: number;
    title: string;
    body: string;
}

interface State {
    partner: any;
    concept: any;
    channel: any;
    showModal: boolean;
}

export type TObjects = Objects[];


const HomePage: FC = () => {
    const [form] = Form.useForm();
    const carouselRef: any = createRef();
    const formRef = useRef(null)
    const [state, setState] = useSetState<State>({
        partner: {
            data: [],
            status: false, 
        },
        concept: {
            data: [],
            status: false,
        },
        channel: {
            data: [],
            status: false,
        },
        showModal: false
    });

    useMount(() => {
        axios.get<TObjects>("/adlibAPI/getPartners")
            .then((res) => setState({ partner: { data: res.data, status: true }}));
    });


    const onRequiredTypeChange = () => {
        if (form.getFieldsValue().Partner !== undefined){
            axios.get<TObjects>("/adlibAPI/getConcepts", { params: { pId: form.getFieldsValue().Partner } })
                .then((res) => setState({ concept: { data: res.data, status: true } }))
        }else{
            form.setFieldsValue({
                Concept: undefined,
                Channel: undefined
            });

            setState({
                concept: {data: [], status: false},
                channel: {data: [], status: false}
            })
        }
        
        if (form.getFieldsValue().Partner !== undefined && form.getFieldsValue().Concept !== undefined){
            axios.get<TObjects>("/adlibAPI/getCreatives", { params: { pId: form.getFieldValue("Partner"), cId: form.getFieldValue("Concept") } })
                .then((res) => setState({ channel: { data: res.data, status: true } }))
                
               // .then((res) => console.log(res.data))
        }else{
            form.setFieldsValue({
                Channel: undefined
            });

            setState({
                channel: {data: [], status: false}
            })
        }
    }

    return (
        <Row className="HomePage">
            <Col xs={24} sm={24} md={12} xl={8} xxl={10} className="HomePage-column">
                <Card 
                    title={<Title>Concept <span>QA Tool</span></Title>} 
                    bordered={false} 
                    actions={[
                        <Button disabled={true}>Back</Button>,
                        <Button type="primary" loading={false} disabled={form.getFieldsValue().Channel !== undefined? false : true} onClick={()=> carouselRef.current.next()}>
                            Template
                        </Button>,
                    ]}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onValuesChange={onRequiredTypeChange}
                        ref={formRef}
                    > 
                        <Carousel ref={carouselRef} dots={false}>
                            <div>
                                <Selection name="Partner" data={state.partner.data.body} status={state.partner.status} />
                                <Selection name="Concept" data={state.concept.data.body} status={state.concept.status} />
                                <Selection name="Channel" data={state.channel.data.body && state.channel.data.body.templates !== undefined ? state.channel.data.body.templates : null} status={state.channel.status} />
                            </div>
                            <div>
                                <Row gutter={[8, 8]}>
                                    {
                                        state.channel.data.body && state.channel.data.body !== undefined ?
                                           state.channel.data.body.templates && state.channel.data.body.templates.map((data: any, index: any) => {
                                                return data.suitableChannels[0] === form.getFieldsValue().Channel && data.suitableChannels.length === 1?
                                                   <React.Fragment key={index}>
                                                       <Col span={1}>
                                                            <Form.Item name={data._id} valuePropName="checked" style={{ margin: 0 }}>
                                                               <Checkbox />
                                                           </Form.Item>
                                                       </Col>

                                                        <Col span={7} style={{ display: "flex", fontWeight: 700, alignItems: "center", justifyContent: "center", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingLeft: '0.8em' }}>{data.size}</Col>

                                                       <Col span={11}>
                                                           <Form.Item name={`${data._id}_creativeVersion`} style={{margin: 0}}>
                                                               <Select
                                                                disabled={false}
                                                                placeholder={/^-?\d+$/.test(data.versionName) || data.versionName === null ? `Version ${data.version + 1}` : data.versionName}
                                                                allowClear
                                                                showSearch
                                                                filterOption={(input: string, option: any) =>
                                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                }
                                                               >
                                                                   <Option value="demo">Version 1</Option>
                                                               </Select>
                                                           </Form.Item>
                                                       </Col>

                                                       <Col span={5}>
                                                           <Button block onClick={()=>setState({showModal: true})}>Preview</Button>
                                                       </Col>
                                                    </React.Fragment>
                                                : null
                                            })
                                        :
                                        null
                                    }
                                    <Modal 
                                        centered 
                                        title="Preview" 
                                        visible={state.showModal}
                                        footer={null}
                                        onOk={() => setState({ showModal: false }) }
                                        onCancel={() => setState({ showModal: false }) }
                                    >
                                        <p>Some contents...</p>
                                        <p>Some contents...</p>
                                        <p>Some contents...</p>
                                    </Modal>
                                </Row>
                            </div>
                        </Carousel>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
}

export default HomePage;