import { Form, Input } from 'antd';
import React, { FC } from 'react';

interface Property {
    label: string;
}

const NormalText: FC<Property> = ({label}) => {
    return (
        <Form.Item name={label} label={label} required >
            <Input />
        </Form.Item>
    )
}

export default NormalText;