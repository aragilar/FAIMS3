/*
 * Copyright 2021 Macquarie University
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
 * Filename: home.tsx
 * Description:
 *   TODO
 */

import React from 'react';
import {Container} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import * as ROUTES from '../../constants/routes';
import {
  USE_REAL_DATA,
  DIRECTORY_PROTOCOL,
  DIRECTORY_HOST,
  DIRECTORY_PORT,
  RUNNING_UNDER_TEST,
  COMMIT_VERSION,
  AUTOACTIVATE_PROJECTS,
} from '../../buildconfig';
import Breadcrumbs from '../components/ui/breadcrumbs';
import {wipe_all_pouch_databases} from '../../sync';

export default function AboutBuild() {
  const breadcrumbs = [
    {link: ROUTES.INDEX, title: 'Index'},
    {title: 'About-Build'},
  ];
  return (
    <Container maxWidth="lg">
      <Breadcrumbs data={breadcrumbs} />
      <table>
        <tr>
          <td>Directory Server</td>
          <td>
            {DIRECTORY_PROTOCOL}://{DIRECTORY_HOST}:{DIRECTORY_PORT}/
          </td>
        </tr>
        <tr>
          <td>Commit Version</td>
          <td>{COMMIT_VERSION}</td>
        </tr>
        <tr>
          <td>Using real data</td>
          <td>{USE_REAL_DATA ? 'True' : 'False'}</td>
        </tr>
        <tr>
          <td>Running under test</td>
          <td>{RUNNING_UNDER_TEST ? 'True' : 'False'}</td>
        </tr>
        <tr>
          <td>Autoactivating projects</td>
          <td>{AUTOACTIVATE_PROJECTS ? 'True' : 'False'}</td>
        </tr>
      </table>
      <Button
        variant="outlined"
        color={'secondary'}
        onClick={() => {
          wipe_all_pouch_databases().then(() => {
            console.log('User cleaned database');
            window.location.reload();
          });
        }}
        style={{marginRight: '10px'}}
      >
        Wipe and reset everything!
      </Button>
    </Container>
  );
}
