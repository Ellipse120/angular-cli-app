import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router'
import {IndexComponent} from "./index/index.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {DatalistComponent} from "./datalist/datalist.component";

const appRouters:Routes=[
  {path:'index',component:IndexComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'datalist',component:DatalistComponent},
  //重定向路由
  {path:'',redirectTo:'/index',pathMatch:'full'},
  {path:'**',component:IndexComponent}
]

@NgModule ({
  imports:[
    RouterModule.forRoot(appRouters)
  ],
  exports:[
    RouterModule
  ]
})

export class AppRoutingModule{}
