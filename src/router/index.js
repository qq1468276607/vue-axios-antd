import Vue from 'vue'
import Router from 'vue-router'
import Attribute from '@/components/Attribute'
import TempDB from '@/components/Tempdb'
import UserManagement from '@/components/UserManagement'
import FieldManagement from '@/components/FieldManagement'
import AddReader from '@/components/addReader'
import ImportAll from '@/components/importAll'
import EditUser from '@/components/EditUser'
import RolManagement from '@/components/rolManagement'
import RemoveList from '@/components/removeList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/attribute',
      component: Attribute
    },
    {
      path: '/tempdb',
      component: TempDB
    },
    {
      path: '/userManagement',
      component: UserManagement
    },
    {
      path: '/fieldManagement',
      component: FieldManagement
    },
    {
      path: '/addReader',
      component: AddReader
    },
    {
      path: '/importAll',
      component: ImportAll
    },  
    {
      path: '/editUser',
      component: EditUser
    },  
    {
      path: '/rolManagement',
      component: RolManagement
    },
    {
      path: '/removeList',
      component: RemoveList
    },
     
  ]
})
