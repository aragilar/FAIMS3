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
 * Filename: select.tsx
 * Description:
 *   File is the field about Tree view for prototype for hierarchical-vocabularies, not finalized yet
 */
import React, {useEffect} from 'react';
import {TextFieldProps} from 'formik-mui';

import {
  Defaultcomponentsetting,
  getDefaultuiSetting,
} from './BasicFieldSettings';

import {
  ProjectUIModel,
  componenentSettingprops,
  FAIMSEVENTTYPE,
} from '../../datamodel/ui';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem, {TreeItemProps, useTreeItem} from '@mui/lab/TreeItem';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import {styled} from '@mui/material/styles';
import {getProjectMetadata} from '../../projectMetadata';
interface RenderTree {
  // id: string;
  name: string;
  children?: Array<RenderTree>;
  type?: string;
  label?: string;
}

interface ElementProps {
  optiontree: Array<RenderTree>;
}

interface Props {
  ElementProps: ElementProps;
  label?: string;
  helperText?: string;
  valuetype?: string;
}

type SelectProps = {
  onselectvalue: any;
};

type CustomContent = any;

const CustomContent = React.forwardRef((props: CustomContent, ref) => {
  const {
    className,
    classes,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
    onselectvalue,
    type,
    attachments,
    name,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    preventSelection(event);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleExpansion(event);
    handleSelection(event);
    onselectvalue(nodeId, type, name, label);
  };

  return (
    <div
      className={clsx(className, classes.root, {
        'Mui-expanded': expanded,
        'Mui-selected': selected,
        'Mui-focused': focused,
        'Mui-disabled': disabled,
      })}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div className="MuiTreeItem-contentBar" />
      <div className={classes.iconContainer}>{icon}</div>
      <div className={classes.name}>
        {type === 'image' &&
        attachments !== undefined &&
        attachments !== null &&
        attachments[name] !== undefined &&
        attachments[name].type.includes('image') ? (
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Typography style={{minWidth: 100}}>{label}</Typography>
            <img
              style={{maxHeight: 500, maxWidth: 200}}
              src={URL.createObjectURL(attachments[name])}
            />
          </div>
        ) : (
          <Typography>{label ?? name}</Typography>
        )}
      </div>
    </div>
  );
});

type CustomerProps = {
  type: string | undefined;
  attachments: {[key: string]: File} | null;
  name: string;
};

const CustomTreeItem = (props: TreeItemProps & SelectProps & CustomerProps) => (
  <TreeItem
    key={props.nodeId}
    {...props}
    ContentComponent={CustomContent}
    ContentProps={
      {
        onselectvalue: (nodeId: string) =>
          props.onselectvalue(nodeId, props.type, props.name, props.label),
        type: props.type,
        attachments: props.attachments,
        name: props.name,
      } as any
    }
  />
);
const data: RenderTree = {
  // id: '0',
  name: 'Default',
  children: [],
};

interface ValueChipsArrayProps {
  data: any;
  attachments: {[key: string]: File} | null;
  isactive: boolean;
}

const ListItem = styled('li')(({theme}) => ({
  margin: theme.spacing(0.5),
}));

interface ChildChipProps {
  value: any;
  attachments: {[key: string]: File} | null;
  isactive: boolean;
}

function ChildChip(props: ChildChipProps) {
  let leaf_child = props.value !== undefined ? props.value.split('>') : '';
  if (leaf_child.length > 1)
    leaf_child = leaf_child[leaf_child.length - 1].replace(' ', '');
  const leaf_child_image = (leaf_child =
    props.value !== undefined ? props.value.split('(') : ''); // to get the attachment image name if there is label for the image
  if (leaf_child_image.length > 1)
    leaf_child = leaf_child_image[1].replace(')', ''); // to get the attachment image name if there is label for the image
  return (
    <ListItem key={props.value}>
      <Chip label={props.value} />
      <br />
      <br />
      {props.isactive &&
        props.attachments !== undefined &&
        props.attachments !== null &&
        props.attachments[leaf_child] !== undefined &&
        props.attachments[leaf_child].type.includes('image') && (
          <img
            style={{maxHeight: 500, maxWidth: 200}}
            src={URL.createObjectURL(props.attachments[leaf_child])}
            onClick={() => {
              console.log('on click');
            }}
          />
        )}
    </ListItem>
  );
}

function ValueChipsArray(props: ValueChipsArrayProps) {
  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {props.data.map((value: string) =>
        value !== '' ? (
          <ChildChip
            attachments={props.attachments}
            value={value}
            isactive={props.isactive}
          />
        ) : (
          value
        )
      )}
    </Paper>
  );
}

