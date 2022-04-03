import React, { FC } from 'react';
import { Form, Select } from "antd";

const { Option } = Select;

interface Property {
    label: string;
    options: any;
}

const TextSelect: FC<Property> = ({label, options}) => {
    return (
        <Form.Item name={label} label={label} required>
            <Select>
                {options.map((data: any, index: number) => {
                    return (
                        <Option
                            value={
                                data.split("")[0] === " "
                                    ? data.split("").slice(1).join("")
                                    : data
                            }
                            key={index}
                        >
                            {data.split("")[0] === " "
                                ? data.split("").slice(1).join("")
                                : data}
                        </Option>
                    );
                })}
            </Select>
        </Form.Item>
    )
}

export default TextSelect;