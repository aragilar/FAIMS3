/*
 * Copyright 2021, 2022 Macquarie University
 *
 * Licensed under the Apache License Version 2.0 (the, "License");
 * you may not use, this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND either express or implied.
 * See, the License, for the specific language governing permissions and
 * limitations under the License.
 *
 * Filename: App.tsx
 * Description:
 *   TODO
 */

import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import * as ROUTES from './constants/routes';
import {PrivateRoute} from './constants/privateRouter';
import NavBar from './gui/components/navbar';
import Footer from './gui/components/footer';
import {Index} from './gui/pages';
import {SignIn} from './gui/pages/signin';
import {SignInReturnLoader} from './gui/pages/signin-return';
import AboutBuild from './gui/pages/about-build';
import Home from './gui/pages/home';
import ProjectList from './gui/pages/project-list';
import Project from './gui/pages/project';
import ProjectSettings from './gui/pages/project-settings';
import ProjectSearch from './gui/pages/project-search';
import RecordList from './gui/pages/record-list';
import Record from './gui/pages/record';
import RecordCreate from './gui/pages/record-create';
import ProjectCreate from './gui/pages/project-create';
import AutoIncrementBrowse from './gui/pages/autoincrement-browse';
import AutoIncrementEdit from './gui/pages/autoincrement-edit';
import NotFound404 from './gui/pages/404';
import {StateProvider} from './store';

import {MuiThemeProvider} from '@material-ui/core/styles';

// import {unstable_createMuiStrictModeTheme as createMuiTheme} from '@material-ui/core';
// https://stackoverflow.com/a/64135466/3562777 temporary solution to remove findDOMNode is depreciated in StrictMode warning
// will be resolved in material-ui v5

import {createdProjects} from './sync/state';
import {ProjectsList} from './datamodel/database';
import theme from './gui/theme';
import {getTokenContentsForCluster} from './users';

import {useEffect, useState} from 'react';

import {TokenContents} from './datamodel/core';

// type AppProps = {};

// type AppState = {
//   projects: ProjectsList;
//   global_error: null | {};
//   token: boolean;
// };

export default function App() {
  const projects: ProjectsList = {};

  for (const active_id in createdProjects) {
    projects[active_id] = createdProjects[active_id].project;
  }

  const [token, setToken] = useState(null as null | undefined | TokenContents);

  useEffect(() => {
    const getToken = async () => {
      setToken(await getTokenContentsForCluster('default'));
    };
    getToken();
    console.error('Initial token+++++++++++++');
    console.error(token);
  }, []);

  return token === null ? (
    <></>
  ) : (
    <StateProvider>
      <MuiThemeProvider theme={theme}>
        <Router>
          <NavBar />
          <Switch>
            <PrivateRoute
              exact
              path={ROUTES.SIGN_IN}
              component={SignIn}
              is_sign={true}
              extraProps={{setToken: setToken}}
            />
            <Route
              exact
              path={ROUTES.SIGN_IN_RETURN}
              component={SignInReturnLoader}
            />
            <PrivateRoute
              exact
              path={ROUTES.WORKSPACE}
              component={Home}
              token={token}
            />
            <PrivateRoute
              exact
              path={ROUTES.RECORD_LIST}
              component={RecordList}
              token={token}
            />
            <PrivateRoute
              exact
              path={ROUTES.PROJECT_LIST}
              component={ProjectList}
              token={token}
            />
            <PrivateRoute
              exact
              path={ROUTES.PROJECT_CREATE}
              component={ProjectCreate}
              token={token}
            />
            <PrivateRoute
              exact
              path={ROUTES.PROJECT_DESIGN + ':project_id'}
              component={ProjectCreate}
              token={token}
            />
            <PrivateRoute
              exact
              path={ROUTES.PROJECT + ':project_id'}
              component={Project}
              token={token}
            />
            <PrivateRoute
              exact
              path={ROUTES.PROJECT + ':project_id' + ROUTES.PROJECT_SEARCH}
              component={ProjectSearch}
              token={token}
            />
            <PrivateRoute
              exact
              path={ROUTES.PROJECT + ':project_id' + ROUTES.PROJECT_SETTINGS}
              component={ProjectSettings}
              token={token}
            />
            /* Draft creation happens by redirecting to a freshy minted UUID
            This is to keep it stable until the user navigates away. So the
            draft_id is optional, and when RecordCreate is instantiated without
            one, it immediately mints a UUID and redirects to it */
            <PrivateRoute
              exact
              path={
                ROUTES.PROJECT +
                ':project_id' +
                ROUTES.RECORD_CREATE +
                ':type_name' +
                ROUTES.RECORD_DRAFT + //
                ':draft_id'
              }
              component={RecordCreate}
              token={token}
            />
            <PrivateRoute
              exact
              path={
                ROUTES.PROJECT +
                ':project_id' +
                ROUTES.RECORD_CREATE +
                ':type_name'
              }
              component={RecordCreate}
              token={token}
            />
            /* Record editing and viewing is a seprate affair, separated by the
            presence/absence of draft_id prop OR draft_id being in the state of
            the Record component. So if the user clicks a draft to make
            continued changes, the draft_id is in the URL here. Otherwise, they
            can make changes to a record they view (Which should at some point,
            TODO, redirect to the same Record form but with the newly minted
            draft_id attached. BUt this TODO is in the record/form.tsx */
            <PrivateRoute
              exact
              path={
                ROUTES.PROJECT +
                ':project_id' +
                ROUTES.RECORD_EXISTING +
                ':record_id' +
                ROUTES.REVISION +
                ':revision_id'
              }
              component={Record}
              token={token}
            />
            <PrivateRoute
              exact
              path={
                ROUTES.PROJECT +
                ':project_id' +
                ROUTES.RECORD_EXISTING +
                ':record_id' +
                ROUTES.REVISION +
                ':revision_id' +
                ROUTES.RECORD_DRAFT +
                ':draft_id'
              }
              component={Record}
              token={token}
            />
            <PrivateRoute
              exact
              path={ROUTES.PROJECT + ':project_id' + ROUTES.AUTOINCREMENT_LIST}
              component={AutoIncrementBrowse}
              token={token}
            />
            <PrivateRoute
              exact
              path={
                ROUTES.PROJECT +
                ':project_id' +
                ROUTES.AUTOINCREMENT +
                ':form_id/:field_id/:label'
              }
              component={AutoIncrementEdit}
              token={token}
            />
            <Route exact path="/" component={Index} />
            <Route exact path={ROUTES.ABOUT_BUILD} component={AboutBuild} />
            <Route component={NotFound404} />
          </Switch>
          <Footer />
        </Router>
      </MuiThemeProvider>
    </StateProvider>
  );
}