export function AdvancedSelect(props: TextFieldProps & Props) {
  const {ElementProps} = props;
  const [value, setValue] = React.useState([
    props.form.values[props.field.name],
  ]);
  const [isactive, setIsactive] = React.useState(false);
  const project_id = props.form.values['_project_id'];
  const [attachments, SetAttachments] = React.useState<{
    [key: string]: File;
  } | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (project_id !== undefined && mounted) {
        try {
          const attachfilenames = await getProjectMetadata(
            project_id,
            'attachfilenames'
          );
          const attachments: {[key: string]: File} = {};
          for (const index in attachfilenames) {
            const key = attachfilenames[index];
            const file = await getProjectMetadata(project_id, key);
            attachments[key] = file[0];
          }
          setIsactive(true);
          SetAttachments(attachments);
        } catch (error) {
          console.error('error to get Meta data', error);
          setIsactive(true);
        }
      } else {
        setIsactive(true);
      }
    })();

    return () => {
      // executed when unmount
      mounted = false;
    };
  }, []);
  /***make select not multiple to avoid error */
  const onselectvalue = (
    newvalue: string,
    type: string,
    name: string,
    label: string
  ) => {
    //get value for only child selection
    if (props.valuetype === 'child') {
      let newvalue = label;
      if (type === 'image') newvalue = label + '(' + name + ')';
      props.form.setFieldValue(props.field.name, newvalue);
      setValue([name]);
      return;
    }
    props.form.setFieldValue(props.field.name, newvalue);
    setValue([newvalue]);
    return;
  };

  const renderTree = (
    nodes: RenderTree,
    key: number,
    parentkey: string,
    parentnode: string
  ) => {
    const singlekey = parentkey !== '' ? parentkey + '.' + key : key + '';
    let name = '';
    if (nodes.type === 'image' && nodes.label !== undefined)
      name =
        parentnode !== ''
          ? parentnode + ' > ' + nodes.label + '(' + nodes.name + ')'
          : nodes.label + '(' + nodes.name + ')';
    else
      name = parentnode !== '' ? parentnode + ' > ' + nodes.name : nodes.name;
    return (
      <CustomTreeItem
        key={singlekey}
        nodeId={name}
        name={nodes.name}
        type={nodes.type}
        onselectvalue={onselectvalue}
        attachments={attachments}
        label={nodes.label} //add label for image
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node, childkey) =>
              renderTree(node, childkey, singlekey, name)
            )
          : null}
      </CustomTreeItem>
    );
  };
  return (
    <Box>
      <Typography>{props.label}</Typography>
      <ValueChipsArray
        data={value}
        attachments={attachments}
        isactive={isactive}
      />

      <Typography variant="caption">{props.helperText}</Typography>
      {props.disabled !== true && (
        <Box sx={{overflowY: 'auto'}}>
          <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{flexGrow: 1, minWidth: 500, maxHeight: 300, overflowY: 'auto'}}
            // multiSelect
          >
            {Array.isArray(ElementProps.optiontree) &&
              ElementProps.optiontree.map((node, key) =>
                renderTree(node, key, '', '')
              )}
          </TreeView>
        </Box>
      )}
    </Box>
  );
}

export function AdvancedSelectcomponentsetting(props: componenentSettingprops) {
  const {handlerchangewithview, ...others} = props;

  const handlerchanges = (event: FAIMSEVENTTYPE) => {
    console.debug(event);
  };

  const handlerchangewithviewSpec = (event: FAIMSEVENTTYPE, view: string) => {
    //any actions that could in this form
    handlerchangewithview(event, view);

    if (
      view === 'ElementProps' &&
      event.target.name.replace(props.fieldName, '') === 'optiontree'
    ) {
      try {
        const newvalues = props.uiSpec;
        newvalues['fields'][props.fieldName]['component-parameters'][
          'ElementProps'
        ]['optiontree'] = JSON.parse(event.target.value);
        //event.target.value;
        props.setuiSpec({...newvalues});
      } catch (e) {
        console.error('Not valid');
      }
    }
  };

  return (
    <Defaultcomponentsetting
      handlerchangewithview={handlerchangewithviewSpec}
      handlerchanges={handlerchanges}
      {...others}
      fieldui={props.fieldui}
    />
  );
}

const uiSpec = {
  'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
  'component-name': 'AdvancedSelect',
  'type-returned': 'faims-core::String', // matches a type in the Project Model
  'component-parameters': {
    fullWidth: true,
    helperText: 'Select from list',
    variant: 'outlined',
    required: false,
    select: true,
    InputProps: {},
    SelectProps: {},
    ElementProps: {
      optiontree: [data],
    },
    // select_others:'otherswith',
    label: 'Select Field',
    valuetype: 'full',
  },
  validationSchema: [['yup.string']],
  initialValue: '',
};

const uiSetting = () => {
  const newuiSetting: ProjectUIModel = getDefaultuiSetting();
  newuiSetting['fields']['optiontree'] = {
    'component-namespace': 'formik-material-ui',
    'component-name': 'TextField',
    'type-returned': 'faims-core::Json',
    'component-parameters': {
      name: 'optiontree',
      id: 'optiontree',
      variant: 'outlined',
      required: false,
      multiline: true,
      InputProps: {
        type: 'text',
        rows: 4,
      },
      fullWidth: true,
      helperText: 'Add options in json format',
      InputLabelProps: {
        label: 'Options',
      },
      type: 'text',
    },
    alert: false,
    validationSchema: [['yup.string']],
    initialValue: JSON.stringify([data]),
  };

  newuiSetting['fields']['valuetype'] = {
    'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
    'component-name': 'Select',
    'type-returned': 'faims-core::String', // matches a type in the Project Model
    'component-parameters': {
      fullWidth: true,
      helperText: '',
      variant: 'outlined',
      required: false,
      select: true,
      InputProps: {},
      SelectProps: {},
      ElementProps: {
        options: [
          {
            value: 'full',
            label: 'Full path',
          },
          {
            value: 'child',
            label: 'Only Child',
          },
        ],
      },
      InputLabelProps: {
        label: 'Select Type of Value',
      },
    },
    validationSchema: [['yup.string']],
    initialValue: 'full',
  };

  newuiSetting['views']['FormParamater']['fields'] = [
    'label',
    'helperText',
    'valuetype',
  ];

  newuiSetting['views']['ElementProps']['fields'] = ['optiontree'];

  newuiSetting['viewsets'] = {
    settings: {
      views: ['InputLabelProps', 'FormParamater', 'ElementProps'],
      label: 'settings',
    },
  };

  return newuiSetting;
};

export const AdvancedSelectSetting = [uiSetting(), uiSpec];
