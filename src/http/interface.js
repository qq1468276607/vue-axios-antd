import axios from './api'
import qs from 'qs' //序列化数据请求
// 将所有的接口统一起来便于维护

//登录

export const login = (data) => {
    return axios({
        url: '/uc/login',
        method: 'POST',
        data,
    })
}

// 用户管理模块接口开始

export const getList = (data) => {
    return axios({
        url: '/uc/userCenter/getList',
        method: 'POST',
        data,
    })
}

export const getNotNormUserAttrList = (data) => {
    return axios({
        url: '/uc/userCenter/getNotNormUserAttrList',
        method: 'POST',
        data,
    })
}

export const getUserAttrList = (data) => {
    return axios({
        url: '/uc/userCenter/getUserAttrList',
        method: 'POST',
        data,
    })
}


export const updateNormUserAttr = (data) => {
    return axios({
        url: '/uc/userCenter/updateNormUserAttr',
        method: 'POST',
        data,
    })
}

export const getPersonInfoByChaoXing = (data) => {
    return axios({
        url: '/uc/userCenter/getPersonInfoByChaoXing',
        method: 'GET',
        data,
    })
}

export const activateDeactivate = (data) => {
    return axios({
        url: '/uc/userCenter/activateDeactivate',
        method: 'POST',
        data,
    })
}

export const userExport = (data) => {
    return axios({
        url: '/uc/userCenter/export',
        method: 'POST',
        data,
    })
}

export const getUserExport = (data) => {
    return axios({
        url: '/uc/userCenter/getExport',
        method: 'GET',
        data,
    })
}

export const register = (data) => {
    return axios({
        url: '/uc/userCenter/register',
        method: 'POST',
        data,
    })
}

export const removeUnit = (data) => {
    return axios({
        url: '/uc/userCenter/removeUnit',
        method: 'POST',
        data,
    })
}

export const getRemoveList = (data) => {
    return axios({
        url: '/uc/userCenter/getRemoveList',
        method: 'POST',
        data,
    })
}

export const resume = (data) => {
    return axios({
        url: '/uc/userCenter/resume',
        method: 'POST',
        data,
    })
}

export const reAdd = (data) => {
    return axios({
        url: '/uc/userCenter/reAdd',
        method: 'POST',
        data,
    })
}

//新增读者接口
export const getUserType = (data) => {
    return axios({
        url: '/uc/userGroup/get',
        method: 'POST',
        data,
    })
}

export const addUser = (data) => {
    return axios({
        url: '/uc/userCenter/singleReaderReg',
        method: 'POST',
        data,
    })
}

export const editUser = (data) => {
    return axios({
        url: '/uc/userCenter/updateReaderUserInfo',
        method: 'POST',
        data,
    })
}

export const getUserList = (data) => {
    return axios({
        url: '/uc/userCenter/list',
        method: 'POST',
        data,
    })
}

export const deleteUserList = (data) => {
    return axios({
        url: '/uc/userCenter/delete',
        method: 'POST',
        data,
    })
}

export const addModalUserList = (data) => {
    return axios({
        url: '/uc/userCenter/add',
        method: 'POST',
        data,
    })
}

export const getModalUserList = (data) => {
    return axios({
        url: '/uc/userCenter/listNotUser',
        method: 'POST',
        data,
    })
}

export const getCxRoles = (data) => {
    return axios({
        url: '/uc/userCenter/getCxRoles',
        method: 'POST',
        data,
    })
}

export const updateCxRole = (data) => {
    return axios({
        url: '/uc/userCenter/updateCxRole',
        method: 'POST',
        data,
    })
}

export const getCxUserGroup = (data) => {
    return axios({
        url: '/uc/userCenter/getCxUserGroup',
        method: 'POST',
        data,
    })
}

export const getCxByUserId = (data) => {
    return axios({
        url: '/uc/userCenter/getCxByUserId',
        method: 'GET',
        data,
    })
}

//角色管理接口

export const getRoleList = (data) => {
    return axios({
        url: '/uc/role/list',
        method: 'POST',
        data,
    })
}
export const copyRole = (data) => {
    return axios({
        url: '/uc/role/copy',
        method: 'POST',
        data,
    })
}
export const detRole = (data) => {
    return axios({
        url: '/uc/role/delete',
        method: 'POST',
        data,
    })
}
export const getAllRole = (data) => {
    return axios({
        url: '/uc/roleAuthority/getAll',
        method: 'POST',
        data,
    })
}
export const getEditRoleData = (data) => {
    return axios({
        url: '/uc/roleAuthority/getByRole',
        method: 'POST',
        data,
    })
}
export const addRole = (data) => {
    return axios({
        url: '/uc/role/add',
        method: 'POST',
        data,
    })
}
export const updateRole = (data) => {
    return axios({
        url: '/uc/role/update',
        method: 'POST',
        data,
    })
}


