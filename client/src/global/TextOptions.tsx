import React, { FC } from 'react';
import {
    Form,
    Input,
    Collapse,
    Radio,
    Row,
    Col,
    InputNumber,
} from "antd";

import {
    FieldNumberOutlined,
} from "@ant-design/icons";
import { RootStateOrAny, useSelector } from 'react-redux';

const { Panel } = Collapse;

interface Property {
    label: string;
}

const TextOptions: FC<Property> = ({label}) => {
    const templates = useSelector((state: RootStateOrAny) => state.playground.value);

    const removeTags = (txt: any) => {
        if (templates.entity[templates.selectedID]) {
            var html = templates.entity[templates.selectedID][txt];
            var div = document.createElement(`div_${txt}`);
            div.innerHTML = html;
            var text = div.textContent || div.innerText || "";

            return text.split("").length;
        }
    }
    return (
        <React.Fragment>
            <Form.Item 
                required
                name={label}
                label={label}
            >
                <Input />
            </Form.Item>
            <Collapse
                bordered={false}
                activeKey={1}
                expandIconPosition="right"
                ghost={true}
            >
                <Panel showArrow={false} header={null} key={1}>
                    <Row>
                        <Col span={12}>
                            <Radio.Group
                                size="small"
                            >
                                <Radio.Button value="sentence">
                                    Aa
                                </Radio.Button>
                                <Radio.Button value="upper">
                                    AA
                                </Radio.Button>
                                <Radio.Button value="lower">
                                    aa
                                </Radio.Button>
                            </Radio.Group>
                        </Col>
                        <Col span={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                            <InputNumber 
                                addonBefore={<FieldNumberOutlined />} 
                                value={removeTags(label)}
                                min={1}
                                size="small"
                                style={{ width: "calc(100% - 50px)" }}
                                placeholder="count"
                                onChange={() => {}}
                            />
                        </Col>
                    </Row>
                </Panel>
            </Collapse>
        </React.Fragment>
    )
}

export default TextOptions;