import React, { FC } from 'react';
import { useDispatch } from "react-redux";
import { useSetState, useLocalStorageState, useMount } from 'ahooks';
import { useParams, Link } from "react-router-dom";
import { Layout, Menu, Row, Col } from 'antd';
import {
    ExperimentOutlined,
    BlockOutlined,
} from "@ant-design/icons";

//components
import Stage from './Stage';
import Preview from './Preview';

//reducers
import { setData } from '../reducers/playground';

import './Playground.less';
import logo from "../assets/playground/main-logo.svg";
import axios from 'axios';

const { Header, Content } = Layout;

interface State {
    data: any;
    menuKey: string;
}

const Playground: FC = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [menuKey, setMenuKey] = useLocalStorageState(`${id}_tab`);
    const [state, setState] = useSetState<State>({
        data: [],
        menuKey: menuKey === undefined ? 'playground' : menuKey
    });

    useMount(() => {

        axios.get("/playgroundAPI/", { params: { id } })
            .then((res) => {
                res.data.templates.map((data: string) => {
                    axios.get('/playgroundAPI/getTemplate', { params: { id: data } })
                        .then((template) => {
                            dispatch(setData(template.data));
                            setState((prevState) => ({
                                data: [template.data, ...prevState.data]
                            }));
                        });

                    return true;
                });
            })
    });

    const showPanels = (e: any) => {
       setMenuKey(e.key);
        setState({ menuKey: e.key })
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
                            defaultSelectedKeys={[state.menuKey]}
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
                    state.menuKey === 'playground' ? <Stage /> : <Preview />
                }
            </Content>
        </Layout>
    );
}

export default Playground;