//临时库
export const lsklist = (data) => {
    return axios({
        url: '/uc/tempReaderManage/selectTempReader',
        method: 'POST',
        data,
    })
}

export const lsDelete = (data) => {
    return axios({
        url: '/uc/tempReaderManage/deleteTempReader',
        method: 'POST',
        data,
    })
}

export const lsZC = (data) => {
    return axios({
        url: '/uc/tempReaderManage/registerRederFromTemp',
        method: 'POST',
        data,
    })
}

//院系
export const yxlist = (data) => {
    return axios({
        url: '/uc/college/list',
        method: 'POST',
        data,
    })
}

export const yxUpdata = (data) => {
    return axios({
        url: '/uc/college/update',
        method: 'POST',
        data,
    })
}

export const xyAdd = (data) => {
    return axios({
        url: '/uc/college/add',
        method: 'POST',
        data,
    })
}

export const xyDelete = (data) => {
    return axios({
        url: '/uc/college/delete',
        method: 'GET',
        data,
    })
}

/* 专业 */
export const zylist = (data) => {
    return axios({
        url: '/uc/major/list',
        method: 'POST',
        data,
    })
}

export const zyUpdata = (data) => {
    return axios({
        url: '/uc/major/save',
        method: 'POST',
        data,
    })
}

export const zyAdd = (data) => {
    return axios({
        url: '/uc/major/save',
        method: 'POST',
        data,
    })
}

export const zyDelete = (data) => {
    return axios({
        url: '/uc/major/delete',
        method: 'GET',
        data,
    })
}

//班级
export const bjlist = (data) => {
    return axios({
        url: '/uc/userAttr/list',
        method: 'POST',
        data,
    })
}

export const bjUpdate = (data) => {
    return axios({
        url: '/uc/userAttr/update',
        method: 'POST',
        data,
    })
}

export const bjAdd = (data) => {
    return axios({
        url: '/uc/userAttr/add',
        method: 'POST',
        data,
    })
}

export const bjDelete = (data) => {
    return axios({
        url: '/uc/userAttr/delete',
        method: 'GET',
        data,
    })
}

//怎么硕呢  就挺突然的   下面的内容非常giao

//获取下拉框值1
export const xlgiao1 = (data) => {
    return axios({
        url: '/uc/getUserAttrList',
        method: 'POST',
        data,
    })
}

//获取下拉框值2
export const xlgiao2 = (data) => {
    return axios({
        url: '/uc/userGroup/get',
        method: 'POST',
        data,
    })
}

 //批量导入
export const beforeImportComposeUser = (data) => {
    return axios({
        url: '/uc/userCenter/beforeImportComposeUser',
        method: 'POST',
        data,
    })
}

export const isTaskImportNameExists = (data) => {
    return axios({
        url: '/uc/userCenter/isTaskImportNameExists',
        method: 'POST',
        data,
    })
}

export const importComposeUser = (data) => {
    return axios({
        url: '/uc/userCenter/importComposeUser',
        method: 'POST',
        data,
    })
}

export const showImportUser = (data) => {
    return axios({
        url: '/uc/userCenter/showImportUser',
        method: 'POST',
        data,
    })
}

export const deleteUser = (data) => {
    return axios({
        url: '/uc/userCenter/deleteUser',
        method: 'POST',
        data,
    })
}

export const verifyImport = (data) => {
    return axios({
        url: '/uc/userCenter/verifyImport',
        method: 'POST',
        data,
    })
}

export const getImportUserTaskStatus = (data) => {
    return axios({
        url: '/uc/userCenter/getImportUserTaskStatus',
        method: 'POST',
        data,
    })
}

// 默认全部导出
export default {
    //登录
    login,
    // 用户管理
    getList,
    getNotNormUserAttrList,
    getUserAttrList,
    updateNormUserAttr,
    getPersonInfoByChaoXing,
    activateDeactivate,
    userExport,
    getUserExport,
    register,
    removeUnit,
    getRemoveList,
    resume,
    reAdd,
    // 新增读者
    getUserType,
    addUser,
    editUser,
    getUserList,
    deleteUserList,
    getModalUserList,
    addModalUserList,
    getCxRoles,
    updateCxRole,
    getCxUserGroup,
    getCxByUserId,
    // 角色管理接口
    getRoleList,
    copyRole,
    detRole,
    getAllRole,
    getEditRoleData,
    updateRole,
    addRole,
    //临时库
    lsklist,
    lsDelete,
    lsZC,

    //院系
    yxlist,
    yxUpdata,
    xyAdd,
    xyDelete,

    //专业
    zylist,
    zyUpdata,
    zyAdd,
    zyDelete,

    //班级
    bjlist,
    bjUpdate,
    bjAdd,
    bjDelete,

    //giao
    xlgiao1,
    xlgiao2,

    //批量导入
    beforeImportComposeUser,
    isTaskImportNameExists,
    importComposeUser,
    showImportUser,
    deleteUser,
    verifyImport,
    getImportUserTaskStatus,
}