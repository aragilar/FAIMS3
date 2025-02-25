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
 * Filename: project-create.tsx
 * Description:
 *   TODO
 */

import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import Breadcrumbs from '../components/ui/breadcrumbs';
import CreateProjectCard from '../components/project/CreateProjectCard';
import * as ROUTES from '../../constants/routes';

import {Typography, Container, Paper, Box} from '@mui/material';

import {ProjectID} from '../../datamodel/core';
import {getProjectInfo} from '../../databaseAccess';
import {getUiSpecForProject} from '../../uiSpecification';
import {ProjectUIModel, ProjectInformation} from '../../datamodel/ui';

export default function ProjectCreate() {
  const {project_id} = useParams<{project_id: ProjectID}>();
  console.log(project_id);
  if (project_id === undefined) {
    console.log(project_id);
    const breadcrumbs = [
      {link: ROUTES.NOTEBOOK_LIST, title: 'Notebooks'},
      {title: 'New Notebook'},
    ];
    return (
      <React.Fragment>
        <Breadcrumbs data={breadcrumbs} />
        <Box mb={2}>
          <Typography variant={'h2'} component={'h1'}>
            Create Notebook
          </Typography>
          <Typography variant={'subtitle1'} gutterBottom>
            Design and preview your new notebook before inviting team members
            and publishing. You can follow the GO TO NEXT button in each tab or
            select tabs to design your notebook.
          </Typography>
        </Box>
        <Paper square sx={{p: 0}}>
          <CreateProjectCard
            project_id={null}
            uiSpec={null}
            project_info={null}
          />
        </Paper>
      </React.Fragment>
    );
  } else {
    const [uiSpec, setUISpec] = useState(null as null | ProjectUIModel);
    const [project_info, set_project_info] = useState(
      null as null | ProjectInformation
    );

    useEffect(() => {
      set_project_info(null);
      if (project_id !== undefined) {
        //only get UISpec when project is defined
        getProjectInfo(project_id).then(set_project_info).catch(console.error);
      }
      setUISpec(null);
      if (project_id !== undefined) {
        //only get UISpec when project is defined
        getUiSpecForProject(project_id).then(setUISpec).catch(console.error);
      }
      console.debug(uiSpec);
      console.log('project_id changed' + project_id);
    }, [project_id]);

    if (project_info === null || uiSpec === null) {
      return (
        <Container maxWidth="lg">
          <Typography>{'Preparing project for editing...'}</Typography>
        </Container>
      );
    }

    const breadcrumbs = [
      {link: ROUTES.NOTEBOOK_LIST, title: 'Notebooks'},
      {title: project_info.name},
    ];

    return project_info !== null ? (
      <Container maxWidth="lg">
        <Breadcrumbs data={breadcrumbs} />
        <Box mb={2}>
          <Typography variant={'h2'} component={'h1'}>
            {'Edit Notebook ' + project_info.name + ' (' + project_id + ')'}
          </Typography>
          <Typography variant={'subtitle1'} gutterBottom>
            Redesign and preview your notebook
          </Typography>
        </Box>
        <Paper square>
          <CreateProjectCard
            project_id={project_id}
            uiSpec={uiSpec}
            project_info={project_info}
          />
        </Paper>
      </Container>
    ) : (
      <></>
    );
  }
}
