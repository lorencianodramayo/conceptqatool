import React, { FC, createRef, useRef } from 'react';
import axios from 'axios';
import { EyeOutlined } from '@ant-design/icons';
import { Row, Col, Card, Typography, Form, Button, Carousel, Checkbox, Select, Modal } from 'antd';
import { useMount, useSetState } from 'ahooks';
import { useNavigate } from "react-router-dom";

import Selection from '../global/Selection';

import './HomePage.less';

const { Title, Paragraph } = Typography;
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
    modal: any;
    slide: number;
}

export type TObjects = Objects[];


const HomePage: FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const carouselRef: any = createRef();
    const formRef = useRef(null);
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
        modal: {
            showModal: false,
            data: {}
        },
        slide: 0
    });

    useMount(() => {
        axios.get<TObjects>("/adlibAPI/getPartners")
            .then((res) => setState({ partner: { data: res.data, status: true } }));
    });


    const onRequiredTypeChange = () => {
        if (form.getFieldsValue().Partner !== undefined) {
            axios.get<TObjects>("/adlibAPI/getConcepts", { params: { pId: form.getFieldsValue().Partner } })
                .then((res) => setState({ concept: { data: res.data, status: true } }))
        } else {
            form.setFieldsValue({
                Concept: undefined,
                Channel: undefined
            });

            setState({
                concept: { data: [], status: false },
                channel: { data: [], status: false }
            })
        }

        if (form.getFieldsValue().Partner !== undefined && form.getFieldsValue().Concept !== undefined) {
            axios.get<TObjects>("/adlibAPI/getCreatives", { params: { pId: form.getFieldValue("Partner"), cId: form.getFieldValue("Concept") } })
                .then((res) => setState({ channel: { data: res.data, status: true } }))

               // .then((res) => console.log(res.data))
        } else {
            form.setFieldsValue({
                Channel: undefined
            });

            setState({
                channel: { data: [], status: false }
            })
        }
    }

    const onPreview = (size: string, defaultId: string) => {
        let id = form.getFieldsValue()[`${size}_creativeVersion`] === undefined ? defaultId : form.getFieldsValue()[`${size}_creativeVersion`];
        //setState({ modal: { showModal: true } }
        axios.get<TObjects>("/adlibAPI/getTemplate", { params: { tId: id, pId: form.getFieldsValue().Partner, type: "normal" } })
            .then((res) => { setState({ modal: { showModal: true, data: res.data }}) })
    }

    const onSave = () => {
        let arr: any[] = [],
            ids: any[] = [],
            count: number = 0;

        Object.keys(form.getFieldsValue()).map((data: any) => {
            let item = data.split("_").filter((element: any, index: any) => index < data.split("_").length - 1).join("_");

            return (
                (!['Partner', 'Concept', 'Channel'].includes(data)) ?
                    (arr.indexOf(item) === -1) ? arr.push(item) : null
                    : null
            )
        });

        arr.map((data: any) => {
                if (form.getFieldsValue()[`${data}_creativeSelected`] === true){
                    count++;
                    axios.get<TObjects>("/adlibAPI/getTemplate", { params: { tId: form.getFieldsValue()[`${data}_creativeVersion`], pId: form.getFieldsValue().Partner, type: "db" } })
                    .then((res) => {
                        Object.keys(res.data).map((key: any) => {
                            return (key === '_id')?
                            ids.push(res.data[key]) : null;
                        })

                        if(ids.length === count){
                            axios.post("/playgroundAPI/newPlayground", {
                                templates: ids
                            }).then((resp) =>  {
                                if(resp.status === 200){
                                    Object.keys(resp.data).map((key: any) => {
                                        return (key === '_id')?
                                        navigate(`/playground/${resp.data[key]}`) : null;
                                    })
                                }
                            })
                        }
                    })
                }
            return true;
        })
    }

    return (
        <Row className="HomePage">
            <Col xs={24} sm={24} md={12} xl={8} xxl={10} className="HomePage-column">
                <Card
                    title={<Title>Concept <span>QA Tool</span></Title>}
                    bordered={false}
                    actions={[
                        <Button disabled={state.slide === 0} onClick={() => carouselRef.current.prev() }>Back</Button>,
                        
                        <Button type="primary" loading={false} disabled={form.getFieldsValue().Channel !== undefined ? false : true} onClick={() => state.slide === 0 ? carouselRef.current.next() : onSave()}>
                            {state.slide === 0? `Templates` : `Lets go!`}
                        </Button>,
                    ]}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onValuesChange={onRequiredTypeChange}
                        ref={formRef}
                    >
                        <Carousel ref={carouselRef} dots={false} afterChange={(e) => setState({ slide: e})}>
                            <div>
                                <Selection name="Partner" data={state.partner.data.body} status={state.partner.status} />
                                <Selection name="Concept" data={state.concept.data.body} status={state.concept.status} />
                                <Selection name="Channel" data={state.channel.data.body && state.channel.data.body.templates !== undefined ? state.channel.data.body.templates : null} status={state.channel.status} />
                            </div>
                            <div>
                                <Row gutter={[8, 8]}>
                                    {
                                        state.channel.data.body && state.channel.data.body !== undefined ?
                                            state.channel.data.body.templates && state.channel.data.body.templates.sort((a: any, b: any) => a.size > b.size ? 1 : -1).map((data: any, index: any) => {
                                                return data.suitableChannels[0] === form.getFieldsValue().Channel && data.suitableChannels.length === 1 ?
                                                    <React.Fragment key={index}>
                                                        <Col span={6} style={{display: 'flex', alignItems: 'center', fontWeight: 700}}>
                                                            <Form.Item name={`${data.name}_${data.size}_creativeSelected`} initialValue={false} valuePropName="checked" style={{ margin: 0 }}>
                                                                <Checkbox>{data.size}</Checkbox>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={7} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Paragraph style={{ margin: 0 }} ellipsis={true ? { tooltip: data.name } : false}> {data.name} </Paragraph>
                                                        </Col>

                                                        <Col span={8}>
                                                            <Form.Item name={`${data.name}_${data.size}_creativeVersion`} initialValue={data._id} style={{ margin: 0 }}>
                                                                <Select
                                                                    disabled={false}
                                                                    allowClear
                                                                    showSearch
                                                                    filterOption={(input: string, option: any) =>
                                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                    }
                                                                >
                                                                    {
                                                                        data.templateVersion.map((template: any, templateCount: number) => {
                                                                            return <Option key={templateCount} value={template.id}>{/^-?\d+$/.test(template.versionName) || template.versionName === null ? `Version ${templateCount + 1}` : `Version ${template.versionName}`}</Option>
                                                                        })
                                                                    }
                                                                    
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>

                                                        <Col span={3}>
                                                            <Button block icon={<EyeOutlined />} onClick={()=> onPreview(data.size, data._id) } />
                                                        </Col>
                                                    </React.Fragment>
                                                    : null
                                            })
                                            :
                                            null
                                    }
                                    <Modal
                                        centered
                                        title={state.modal.data.body && state.modal.data.body.name !== undefined ? `${state.modal.data.body.size}-${state.modal.data.body.name}` : null }
                                        visible={state.modal.showModal}
                                        footer={null}
                                        onOk={() => setState({ modal: { showModal: false, data: {} }})}
                                        onCancel={() => setState({ modal: { showModal: false, data: {} }})}
                                        width="auto"
                                        style={{minWidth:"calc(100% - 200px)"}}
                                        bodyStyle={{ display:"flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 200px)"}}
                                    >
                                        {
                                            state.modal.data.body !== undefined ? 
                                                <iframe frameBorder="0" title={state.modal.data.body.size} width={`${state.modal.data.body.size.split("x")[0]}px`} height={`${state.modal.data.body.size.split("x")[1]}px`} src={`${state.modal.data.body.contentLocation}/index.html`} />
                                            : null
                                        }
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