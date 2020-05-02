import React, { Component } from 'react';
import Routes from './routes';
import DocumentTitle from 'react-document-title';
import SiderCustom from './components/SiderCustom';
import HeaderCustom from './components/HeaderCustom';
import { Layout, notification, Icon } from 'antd';
import { ThemePicker } from './components/widget';
import { connectAlita } from 'redux-alita';
import { checkLogin } from './utils';
import { fetchTenantMenu, fetchAdminMenu } from './axios';
import umbrella from 'umbrella-storage';

const { Content, Footer } = Layout;

type AppProps = {
    setAlitaState: (param: any) => void;
    auth: any;
    responsive: any;
};

class App extends Component<AppProps> {
    state = {
        collapsed: false,
        title: '',
    };
    componentWillMount() {
        const { setAlitaState } = this.props;
        let user = umbrella.getLocalStorage('user');
        // user = storageUser && JSON.parse(storageUser);
        user && setAlitaState({ stateName: 'auth', data: user });
        this.getClientWidth();
        window.onresize = () => {
            this.getClientWidth();
        };
        // localStorage.getItem('@primary-color') || '#778899',
    }
    componentDidMount() {
        this.openFNotification();
        this.fetchSmenu();
    }

    // componentWillReceiveProps(nextProps: AppProps) {
    //     if (nextProps.auth && nextProps.auth !== this.props.auth) {
    //         this.fetchSmenu();
    //     }
    // }

    openFNotification = () => {

    };
    /**
     * 获取服务端异步菜单
     */
    fetchSmenu = () => {
        const setAlitaMenu = (menus: any) => {
            this.props.setAlitaState({ stateName: 'smenus', data: menus });
        };
        const role = this.props.auth && this.props.auth.data.role;
        if (role === '系统管理员') {
            fetchAdminMenu().then(smenus => {
                setAlitaMenu(smenus);
                umbrella.setLocalStorage('smenus', smenus);
            });
        } else {
            fetchTenantMenu().then(smenus => {
                setAlitaMenu(smenus);
                umbrella.setLocalStorage('smenus', smenus);
            });
        }
    };

    getClientWidth = () => {
        // 获取当前浏览器宽度并设置responsive管理响应式
        const { setAlitaState } = this.props;
        const clientWidth = window.innerWidth;
        console.log(clientWidth);
        setAlitaState({ stateName: 'responsive', data: { isMobile: clientWidth <= 992 } });
        // receiveData({isMobile: clientWidth <= 992}, 'responsive');
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    render() {
        const { title } = this.state;
        const { auth = { data: {} }, responsive = { data: {} } } = this.props;
        return (
            <DocumentTitle title={title}>
                <Layout>
                    {!responsive.data.isMobile && checkLogin(auth.data.permissions) && (
                        <SiderCustom collapsed={this.state.collapsed} />
                    )}
                    {/* <ThemePicker /> */}
                    <Layout style={{ flexDirection: 'column' }}>
                        <HeaderCustom
                            toggle={this.toggle}
                            collapsed={this.state.collapsed}
                            user={auth.data || {}}
                        />
                        <Content style={{ margin: '0 16px', overflow: 'initial', flex: '1 1 0' }}>
                            <Routes auth={auth} />
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            共享停车位信息管理系统 ©{new Date().getFullYear()}
                        </Footer>
                    </Layout>
                </Layout>
            </DocumentTitle>
        );
    }
}

export default connectAlita(['auth', 'responsive'])(App);
