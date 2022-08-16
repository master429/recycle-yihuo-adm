import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import Page from './components/Page';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Index from './Index';

import Admins from './components/admin/Admins';
import AdminEdit from './components/admin/AdminEdit';
import Roles from './components/admin/Roles';
import RoleEdit from './components/admin/RoleEdit';

import Users from './components/user/Users';
import UserEdit from './components/user/UserEdit';

import Merchants from './components/merchant/Merchants';
import MerchantEdit from './components/merchant/MerchantEdit';

import Finances from './components/merchant/Finances';

import Categories from './components/product/Categories';
import CategoryEdit from './components/product/CategoryEdit';

import Uis from './components/setting/Uis';
import UiEdit from './components/setting/UiEdit';

import Articles from './components/content/Articles';
import ArticleEdit from './components/content/ArticleEdit';


const routes = (
    <HashRouter>
        <Switch>
            <Route path='/' children={() => (
                <Page>
                    <Switch>

                        <Redirect exact from='/' to='/app/dashboard/index' />

                        <Route path='/' exact component={Index} />

                        <Route path='/login' exact component={Login} />

                        <Route path='/app' children={() => (
                            <Index>
                                <Route path='/app/dashboard/index' component={Dashboard} />
                                <Route path={'/app/admin/admins'} component={Admins} />
                                <Route path={'/app/admin/admin-edit/:id'} component={AdminEdit} />
                                <Route path={'/app/admin/roles'} component={Roles} />
                                <Route path={'/app/admin/role-edit/:id'} component={RoleEdit} />

                                <Route path={'/app/user/users'} component={Users} />
                                <Route path={'/app/user/user-edit/:id'} component={UserEdit} />

                                <Route path={'/app/merchant/merchants'} component={Merchants} />
                                <Route path={'/app/merchant/merchant-edit/:id'} component={MerchantEdit} />
                                <Route path={'/app/finance/finances'} component={Finances} />

                                <Route path={'/app/product/categories'} component={Categories} />
                                <Route path={'/app/product/category-edit/:id'} component={CategoryEdit} />

                                <Route path={'/app/setting/uis/:type'} component={Uis} />
                                <Route path={'/app/setting/ui-edit/:type/:id'} component={UiEdit} />

                                <Route path={'/app/content/articles'} component={Articles} />
                                <Route path={'/app/content/article-edit/:id'} component={ArticleEdit} />

                            </Index>
                        )} />
                    </Switch>
                </Page>
            )}>
            </Route>
        </Switch>
    </HashRouter>
);


export default routes;
