module.exports = {
  user: {
    login: '/user/login',
    logout: '/user/logout',
    info: '/user/getInfo'
  },
  dashboard: {
    statistic: '/getStatistics'
  },
  emailManage: {
    emailList: '/email/findAll',
    attachList: '/attachment/findAll',
    deleteEmailByIds: '/email/delMore',
    deleteEmailById: '/email/delOne',
    deleteAttachmentById: '/attachment/delOne',
    deleteAttachmentByIds: '/attachment/delMore',
    checkRule: '/rule/findOne'
  },
  emailTrace: {
    recordList: '/trace/findAll',
    checkRule: '/rule/findOne',
    addSourceData: '/trace/addSourceForEmail',
    uploadFile: '/trace/uploadMany'
  },
  ruleManage: {
    ruleList: '/rule/findAll',
    ruleAdd: '/rule/addOne',
    import: '/ruleManage/import',
    organise: '/ruleManage/organise',
    targetList: '/victim/findAll',
    deleteTarget: '/victim/delOne',
    deleteTargets: '/victim/delMore',
    addTarget: '/victim/addOne'
  },
  userManage: {
    userList: '/user/findAll',
    deleteUser: '/user/delOne',
    deleteUsers: '/user/delMore',
    addUser: '/user/addOne',
    editUser: '/user/editOne',
    roleList: '/role/findAll',
    addRole: '/role/addOne',
    editRole: '/role/editOne',
    deleteRole: '/role/delOne',
    deleteRoles: '/role/delMore',
    permList: '/menu/findAll',
    addPerm: '/menu/addOne',
    editPerm: '/menu/editOne',
    deletePerm: '/menu/delOne',
    deletePerms: '/menu/delMore',
  }
}
