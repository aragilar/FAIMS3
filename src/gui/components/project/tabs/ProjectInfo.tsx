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
 * Filename: ProjectInfo.tsx
 * Description:This is the file about Project Info
 *
 */
import React from 'react';
import {useState, useEffect} from 'react';
import makeStyles from '@mui/styles/makeStyles';

import {
  Grid,
  Box,
  Paper,
  Button,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import {getComponentFromField} from '../FormElement';
import {TabTab} from './TabTab';
import TabPanel from './TabPanel';
import {getprojectform} from '../data/ComponentSetting';
import {ProjectValueList, FAIMShandlerType} from '../../../../datamodel/ui';
import {AddUserButton, ProjectSubmit} from './ProjectButton';
import {ProjectUIModel} from '../../../../datamodel/ui';
import {UserRoleList} from './PSettingCard';
import Alert from '@mui/material/Alert';
/* eslint-disable @typescript-eslint/no-unused-vars */
const useStyles = makeStyles(theme => ({}));

type ProjectInfoProps = {
  project_id: string | null;
  projectvalue: ProjectValueList;
  setProjectValue: FAIMShandlerType;
  handleChangeFormProject: FAIMShandlerType;
  setProjecttabvalue: FAIMShandlerType;
  formProps: any;
  handleChangeFormProjectAttachment: FAIMShandlerType;
  handleattachment: FAIMShandlerType;
};

export default function ProjectInfoTab(props: ProjectInfoProps) {
  const {projectvalue, setProjectValue, project_id, formProps, ...others} =
    props;
  const [infotabvalue, setinfotabvalue] = useState(0);
  const [uiSpec_general, setUISpecG] = useState<ProjectUIModel>({
    fields: {},
    views: {},
    viewsets: {},
    visible_types: [],
  });

  const [accessgroup, setaccessgroup] = useState([]);
  const [uiSpec_access, setUISpecA] = useState<ProjectUIModel>({
    fields: {},
    views: {},
    viewsets: {},
    visible_types: [],
  });
  const [accessAdded, setAccessAdded] = useState('');
  const [metaAdded, setMetaAdded] = useState('');
  const [uiSpec_meta, setUISpecM] = useState<ProjectUIModel>({
    fields: {},
    views: {},
    viewsets: {},
    visible_types: [],
  });

  useEffect(() => {
    let isactive = true;
    if (isactive) {
      setinit();
    }
    return () => {
      isactive = false;
    };
  }, []);

  useEffect(() => {
    let isactive = true;
    if (isactive) {
      setUISpecA(getprojectform(projectvalue, 'info_group'));
    }
    return () => {
      isactive = false;
    };
  }, [accessgroup]);

  useEffect(() => {
    let isactive = true;
    if (isactive) {
      if (projectvalue['name'] !== undefined && projectvalue['name'] !== '') {
        setUISpecG(getprojectform(projectvalue, 'info_general'));
        console.debug('update');
      }
    }
    return () => {
      isactive = false;
    };
  }, [projectvalue['name']]);

  const setinit = () => {
    setUISpecA(getprojectform(projectvalue, 'info_group'));
    setUISpecG({...getprojectform(projectvalue, 'info_general')});
    setUISpecM({...getprojectform(projectvalue, 'project_meta')});
    setinfotabvalue(0);
  };

  const handleChangeFormProject = (event: any) => {
    const newproject = projectvalue;
    newproject[event.target.name] = event.target.value;
    setProjectValue({...newproject});
  };
  const handleChangetab = (event: any, index: number) => {
    setinfotabvalue(index);
  };

  const handleAddAccess = (accessadded: string) => {
    if (accessadded === '') return false;
    const newproject = projectvalue;
    newproject['accesses'] = [...newproject['accesses'], accessadded]; //need to reset the add user role value
    setProjectValue(newproject);
    setaccessgroup(newproject['accesses']);
    return true;
  };

  const handleaddmeta = (metaAdded: string) => {
    console.log(metaAdded);
    if (metaAdded === '') return false;
    const newproject = projectvalue;
    newproject['meta'][metaAdded] = ''; //need to reset the add user role value
    setProjectValue(newproject);
    setUISpecM({...getprojectform(newproject, 'project_meta')});
    return true;
  };

  const handleformchangeAccess = (event: any) => {
    setAccessAdded(event.target.value);
  };

  const deleteuserrole = (userrole: string) => {
    console.log(userrole);
    const newproject = projectvalue;
    newproject['accesses'] = newproject['accesses'].filter(
      (access: string) => access !== userrole
    );
    setProjectValue(newproject);
    setaccessgroup(newproject['accesses']);
  };

  const handleChangeFormProjectMeta = (event: any) => {
    const newproject = projectvalue;
    newproject['meta'][event.target.name] = event.target.value;
    setProjectValue({...newproject});
  };

  const getfields = (uiSp: any) => {
    return uiSp['views']['start-view']['fields'];
  };

  const isready = (uiSp: any) => {
    if (uiSp['views']['start-view'] !== undefined) return true;
    return false;
  };

  const metaTab = () => {
    return (
      <Grid container>
        <Grid item sm={12} xs={12}>
          Add New Meta Component
        </Grid>
        <Grid item sm={4} xs={12}>
          {getfields(getprojectform(projectvalue, 'projectmetaadd')).map(
            (fieldName: string) =>
              getComponentFromField(
                getprojectform(projectvalue, 'projectmetaadd'),
                fieldName,
                formProps,
                (event: any) => setMetaAdded(event.target.value)
              )
          )}
        </Grid>
        <Grid item sm={2} xs={12}>
          <br />
          <AddUserButton
            id="AddMetaButton"
            type="button"
            onButtonClick={handleaddmeta}
            value={metaAdded}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <Alert severity="info">
            Add Meta component by filling Label and clicking the Add button,{' '}
            <br />
            {
              'Meta been added and filled values can be selected in Design > SECTION DEFINITION > COMPONENT tab RElated Field '
            }
            Example:
          </Alert>
        </Grid>
        <Grid item sm={12} xs={12}>
          <br />
          <hr /> Meta List:
          <br />
        </Grid>
        <Grid item sm={6} xs={12}>
          {isready(uiSpec_meta) &&
            uiSpec_meta['views']['start-view']['fields'].map(
              (fieldName: string) =>
                getComponentFromField(
                  uiSpec_meta,
                  fieldName,
                  formProps,
                  handleChangeFormProjectMeta
                )
            )}
        </Grid>
        <Grid item sm={6} xs={12}>
          <Alert severity="info">
            Fill the Meta Value After Meta been added
          </Alert>
        </Grid>
        <br />
        <br />
        <br />
        <ProjectSubmit
          id="gotonext_info"
          type="submit"
          isSubmitting={false}
          text="Go To Next"
          onButtonClick={() => setinfotabvalue(2)}
        />
      </Grid>
    );
  };

  const infoTab = () => {
    return (
      <Grid container>
        <Grid item sm={8} xs={12}>
          {isready(uiSpec_general) &&
            getfields(uiSpec_general).map((fieldName: string) =>
              getComponentFromField(
                uiSpec_general,
                fieldName,
                formProps,
                handleChangeFormProject
              )
            )}
          <br />
          <ProjectSubmit
            id="gotonext_info"
            type="submit"
            isSubmitting={false}
            text="Go To Next"
            onButtonClick={() => setinfotabvalue(1)}
          />

          <br />
        </Grid>
        <Grid item sm={4} xs={12}>
          <Alert severity="info">Give project a name and an description</Alert>
        </Grid>
      </Grid>
    );
  };

  const accessTab = () => {
    return (
      <Grid container>
        <Grid item sm={8} xs={12}>
          <Grid container>
            <Grid item sm={6} xs={12}>
              {isready(uiSpec_access) &&
                getfields(uiSpec_access).map((fieldName: string) =>
                  getComponentFromField(
                    uiSpec_access,
                    fieldName,
                    formProps,
                    handleformchangeAccess
                  )
                )}
              <Box pl={2} pr={2}>
                <AddUserButton
                  id="AddUserRoleButton"
                  type="button"
                  onButtonClick={handleAddAccess}
                  value={accessAdded}
                />
              </Box>
            </Grid>
            <Grid item sm={1} xs={12}></Grid>
            <Grid item sm={5} xs={12}>
              <UserRoleList
                users={projectvalue.accesses}
                deleteuserrole={deleteuserrole}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={4} xs={12}>
          <Alert severity="info">
            All projects have an admin, moderator, and team roles by default.
            define any new roles required here. You will be able to assign users
            to these roles later in the User tab.
          </Alert>
        </Grid>
        <br />
        <ProjectSubmit
          id="gotonext_info"
          type="submit"
          isSubmitting={false}
          text="Go To Next"
          onButtonClick={() => setinfotabvalue(3)}
        />
      </Grid>
    );
  };

  const AttachmentTab = () => {
    console.log(projectvalue);
    return (
      <Grid>
        {getfields(getprojectform(projectvalue, 'attachments')).map(
          (fieldName: string) =>
            getComponentFromField(
              getprojectform(projectvalue, 'attachments'),
              fieldName,
              formProps,
              () => console.log('pass')
            )
        )}
        <br />
      </Grid>
    );
  };

  return (
    <Grid container>
      <Grid item sm={12} xs={12}>
        <TabTab
          tabs={['general', 'Meta', 'User Role', 'Attachment']}
          value={infotabvalue}
          handleChange={handleChangetab}
          tab_id="projectinfo"
        />
        <TabPanel value={infotabvalue} index={0} tabname="projectinfo">
          {infoTab()}
        </TabPanel>
        <TabPanel value={infotabvalue} index={2} tabname="projectinfo">
          {accessTab()}
        </TabPanel>
        <TabPanel value={infotabvalue} index={1} tabname="projectinfo">
          {metaTab()}
        </TabPanel>
        <TabPanel value={infotabvalue} index={3} tabname="projectinfo">
          Add File as Attachment
          <Paper>{AttachmentTab()}</Paper>
          {/* <AddUserButton
            id="AddAttach"
            type="button"
            onButtonClick={handleattachment}
            value={metaAdded}
          /> */}
          <br />
          {String(process.env.REACT_APP_SERVER) === 'developers' && (
            <Paper>
              <Typography variant="caption">
                Tips: This block is only used for debug only, if get the
                attachment ID, please make sure all photo been attached. <br />
              </Typography>
              <Button
                type="button"
                color="primary"
                variant="contained"
                disableElevation
                onClick={() =>
                  props.handleattachment(props.formProps.values.attachments)
                }
              >
                Get New Files ID
              </Button>
              <br />
              File will be Uploaded:
              <br />
              {projectvalue.newfiles !== undefined &&
                Object.keys(projectvalue.newfiles).map((fileName: string) => (
                  <ListItem key={fileName} id={fileName + 'file'}>
                    {fileName}
                    <img
                      style={{maxHeight: 300, maxWidth: 200}}
                      src={URL.createObjectURL(projectvalue.newfiles[fileName])}
                    />
                  </ListItem>
                ))}
              <br />
              <br />
            </Paper>
          )}
          <Paper>
            <Typography variant="h2">Files Attached:</Typography>

            <br />
            <br />
            <List>
              {projectvalue.files !== undefined &&
                Object.keys(projectvalue.files).map(
                  (key: string, index: number) => (
                    <ListItem
                      key={key}
                      id={key + 'file'}
                      style={
                        index % 2 === 0
                          ? {backgroundColor: '#ededeb', height: '200px'}
                          : {height: '200px'}
                      }
                    >
                      <Typography style={{width: '200px'}}>
                        {key}
                        {'    '}
                      </Typography>
                      {projectvalue.files[key][0] !== undefined && (
                        <img
                          style={{maxHeight: 300, maxWidth: 200}}
                          src={URL.createObjectURL(projectvalue.files[key][0])}
                        />
                      )}
                    </ListItem>
                  )
                )}
            </List>
          </Paper>
          <br />
          <ProjectSubmit
            id="gotonext_info"
            type="submit"
            isSubmitting={false}
            text="Go To Next"
            onButtonClick={() => props.setProjecttabvalue(1)}
          />
        </TabPanel>
      </Grid>
    </Grid>
  );
}
