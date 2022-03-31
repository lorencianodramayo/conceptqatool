import React, { FC } from 'react';
import axios from 'axios';
import { Row, Col, Card, Typography, Form, Button } from 'antd';
import { useMount, useSetState } from 'ahooks';


import Selection from '../global/Selection';

import './HomePage.less';

const { Title } = Typography;

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
}

export type TObjects = Objects[];


const HomePage: FC = () => {
    const [form] = Form.useForm();
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
        }
    });

    useMount(() => {
        axios.get<TObjects>("/adlibAPI/getPartners")
            .then((res) => setState({ partner: { data: res.data, status: true }}));
    });


    const onRequiredTypeChange = () => {
        if (form.getFieldsValue().Partner !== undefined){
            axios.get<TObjects>("/adlibAPI/getConcepts", { params: { pId: form.getFieldsValue().Partner } })
                .then((res) => setState({ concept: { data: res.data, status: true } }))
        }
        
        if (form.getFieldsValue().Partner !== undefined && form.getFieldsValue().Concept !== undefined){
            axios.get<TObjects>("/adlibAPI/getCreatives", { params: { pId: form.getFieldValue("Partner"), cId: form.getFieldValue("Concept") } })
                .then((res) => setState({ channel: { data: res.data, status: true } }))
        }
    }

    return (
        <Row className="HomePage">
            <Col xs={24} sm={24} md={12} xl={10} xxl={12} className="HomePage-column">
                <Card 
                    title={<Title>Concept <span>QA Tool</span></Title>} 
                    bordered={false} 
                    actions={[
                        <Button disabled={true}>Back</Button>,
                        <Button type="primary" loading={false} disabled={true}>
                            Template
                        </Button>,
                    ]}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onValuesChange={onRequiredTypeChange}
                    > 
                        <Selection name="Partner" data={state.partner.data.body} status={state.partner.status} />
                        <Selection name="Concept" data={state.concept.data.body} status={state.concept.status} />
                        <Selection name="Channel" data={state.channel.data.body && state.channel.data.body.templates !== undefined ? state.channel.data.body.templates : null} status={state.channel.status} />
                    </Form>
                </Card>
            </Col>
        </Row>
    );
}

export default HomePage;