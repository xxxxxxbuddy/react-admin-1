import axios from 'axios';
import { get, post, del, put } from './tools';
import * as config from './config';

export const getBbcNews = () => get({ url: config.NEWS_BBC });
export const getUserInfo = () => get({ url: config.USER.USER_INFO });
export const updateUserInfo = (data: any) => post({ url: config.USER.UPDATE, data });
export const deleteUser = (data: string[]) => del({ url: config.USER.DELETE, data });

export const getCarInfo = (id: string) => get({ url: config.CAR.INFO, msg: '接口异常', config: {params: {user_id: id}}});


export const getCarportInfo = () => get({ url: config.CARPORT.INFO });
export const updateCarportInfo = (data: any) => post({ url: config.CARPORT.UPDATE, data });
export const deleteCarport = (data: string[]) => del({ url: config.CARPORT.DELETE, data });

export const getParkinglotInfo = () => get({ url: config.PARKINGLOT.INFO });
export const updateParkinglotInfo = (data: any) => post({ url: config.PARKINGLOT.UPDATE, data });
export const deleteParkinglot = (data: string[]) => del({ url: config.PARKINGLOT.DELETE, data });
export const getParkinglotState = () => get({ url: config.CARPORT.PARKINGLOT_STATE });

export const getTenantInfo = () => get({ url: config.TENANT.INFO });
export const updateTenantInfo = (data: any) => post({ url: config.TENANT.UPDATE, data });
export const deleteTenant = (data: string[]) => del({ url: config.TENANT.DELETE, data });

export const getOrderInfo = () => get({ url: config.ORDER.INFO });
export const updateOrderInfo = (data: any) => post({ url: config.ORDER.UPDATE, data });
export const deleteOrder = (data: string[]) => del({ url: config.ORDER.DELETE, data });

export const addAuthority = (data: any) => put({ url: config.AUTHORITY.ADD, data });
export const getAuthorityInfo = () => get({ url: config.AUTHORITY.INFO });
export const updateAuthorityInfo = (data: any) => post({ url: config.AUTHORITY.UPDATE, data });

export const login = (data: any) => post({ url: config.LOGIN, data});
export const npmDependencies = () =>
    axios
        .get('./npm.json')
        .then(res => res.data)
        .catch(err => console.log(err));

export const weibo = () =>
    axios
        .get('./weibo.json')
        .then(res => res.data)
        .catch(err => console.log(err));

export const gitOauthLogin = () =>
    get({
        url: `${config.GIT_OAUTH}/authorize?client_id=792cdcd244e98dcd2dee&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin`,
    });
export const gitOauthToken = (code: string) =>
    post({
        url: `https://cors-anywhere.herokuapp.com/${config.GIT_OAUTH}/access_token`,
        data: {
            client_id: '792cdcd244e98dcd2dee',
            client_secret: '81c4ff9df390d482b7c8b214a55cf24bf1f53059',
            redirect_uri: 'http://localhost:3006/',
            state: 'reactAdmin',
            code,
        },
    });
// {headers: {Accept: 'application/json'}}
export const gitOauthInfo = (access_token: string) =>
    get({ url: `${config.GIT_USER}access_token=${access_token}` });

// easy-mock数据交互
// 管理员权限获取
export const admin = () => {
    return new Promise(resolve => {
        resolve({"uid":1,"permissions":["user/management","tenant/management","carport/management","order/management","notification","authority"],"role":"系统管理员","roleType":1,"userName":"系统管理员"})
    });
};
// 访问权限获取
export const tenant = () => {
    return new Promise(resolve => {
        resolve({"uid":2,"permissions":["carport/management","order/management",],"role":"租户","roleType":2,"userName":"租户"})
    });
}
/** 获取服务端菜单 */
export const fetchTenantMenu = () => new Promise(resolve => resolve([
    { key: '/app/dashboard/index', title: '首页', icon: 'home', component: 'Dashboard' },
    {
        key: '/app/carport/management',
        title: '车位信息管理',
        icon: 'table',
        component: 'CarportManagement',
        requireAuth: 'carport/management',
    },
    {
        key: '/app/order/management',
        title: '订单管理',
        icon: 'switcher',
        component: 'OrderManagement',
        requireAuth: 'order/management',
    },
]));
export const fetchAdminMenu = () => new Promise(resolve => resolve(
    [{ key: '/app/dashboard/index', title: '首页', icon: 'home', component: 'Dashboard' },
    {
      key: '/app/user/management',
      title: '用户信息管理',
      icon: 'user',
      component: 'UserManagement',
      requireAuth: 'user/management',
    },
    {
      key: '/app/carport/management',
      title: '车位信息管理',
      icon: 'table',
      component: 'CarportManagement',
      requireAuth: 'carport/management',
    },
    {
      key: '/app/tenant/management',
      title: '租户信息管理',
      icon: 'team',
      component: 'TenantManagement',
      requireAuth: 'tenant/management',
    },
    {
        key: '/app/order/management',
        title: '订单管理',
        icon: 'switcher',
        component: 'OrderManagement',
        requireAuth: 'order/management',
    },
    {
      key: '/app/notification',
      title: '通知管理',
      icon: 'notification',
      requireAuth: 'notification',
    },
    {
      key: '/app/authority',
      title: '权限管理',
      icon: 'safety',
      component: 'AuthorityManagement',
      requireAuth: 'authority',
    },]
));


export const getParkingList = () => get({ url: config.BMAP.GET_PARKING });