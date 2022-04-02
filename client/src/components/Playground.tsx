import React, { FC } from 'react';
import { useSetState, useSessionStorageState, useMount } from 'ahooks';
import { useParams, Link } from "react-router-dom";
import { Layout, Menu, Row, Col } from 'antd';
import {
    ExperimentOutlined,
    BlockOutlined,
} from "@ant-design/icons";

//components
import Stage from './Stage';
import Preview from './Preview';

import './Playground.less';
import logo from "../assets/playground/main-logo.svg";
import axios from 'axios';

const { Header, Content } = Layout;

interface State {
    data: any;
}

const Playground: FC = () => {
    const { id } = useParams();
    const [, setState] = useSetState<State>({
        data: []
    });

    useMount(() => {
        axios.get("/playgroundAPI/", { params: { id } })
            .then((res) => {
                res.data.templates.map((data: string) => {
                    axios.get('/playgroundAPI/getTemplate', { params: { id: data } })
                        .then((template) => {
                            setState((prevState) => ({
                                data: [template.data, ...prevState.data]
                            }));
                        });

                    return true;
                });
            })
    })

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
                            onClick={(e) => showPanels(e)}
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