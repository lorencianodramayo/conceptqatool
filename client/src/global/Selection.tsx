import React, { FC } from 'react';
import { Form, Select, Typography } from 'antd';

const { Option } = Select;
const { Text } = Typography;

interface SelectionName {
    name: string;
    data: any;
    status: boolean;
}


const Selection: FC<SelectionName> = ({ name, data, status }) => {

    const onChange = () => {
    }
    
    const onSearch = () => {

    }

    return (
        <Form.Item name={name} label={<Text strong>{name}</Text>}>
            <Select
                disabled={!status}
                loading={!status}
                allowClear
                showSearch
                placeholder={`Select a ${name}`}
                onChange={onChange}
                onSearch={onSearch}
                filterOption={(input:string, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                size="large"
            >
                {
                    name !== "Channel" ?
                        data && data.sort((a: any, b: any) => a.name > b.name ? 1 : -1).map((data:any) =>  <Option key={data._id} value={data._id}>{data.name}</Option>)
                    : 
                        Array.from(new Set(data && data.map((data: any) => data.suitableChannels.join())))
                            .filter(item => item !== "social,video")
                            .map((data: any, index: any) => {
                                return <Option value={data} key={index} style={{ textTransform: 'capitalize' }}>{data.charAt(0).toUpperCase() + data.slice(1)}</Option>
                    })
                }
            </Select>
        </Form.Item>
    )
}

export default Selection;