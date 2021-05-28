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
 * Filename: projectNav.tsx
 * Description: 
 *   TODO
 */
 
import React from 'react';
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import {
  Container,
  Tabs,
  Tab,
  AppBar,
  Box,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import grey from '@material-ui/core/colors/grey';
import {FAIMSForm} from './form';
import {ProjectsList} from '../datamodel';
import {initializeEvents} from '../sync';
//import {NumberSchema} from 'yup';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  index_of_active: any;
}

function TabPanel(props: TabPanelProps) {
  const {children, index_of_active: value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `project-nav-scrollable-tab-${index}`,
    'aria-controls': `project-nav-scrollable-tab-${index}`,
  };
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  });

interface ProjectNavTabsProps extends WithStyles<typeof styles> {
  classes: any;
  projectList: ProjectsList;
}

type ProjectNavTabsState = {
  activeTab: string;
  projectList: ProjectsList;
  global_error: null | {};
};

class ProjectNavTabs extends React.Component<
  ProjectNavTabsProps,
  ProjectNavTabsState
> {
  constructor(props: ProjectNavTabsProps) {
    super(props);
    this.state = {
      projectList: {},
      activeTab: '',
      global_error: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // get view components, render form
    const projectList: ProjectsList = {};
    initializeEvents.on('project_meta_paused', (listing, active, project) => {
      projectList[active._id] = project;
      this.setState({projectList: projectList});
    });
    // initialize().catch(err => this.setState({global_error: err}));
  }

  handleChange(event: any, value: any) {
    this.setState({activeTab: value.toString()});
  }

  render() {
    const {classes} = this.props;
    let activeTab = this.state.activeTab;
    const projectList = this.state.projectList;

    if (Object.keys(projectList).length === 0) {
      // Before the projects are initialized,
      // rendering this component displays a loading screen
      return (
        <div>
          <Box mb={3}>
            <AppBar position="static" color="default">
              <Box p={1} ml={2}>
                <Grid container direction="row" alignItems="center">
                  <Grid>
                    <CircularProgress size={'1.5rem'} color={'primary'} />
                  </Grid>
                  <Grid>
                    {/*<Typography*/}
                    {/*  color={'textSecondary'}*/}
                    {/*  style={{marginLeft: '20px'}}*/}
                    {/*>*/}
                    {/*  Loading...*/}
                    {/*</Typography>*/}
                  </Grid>
                </Grid>
              </Box>
            </AppBar>
          </Box>
          <Container maxWidth="md">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Skeleton animation="wave" variant="rect" height={100} />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Skeleton animation="wave" variant="rect" height={500} />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Skeleton animation="wave" variant="rect" height={500} />
              </Grid>
            </Grid>
          </Container>
        </div>
      );
    } else if (projectList[activeTab] === undefined) {
      // Immediately after loading screen is finished loading, there
      // is no selected tab, so default to the first one:
      activeTab = Object.keys(projectList)[0];
    }

    return (
      <div className={classes.root}>
        <AppBar position="relative" color="default">
          <Tabs
            value={activeTab}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {Object.keys(projectList).map(
              /* eslint-disable @typescript-eslint/no-unused-vars */
              (active_id, project_index) => {
                const project = projectList[active_id];
                return (
                  <Tab
                    label={project.name}
                    value={active_id}
                    key={'projectNavTab' + active_id}
                    {...a11yProps(project._id)}
                  />
                );
              }
              /* eslint-enable @typescript-eslint/no-unused-vars */
            )}
          </Tabs>
        </AppBar>

        <Container maxWidth="md">
          {Object.keys(projectList).map(
            /* eslint-disable @typescript-eslint/no-unused-vars */
            (active_id, project_index) => {
              const project = projectList[active_id];
              return (
                <TabPanel
                  index_of_active={activeTab}
                  index={active_id}
                  key={'projectNavTabPanel' + active_id}
                >
                  <Box bgcolor={grey[200]} p={2} mb={2}>
                    <pre style={{margin: 0}}>
                      {JSON.stringify(project, null, 2)}
                    </pre>
                  </Box>
                  <Box p={2} mb={2}>
                    <strong>VIEW STEPPER GOES HERE</strong>
                  </Box>
                  <FAIMSForm activeProjectID={active_id} />
                </TabPanel>
              );
            }
            /* eslint-enable @typescript-eslint/no-unused-vars */
          )}
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(ProjectNavTabs);
