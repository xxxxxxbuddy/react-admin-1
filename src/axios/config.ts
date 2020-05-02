/**
 * Created by 叶子 on 2017/7/30.
 * 接口地址配置文件
 */
const ak = 'GbWScU84GAm2QjHVkiyRMeOC7QLSN0He';
 const PREFIX = 'http://localhost:1234/api';
//easy-mock模拟数据接口地址
const MOCK_API = 'https://react-admin-mock.now.sh/api';
export const MOCK_AUTH_ADMIN = MOCK_API + '/admin.js'; // 管理员权限接口
export const MOCK_AUTH_VISITOR = MOCK_API + '/visitor.js'; // 访问权限接口
/** 服务端异步菜单接口 */
export const MOCK_MENU = `${MOCK_API}/menu.js`;

// github授权
export const GIT_OAUTH = 'https://github.com/login/oauth';
// github用户
export const GIT_USER = 'https://api.github.com/user';

// bbc top news
export const NEWS_BBC =
    'https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=429904aa01f54a39a278a406acf50070';

export const USER = {
    USER_INFO: PREFIX + '/user/getinfo',
    UPDATE: PREFIX + '/user/update',
    DELETE: PREFIX + '/user/delete',
}

export const CAR = {
    INFO: PREFIX + '/car/get',
    UPDATE: PREFIX + '/car/update',
    DELETE: PREFIX + '/car/delete',
}

export const CARPORT = {
    INFO: PREFIX + '/carport/get',
    UPDATE: PREFIX + '/carport/update',
    DELETE: PREFIX + '/carport/delete',
    PARKINGLOT_STATE: PREFIX + '/carport/parkinglot_state',
}

export const PARKINGLOT = {
    INFO: PREFIX + '/parkinglot/get',
    UPDATE: PREFIX + '/parkinglot/update',
    DELETE: PREFIX + '/parkinglot/delete',
}

export const AUTHORITY = {
    INFO: PREFIX + '/authority/get',
    UPDATE: PREFIX + '/authority/update',
    ADD: PREFIX + '/authority/add',
}

export const TENANT = {
    INFO: PREFIX + '/tenant/get',
    UPDATE: PREFIX + '/tenant/update',
    DELETE: PREFIX + '/tenant/delete',
}

export const ORDER = {
    INFO: PREFIX + '/order/get',
    UPDATE: PREFIX + '/tenant/update',
    DELETE: PREFIX + '/order/delete',
}

export const LOGIN = PREFIX + '/login';

export const BMAP = {
    GET_PARKING: `/map/place/v2/search?query=停车场&tag=交通设施&location=22.517937,113.932428&radius=5000&output=json&ak=${ak}`,
}