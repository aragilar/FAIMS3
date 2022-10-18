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
 * Filename: RelatedRecordSelector.tsx
 * Description:
 *   TODO
 */

import React, {useEffect} from 'react';

import {FieldProps} from 'formik';

import * as ROUTES from '../../constants/routes';
import {FAIMSTypeName, LocationState} from '../../datamodel/core';
import {RecordReference} from '../../datamodel/ui';
import {getRecordsByType} from '../../data_storage';
import {
  getDefaultuiSetting,
  Defaultcomponentsetting,
} from './BasicFieldSettings';
import LibraryBooksIcon from '@mui/icons-material/Bookmarks';
import {option} from '../../datamodel/typesystem';
import {
  ProjectUIModel,
  componenentSettingprops,
  FAIMSEVENTTYPE,
} from '../../datamodel/ui';
import {useLocation} from 'react-router-dom';
import {Typography} from '@mui/material';
import {get_RelatedFields_for_field} from '../components/record/relationships/RelatedInformation';
import DataGridFieldLinksComponent from '../components/record/relationships/field_level_links/datagrid';
import {RecordLinkProps} from '../components/record/relationships/types';

import {Grid} from '@mui/material';
import {SelectChangeEvent} from '@mui/material';
import {v4 as uuidv4} from 'uuid';
import {CreateRecordLink} from '../components/record/relationships/create_links/create_record_link';
/* eslint-disable @typescript-eslint/no-unused-vars */
interface Props {
  related_type: FAIMSTypeName;
  relation_type: FAIMSTypeName;
  multiple?: boolean;
  id: string;
  InputLabelProps: {label: string};
  required: boolean;
  helperText?: string;
  disabled?: boolean;
  relation_linked_vocabPair?: Array<Array<string>>;
}

function get_default_relation_label(
  multiple: boolean,
  value: any,
  type: string
) {
  if (type === 'Child') return ['is child of', 'is parent of'];
  if (value === null || value === undefined) return [];
  if (!multiple && value !== undefined && value['relation_type_vocabPair'])
    return value['relation_type_vocabPair'];

  const length = value.length;
  if (
    multiple &&
    length > 0 &&
    value[length - 1] !== undefined &&
    value[length - 1]['relation_type_vocabPair'] !== undefined
  )
    return value[length - 1]['relation_type_vocabPair'];

  return [];
}

function excludes_related_record(
  multiple: boolean,
  value: any,
  all_records: RecordReference[]
) {
  const relations: string[] = multiple ? [] : [value.record_id];
  const records: RecordReference[] = [];
  if (multiple)
    value.map((record: RecordReference) => relations.push(record.record_id));

  all_records.map((record: RecordReference) =>
    relations.includes(record.record_id) ? record : records.push(record)
  );
  return records;
}

