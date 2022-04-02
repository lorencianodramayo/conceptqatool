import React, { FC } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { Drawer } from 'antd';

interface Property {
    isVisible: boolean;
    onClose: any;
}

const DrawerElement: FC<Property> = ({isVisible, onClose}) => {
    const templates = useSelector((state:RootStateOrAny) => state.playground.value);

    return <Drawer closable={false} maskStyle={{opacity: 0, background: 'transparent'}} title={`${templates.selectedCount} Dynamic Elements`} placement="right" onClose={onClose} visible={isVisible}>
            {
                Object.keys(templates.selected).map((data: any) => {
                    return <p key={data}>{templates.selected[data]}</p>
                })
            }
        </Drawer>
}

export default DrawerElement;