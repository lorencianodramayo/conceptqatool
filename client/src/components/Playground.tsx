import React, { FC } from 'react';
import { useSetState, useSessionStorageState } from 'ahooks';
import { useParams, Link } from "react-router-dom";
import { Layout, Menu, Row, Col } from 'antd';
import Icon, {
    ExperimentOutlined,
    BlockOutlined,
} from "@ant-design/icons";

//components
import Stage from './Stage';
import Preview from './Preview';

import './Playground.less';
import logo from "../assets/playground/main-logo.svg";

const { Header, Content, Footer } = Layout;

interface State {
   data: object;
}

const Playground: FC = () => {
    const [state, setState] = useSetState<State>({
        data: {}
    });

    const [menuKey, setMenuKey] = useSessionStorageState('header-menu', {
        defaultValue: 'playground',
    });
    
    const showPanels = (e: any) => {
        setMenuKey(e.key)
    }
    return (
        <Layout className="Playground">
            <Header>
                <Row>
                    <Col>
                        <div className="logo">
                            <Link to={`/`}>
                                <img src={logo} alt="QA" />
                            </Link>
                        </div>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={[`${menuKey}`]}
                            onClick={(e)=>showPanels(e)}
                        >
                            <Menu.Item key="playground" icon={<ExperimentOutlined />}>
                                Playground
                            </Menu.Item>
                            <Menu.Item key="preview" icon={<BlockOutlined />}>
                                Preview
                            </Menu.Item>
                        </Menu>
                    </Col>
                </Row>
            </Header>
            <Content>
                {
                    menuKey === 'playground' ? <Stage /> : <Preview />
                }
            </Content>
        </Layout>
    );
}

export default Playground;