module.exports = {
  user: {
    login: '/login',
    logout: '/logout',
    info: '/getInfo'
  },
  dashboard: {
    statistic: '/getStatistics'
  },
  emailManage: {
    emailList: '/email/findAll',
    attachList: '/attachment/findAll',
    deleteEmailByIds: '/email/delMore',
    oneEmail: '/email/findOne',
    deleteEmailById: '/email/delOne',
    deleteAttachmentById: '/attachment/delOne',
    deleteAttachmentByIds: '/attachment/delMore',
    checkRule: '/rule/findOne',
    commentList: '/comment/findAll',
    addComment: '/comment/addOne'
  },
  emailTrace: {
    recordList: '/trace/findAll',
    delRecord: '/trace/delOne',
    delRecords: '/trace/delMore',
    checkRule: '/rule/findOne',
    addSourceData: '/trace/addSourceForEmail',
    uploadFile: '/trace/uploadMany'
  },
  ruleManage: {
    ruleList: '/rule/findAll',
    addRule: '/rule/addOne',
    editRule: '/rule/editOne',
    deleteRule: '/rule/delOne',
    deleteRules: '/rule/delMore',
    import: '/ruleManage/import',
    targetList: '/victim/findAll',
    addTarget: '/victim/addOne',
    editTarget: '/victim/editOne',
    deleteTarget: '/victim/delOne',
    deleteTargets: '/victim/delMore',
    APTList: '/apts/findAll',
    addAPT: '/apts/addOne',
    editAPT: '/apts/editOne',
    deleteAPT: '/apts/delOne',
    deleteAPTs: '/apts/delMore',
    uploadImg: '/apts/uploadOne'
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
    menus: '/menu/findAllForTree'
  }
}
