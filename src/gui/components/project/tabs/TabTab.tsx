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
 * Filename: TabTab.tsx
 * Description:
 *   TODO
 */

import React from 'react';
import {Tab, Tabs, Grid} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {useState, useEffect} from 'react';
import {AddSectionButton, EditButton} from './ProjectButton';
import {FormForm} from '../FormElement';
import {gettabform} from '../data/ComponentSetting';
/* eslint-disable @typescript-eslint/no-unused-vars */

function a11yProps(tabname: any, index: any) {
  return {
    id: `${tabname}-${index}`,
    'aria-controls': `${tabname}panel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  fieldtab: {
    textAlign: 'left',
    minWidth: 55,
    // backgroundColor:'#e1e4e8',
  },
  subtab: {
    // borderTop:'1px solid',
    // borderTopColor:theme.palette.primary.main
  },
  root: {
    minWidth: 55,
    color: '#c2c2c2',
  },
}));

type TabProps = {
  tabs: Array<string>;
  tab_id: string;
  value: number;
  handleChange: any;
  handelonChangeLabel?: any;
  not_xs?: boolean;
  tabmaxindex?: string;
};

export function TabTab(props: TabProps) {
  const classes = useStyles();
  const {tabs, tab_id, value, handleChange, ...other} = props;
  const not_xs = props.not_xs ?? true;
  return not_xs ? (
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label={tab_id}
      id={tab_id}
      orientation={tab_id === 'fieldtab' ? 'vertical' : 'horizontal'}
      scrollButtons
      variant="scrollable"
      allowScrollButtonsMobile
      indicatorColor={tab_id === 'primarytab' ? 'secondary' : 'primary'}
      textColor={tab_id === 'primarytab' ? 'secondary' : 'primary'}
    >
      {tabs.map((tab: any, index: number) => (
        <Tab
          className={tab_id === 'primarytab' ? classes.root : classes.fieldtab}
          key={`${tab_id}-${index}`}
          label={tab}
          {...a11yProps(tab_id, index)}
        />
      ))}
    </Tabs>
  ) : (
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label={tab_id}
      id={tab_id}
      orientation={'vertical'}
    >
      {tabs.map((tab: any, index: number) => (
        <Tab
          className={tab_id === 'primarytab' ? classes.root : classes.fieldtab}
          key={`${tab_id}-${index}`}
          label={tab}
          {...a11yProps(tab_id, index)}
        />
      ))}
    </Tabs>
  );
}

export function TabEditable(props: TabProps) {
  const classes = useStyles();
  const {tabs, tab_id, value, handleChange, ...other} = props;
  const [tablists, setTablist] = useState<Array<any>>(tabs);
  const [isedited, setisedited] = useState(false);
  const [isset, setIsset] = useState(false);
  useEffect(() => {
    let isactive = true;
    if (isactive) {
      setTablist(tabs);
    }
    return () => {
      isactive = false;
    };
  }, [tabs]);

  const handleEdit = (event: any) => {
    setisedited(true);
  };
  const handleAdd = (event: any) => {
    const newtabs = tablists;
    const length = tablists.length + 1;
    let name = 'SECTION';
    if (tab_id === 'formtab') name = 'FORM';
    let maxtab = length;
    if (props.tabmaxindex !== undefined)
      maxtab = parseInt(props.tabmaxindex) + 1;
    newtabs[tablists.length] = name + maxtab;
    setTablist(newtabs);
    props.handelonChangeLabel(newtabs, 'add');
    setIsset(!isset);
  };

  const handleSubmitForm = (values: any) => {
    const newtabs = tablists;
    const pretabs = tablists;
    Object.entries(values).map((value, index) => (newtabs[index] = value[1]));
    props.handelonChangeLabel(newtabs, 'update');
    setTablist(newtabs);
    setisedited(false);
  };

  const handleChangeForm = (event: any) => {
    // console.log(event.target.name+event.target.value)
  };

  return (
    <Grid container className={classes.subtab}>
      <Grid item sm={2} xs={12}>
        {isedited === false ? (
          <>
            <AddSectionButton
              onButtonClick={handleAdd}
              value={1}
              id="add"
              text="X"
            />
            <EditButton
              onButtonClick={handleEdit}
              value={1}
              id="edit"
              text="X"
            />
          </>
        ) : (
          ''
        )}
      </Grid>
      <Grid item sm={10} xs={12}>
        {isedited === false ? (
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label={tab_id}
            id={tab_id}
            orientation={tab_id === 'fieldtab' ? 'vertical' : 'horizontal'}
            scrollButtons
            variant="scrollable"
            allowScrollButtonsMobile
          >
            {tablists.map((tab, index) => (
              <Tab
                className={
                  tab_id === 'fieldtab' ? classes.fieldtab : classes.subtab
                }
                key={`${tab_id}-${index}`}
                label={tab}
                {...a11yProps({tab_id}, {index})}
              />
            ))}
          </Tabs>
        ) : (
          <FormForm
            uiSpec={gettabform(tabs)}
            currentView="start-view"
            handleChangeForm={handleChangeForm}
            handleSubmit={handleSubmitForm}
          />
        )}
      </Grid>
    </Grid>
  );
}