export function RelatedRecordSelector(props: FieldProps & Props) {
  const project_id = props.form.values['_project_id'];
  const record_id = props.form.values['_id'];
  const field_name = props.field.name;
  const [options, setOptions] = React.useState<RecordReference[]>([]);
  const multiple = props.multiple !== undefined ? props.multiple : false;
  const location = useLocation();
  let search = location.search.includes('link=')
    ? location.search.replace('?', '')
    : '';
  const [isactive, setIsactive] = React.useState(false);
  const [recordsInformation, setRecordsInformation] = React.useState<
    RecordLinkProps[]
  >([]);
  const type = props.relation_type.replace('faims-core::', '');
  const lastvaluePair = get_default_relation_label(
    multiple,
    props.form.values[field_name],
    type
  );
  const [relationshipLabel, setRelationshipLabel] = React.useState<string>(
    lastvaluePair[0]
  );
  const [relationshipPair, setRelationshipPair] =
    React.useState<Array<string>>(lastvaluePair);
  const [selectedRecord, SetSelectedRecord] =
    React.useState<RecordReference | null>(null);
  const url_split = search.split('&');
  // const [columns, SetColumns] = React.useState<GridColDef[]>(defaultColumns);
  const [fieldValue, setFieldValue] = React.useState(
    props.form.values[field_name]
  );
  const [updated, SetUpdated] = React.useState(uuidv4());
  const [is_enabled, setIs_enabled] = React.useState(multiple ? true : false);
  if (
    url_split.length > 1 &&
    url_split[0].replace('field_id=', '') === props.id
  )
    search = search.replace(url_split[0] + '&' + url_split[1], '');
  if (search !== '') search = '&' + search;

  useEffect(() => {
    if (project_id !== undefined) {
      (async () => {
        const all_records = await getRecordsByType(
          project_id,
          props.related_type,
          props.relation_type,
          record_id,
          relationshipPair
        );
        const records = excludes_related_record(
          multiple,
          props.form.values[field_name],
          all_records
        );
        setOptions(records);
        setIsactive(true);
        if (
          !multiple &&
          props.form.values[field_name]['record_id'] === undefined
        )
          setIs_enabled(true);
      })();
    } else {
      setIsactive(true);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (project_id !== undefined && mounted) {
        const records_info = await get_RelatedFields_for_field(
          props.form.values,
          props.related_type,
          relationshipPair,
          field_name,
          props.InputLabelProps.label,
          multiple
        );
        setRecordsInformation(records_info);

        // if (records_info.length > 0 && columns.length === 0) {
        //   const newColumns = columns;
        //   // this is the code to display the values from child, TO DO: in detail about how to display it
        //   // Object.keys(records_info[0]).map((key: string) =>
        //   //   key.includes('newfield')
        //   //      ?newColumns.push({
        //   //         field: key,
        //   //         flex: 0.2,
        //   //         minWidth: 100,
        //   //       }):key
        //   // );
        //   SetColumns(newColumns);
        // }
      }
    })();

    return () => {
      // executed when unmount
      mounted = false;
    };
  }, [updated]);

  // Note the "multiple" option below, that seems to control whether multiple
  // entries can in entered.
  // TODO: Have the relation_type set the multiplicity of the system
  if (!isactive) return <></>;
  //to reset the method to pass state value between the link and record
  //to pass information in state to child/link record

  const newState: LocationState = {
    parent_record_id: props.form.values._id, //current form record id
    field_id: props.id,
    type: type, //type of this relation
    parent_link: location.pathname.replace('/notebooks/', ''), // current form link
    parent: {},
    relation_type_vocabPair: relationshipPair, //pass the value of vocalPair
  };
  const disabled = props.disabled ?? false;
  const location_state: any = location.state;
  if (location_state !== undefined && location_state !== null) {
    if (location_state.parent_record_id !== props.form.values._id)
      newState['parent'] = location.state;
    else if (location_state.parent !== undefined) {
      //when the record is the parent record, the record should be the one returned from child, so should get the parent information
      newState['parent'] = location_state.parent;
    }
  }
  const route = {
    pathname:
      ROUTES.NOTEBOOK + project_id + ROUTES.RECORD_CREATE + props.related_type,
    state: newState,
  };
  const handleChange = (event: SelectChangeEvent) => {
    const value: string = event.target.value;
    setRelationshipLabel(value);
    //get the value of relation Pair
    if (props.relation_linked_vocabPair !== undefined) {
      let valuePair: string[] = [];
      props.relation_linked_vocabPair.map((r: string[]) =>
        r[0] === value ? (valuePair = r) : r
      );
      setRelationshipPair(valuePair);
      //reset the value of the record list
      const records = options;
      records.map(record => (record['relation_type_vocabPair'] = valuePair));
      setOptions(records);
    }
  };

  const add_related_child = () => {
    let newValue = props.form.values[field_name];
    if (multiple) newValue.push(selectedRecord);
    else newValue = selectedRecord;
    setFieldValue(newValue);

    const records = excludes_related_record(
      multiple,
      props.form.values[field_name],
      options
    );
    setOptions(records);
    if (!multiple) setIs_enabled(false);
    //set the form value
    props.form.setFieldValue(props.field.name, newValue);
    if (multiple) SetSelectedRecord(null);
    SetUpdated(uuidv4());
    //call the function to trigger the child to be updated??TBD
  };

  const remove_related_child = (
    record_id: string | null | undefined,
    hrid: string | null | undefined
  ) => {
    if (record_id === null || record_id === undefined) return;
    if (hrid === null || hrid === undefined) hrid = record_id;
    const child_record = {
      project_id: project_id,
      record_id: record_id,
      record_label: hrid,
      relation_type_vocabPair: relationshipPair,
    };
    let newValue = props.form.values[field_name];
    if (multiple) {
      let child_record_index = -1;
      newValue.map((record: RecordReference, index: number) =>
        record.record_id === child_record.record_id
          ? (child_record_index = index)
          : record
      );
      if (child_record_index > -1) {
        // only splice array when item is found
        newValue.splice(child_record_index, 1); // 2nd parameter means remove one item only
      }
    } else newValue = '';
    console.error('set new value', newValue);
    setFieldValue(newValue);

    const records = options;
    records.push(child_record);
    // records=excludes_related_record(
    //   multiple,
    //   props.form.values[field_name],
    //   records
    // )
    setOptions(records);
    if (!multiple) setIs_enabled(true);
    //set the form value
    props.form.setFieldValue(props.field.name, newValue);
    SetSelectedRecord(null);
    SetUpdated(uuidv4());
    //call the function to trigger the child to be updated??TBD
  };

  return (
    <div id={field_name}>
      <Grid container spacing={1} direction="row" justifyContent="flex-start">
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <CreateRecordLink
            field_name={field_name}
            options={options}
            handleChange={handleChange}
            relationshipLabel={relationshipLabel}
            SetSelectedRecord={SetSelectedRecord}
            selectedRecord={selectedRecord}
            disabled={disabled}
            is_enabled={is_enabled}
            project_id={project_id}
            route={route}
            type={type}
            add_related_child={add_related_child}
            {...props}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          {disabled === false && ( //update for eid or view
            <Typography variant="caption">{props.helperText}</Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          {recordsInformation.length > 0 && (
            <DataGridFieldLinksComponent
              links={recordsInformation}
              record_id={record_id}
              record_hrid={record_id}
              record_type={props.form.values['type']}
              field_label={props.InputLabelProps.label}
              handleUnlink={remove_related_child}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
}

const uiSpec = {
  'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
  'component-name': 'RelatedRecordSelector',
  'type-returned': 'faims-core::Relationship', // matches a type in the Project Model
  'component-parameters': {
    fullWidth: true,
    helperText: 'Select or Add new related record',
    variant: 'outlined',
    required: true,
    related_type: '',
    relation_type: 'faims-core::Child',
    InputProps: {
      type: 'text', // must be a valid html type
    },
    multiple: false,
    SelectProps: {},
    InputLabelProps: {
      label: 'Select Related',
    },
    FormHelperTextProps: {},
  },
  validationSchema: [['yup.string'], ['yup.required']],
  initialValue: '',
};

const uiSetting = () => {
  const newuiSetting: ProjectUIModel = getDefaultuiSetting();
  newuiSetting['fields']['multiple'] = {
    'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
    'component-name': 'Checkbox',
    'type-returned': 'faims-core::Bool', // matches a type in the Project Model
    'component-parameters': {
      name: 'multiple',
      id: 'multiple',
      required: false,
      type: 'checkbox',
      FormControlLabelProps: {
        label: 'Multiple',
      },
      FormHelperTextProps: {
        children: 'Tick if user can add multiple records for this relationship',
      },
    },
    validationSchema: [['yup.bool']],
    initialValue: false,
  };
  newuiSetting['fields']['relation_type'] = {
    'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
    'component-name': 'Select',
    'type-returned': 'faims-core::String', // matches a type in the Project Model
    'component-parameters': {
      fullWidth: true,
      helperText: '',
      variant: 'outlined',
      required: true,
      select: true,
      InputProps: {},
      SelectProps: {},
      ElementProps: {
        options: [
          {
            value: 'faims-core::Child',
            label: 'Child',
          },
          {
            value: 'faims-core::Linked',
            label: 'Linked',
          },
        ],
      },
      InputLabelProps: {
        label: 'Select Relation Type',
      },
    },
    validationSchema: [['yup.string'], ['yup.required']],
    initialValue: 'faims-core::Child',
  };
  newuiSetting['fields']['relation_linked_vocabPair'] = {
    'component-namespace': 'formik-material-ui',
    'component-name': 'TextField',
    'type-returned': 'faims-core::Integer',
    'component-parameters': {
      InputLabelProps: {
        label: 'Number of Line',
      },
      fullWidth: false,
      helperText: "Add relation type Pair, use ','to separate pair",
      variant: 'outlined',
      required: false,
    },
    validationSchema: [['yup.string']],
    initialValue: 'is related to',
  };
  newuiSetting['fields']['related_type'] = {
    'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
    'component-name': 'Select',
    'type-returned': 'faims-core::String', // matches a type in the Project Model
    'component-parameters': {
      fullWidth: true,
      helperText: ' ',
      variant: 'outlined',
      required: true,
      select: true,
      InputProps: {},
      SelectProps: {},
      ElementProps: {
        options: [],
      },
      InputLabelProps: {
        label: 'Select Related Form',
      },
    },
    validationSchema: [['yup.string'], ['yup.required']],
    initialValue: '',
  };

  newuiSetting['views']['FormParamater']['fields'] = [
    'helperText',
    'multiple',
    'relation_type',
    'relation_linked_vocabPair',
    'related_type',
  ];
  newuiSetting['viewsets'] = {
    settings: {
      views: ['InputLabelProps', 'FormParamater'],
      label: 'settings',
    },
  };

  return newuiSetting;
};

export function getLinkedBuilderIcon() {
  return <LibraryBooksIcon />;
}

export const LinkedSetting = [uiSetting(), uiSpec];

export function Linkedcomponentsetting(props: componenentSettingprops) {
  const [uiSetting, setuiSetting] = React.useState(props.uiSetting);

  useEffect(() => {
    setini();
  }, [props.uiSpec['visible_types']]);

  const setini = () => {
    const options: Array<option> = [];
    const fields: Array<option> = [];
    props.uiSpec['visible_types'].map((viewset: string) =>
      fields.push({
        label: props.uiSpec['viewsets'][viewset]['label'] ?? viewset,
        value: viewset,
      })
    );
    // get the list of form
    const newvalues = uiSetting;
    if (
      fields.length > 0 &&
      newvalues['fields']['related_type' + props.fieldName] !== undefined
    )
      newvalues['fields']['related_type' + props.fieldName][
        'component-parameters'
      ]['ElementProps']['options'] = fields;
    if (
      props.uiSpec['fields'][props.fieldName]['component-parameters'][
        'relation_type'
      ] === 'faims-core::Child'
    )
      newvalues['views']['FormParamater']['fields'] = [
        'helperText' + props.fieldName,
        'multiple' + props.fieldName,
        'relation_type' + props.fieldName,
        'related_type' + props.fieldName,
      ];
    setuiSetting({...newvalues});
  };

  const handlerchanges = (event: FAIMSEVENTTYPE) => {
    const name = event.target.name.replace(props.fieldName, '');
    if (name === 'multiple') {
      const newvalues = props.uiSpec;
      newvalues['fields'][props.fieldName]['component-parameters']['multiple'] =
        event.target.checked;
      if (event.target.checked === true)
        newvalues['fields'][props.fieldName]['initialValue'] = [];
      else newvalues['fields'][props.fieldName]['initialValue'] = '';
      props.setuiSpec({...newvalues});
    } else if (name === 'relation_type') {
      const newvalues = uiSetting;
      if (event.target.value === 'faims-core::Linked')
        newvalues['views']['FormParamater']['fields'] = [
          'helperText' + props.fieldName,
          'multiple' + props.fieldName,
          'relation_type' + props.fieldName,
          'relation_linked_vocabPair' + props.fieldName,
          'related_type' + props.fieldName,
        ];
      else
        newvalues['views']['FormParamater']['fields'] = [
          'helperText' + props.fieldName,
          'multiple' + props.fieldName,
          'relation_type' + props.fieldName,
          'related_type' + props.fieldName,
        ];
      setuiSetting({...newvalues});
    } else if (name === 'relation_linked_vocabPair') {
      const newvalues = props.uiSpec;
      const pair_value = [
        ['is_above', 'is below'],
        ['is related', 'is related to'],
      ];
      //TO DO
      newvalues['fields'][props.fieldName]['component-parameters'][
        'relation_linked_vocabPair'
      ] = pair_value;
      props.setuiSpec({...newvalues});
    }
  };

  return (
    <Defaultcomponentsetting
      handlerchanges={handlerchanges}
      {...props}
      fieldui={props.fieldui}
      uiSetting={uiSetting}
    />
  );
}
