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
 * Filename: defaults.tsx
 * Description:
 *   TODO
 */

import {getComponentPropertiesByName} from '../../../component_registry';
import {useState, useEffect} from 'react';
import {
  ProjectUIModel,
  resetprops,
  FAIMSEVENTTYPE,
  componenentSettingprops,
} from '../../../../datamodel/ui';
import {ProjectUIFields} from '../../../../datamodel/typesystem';
import {Defaultcomponentsetting} from '../../../fields/BasicFieldSettings';
import {
  HRID_STRING,
  DEFAULT_REALTION_LINK_VOCAB,
} from '../../../../datamodel/core';
/* eslint-disable @typescript-eslint/no-unused-vars */
import {option} from '../../../../datamodel/typesystem';
const uiSettingOthers: ProjectUIModel = {
  fields: {
    annotation_label: {
      'component-namespace': 'formik-material-ui',
      'component-name': 'TextField',
      'type-returned': 'faims-core::String',
      meta: {
        annotation_label: 'annotation',
        uncertainty: {
          include: false,
          label: 'uncertainty',
        },
      },
      access: ['admin'],
      'component-parameters': {
        name: 'annotation_label',
        id: 'annotation_label',
        variant: 'outlined',
        required: false,
        fullWidth: true,
        helperText: '',
        InputLabelProps: {
          label: 'Annotation Label',
        },
        type: 'text',
      },
      alert: false,
      validationSchema: [['yup.string']],
      initialValue: 'Annotation_label',
    },
    annotation: {
      'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
      'component-name': 'Checkbox',
      'type-returned': 'faims-core::Bool', // matches a type in the Project Model
      'component-parameters': {
        name: 'annotation',
        id: 'annotation',
        required: false,
        type: 'checkbox',
        FormControlLabelProps: {
          label: 'Include Annotation',
        },
        FormHelperTextProps: {
          children: 'Include Annotation',
        },
      },
      validationSchema: [['yup.bool']],
      initialValue: true,
    },
    uncertainty_include: {
      'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
      'component-name': 'Checkbox',
      'type-returned': 'faims-core::Bool', // matches a type in the Project Model
      'component-parameters': {
        name: 'include',
        id: 'include',
        required: false,
        type: 'checkbox',
        FormControlLabelProps: {
          label: 'Include Uncertainty',
        },
        FormHelperTextProps: {
          children: 'Include Uncertainty',
        },
      },
      validationSchema: [['yup.bool']],
      initialValue: true,
    },
    uncertainty_label: {
      'component-namespace': 'formik-material-ui',
      'component-name': 'TextField',
      'type-returned': 'faims-core::String',
      access: ['admin'],
      'component-parameters': {
        name: 'textInput',
        id: 'textInput',
        variant: 'outlined',
        required: false,
        fullWidth: true,
        helperText: '',
        InputLabelProps: {
          label: 'Uncertainty Label',
        },
        type: 'text',
      },
      alert: false,
      validationSchema: [['yup.string']],
      initialValue: 'label',
    },
    required: {
      'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
      'component-name': 'Checkbox',
      'type-returned': 'faims-core::Bool', // matches a type in the Project Model
      'component-parameters': {
        name: 'required',
        id: 'required',
        required: true,
        type: 'checkbox',
        FormControlLabelProps: {
          label: 'Select if component completion is compulsory',
        },
        FormHelperTextProps: {
          children: '',
        },
      },
      validationSchema: [['yup.bool']],
      initialValue: false,
    },
    //this is just for testing/developing, not ready for production yet
    persistent: {
      'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
      'component-name': 'Checkbox',
      'type-returned': 'faims-core::Bool', // matches a type in the Project Model
      'component-parameters': {
        name: 'persistent',
        id: 'persistent',
        required: false,
        type: 'checkbox',
        FormControlLabelProps: {
          label: 'Select if value persistent',
        },
        FormHelperTextProps: {
          children: '',
        },
      },
      validationSchema: [['yup.bool']],
      initialValue: false,
    },
    //to display value in parent or not
    displayParent: {
      'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
      'component-name': 'Checkbox',
      'type-returned': 'faims-core::Bool', // matches a type in the Project Model
      'component-parameters': {
        name: 'displayParent',
        id: 'displayParent',
        required: false,
        type: 'checkbox',
        FormControlLabelProps: {
          label: 'Select if value display in Parent Record',
        },
        FormHelperTextProps: {
          children: '',
        },
      },
      validationSchema: [['yup.bool']],
      initialValue: false,
    },
    field_type: {
      'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
      'component-name': 'Select',
      'type-returned': 'faims-core::String', // matches a type in the Project Model
      'component-parameters': {
        fullWidth: true,
        helperText: 'Select Type of the field ',
        variant: 'outlined',
        required: false,
        select: true,
        InputProps: {},
        SelectProps: {},
        ElementProps: {
          options: [
            {
              value: 'default',
              label: 'default',
            },
            {
              value: 'string',
              label: 'string',
            },
            {
              value: 'number',
              label: 'number',
            },
            {
              value: 'email',
              label: 'email',
            },
          ],
        },
        InputLabelProps: {
          label: 'Select Field Type',
        },
      },
      validationSchema: [['yup.string']],
      initialValue: '1',
    },
    validationSchema: {
      'component-namespace': 'formik-material-ui',
      'component-name': 'TextField',
      'type-returned': 'faims-core::String',
      meta: {
        annotation_label: 'annotation',
        uncertainty: {
          include: false,
          label: 'uncertainty',
        },
      },
      access: ['admin'],
      'component-parameters': {
        name: 'validationSchema',
        id: 'validationSchema',
        variant: 'outlined',
        required: false,
        fullWidth: true,
        helperText: '',
        InputLabelProps: {
          label: 'validationSchema',
        },
        type: 'text',
        disabled: true,
      },
      alert: false,
      validationSchema: [['yup.string']],
      initialValue: '',
    },
    // add for branching logic setting, this is for testing/developing ONLY, not ready for production yet
    logic_select: {
      'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
      'component-name': 'MultiSelect',
      'type-returned': 'faims-core::Array', // matches a type in the Project Model
      'component-parameters': {
        fullWidth: true,
        helperText: 'Choose items from the dropdown',
        variant: 'outlined',
        required: false,
        select: true,
        InputProps: {},
        SelectProps: {
          multiple: true,
        },
        ElementProps: {
          options: [
            {
              value: 'field',
              label: 'field',
            },
            {
              value: 'view',
              label: 'view',
            },
          ],
        },
        InputLabelProps: {
          label: 'Select Multiple',
        },
      },
      validationSchema: [['yup.array']],
      initialValue: [],
    },
  },
  views: {
    meta: {
      fields: ['annotation', 'annotation_label', 'uncertainty_include'],
      uidesign: 'form',
      label: 'meta',
    },
    validationSchema: {
      fields: ['validationSchema'],
      uidesign: 'form',
      label: 'validationSchema',
    },
    access: {
      fields: ['access'],
      uidesign: 'form',
      label: 'access',
    },
    FormParamater: {
      fields: ['required', 'persistent', 'displayParent'],
      uidesign: 'form',
      label: 'FormParamater',
    },
    other: {
      fields: ['field_type'],
      uidesign: 'form',
      label: 'other',
    },
    // add for branching logic setting, this is for testing/developing ONLY, not ready for production yet
    logic: {
      fields: ['logic_select'],
      uidesign: 'form',
      label: 'logic',
    },
  },
  viewsets: {
    notes: {
      views: ['meta'],
      label: 'notes',
    },
    access: {
      views: ['access'],
      label: 'access',
    },
    valid: {
      views: ['FormParamater', 'validationSchema'],
      label: 'valid',
    },
    logic: {
      views: ['logic'],
      label: 'valid',
    },
  },
  visible_types: ['notes', 'valid', 'access', 'logic'],
};

export const regeneratesettinguiSpec = (
  uiSpec: ProjectUIModel,
  fieldName: string,
  designvalue: string
) => {
  const newui: ProjectUIModel = {
    fields: {},
    views: {},
    viewsets: {},
    visible_types: [],
  };
  const fields: ProjectUIFields = {};
  const fieldsnames: Array<string> = [];
  uiSpec['visible_types'].map((viewset: string) =>
    fieldsnames.push(...uiSpec['viewsets'][viewset]['views'])
  );
  fieldsnames.map((view: string) => (fields[view] = []));

  for (const [key, value] of Object.entries(uiSpec['fields'])) {
    const newname = key + fieldName;
    newui['fields'][newname] = generatenewname(value, newname);
    //
    fieldsnames.map((view: string) => {
      if (uiSpec['views'][view]['fields'].includes(key)) {
        fields[view].push(newname);
      }
    });
  }
  uiSpec['visible_types'].map((viewset: string) =>
    uiSpec['viewsets'][viewset]['views'].map(
      (view: string) =>
        (newui['views'][view] = {
          fields: fields[view],
          uidesign: 'form',
          label: view,
        })
    )
  );
  newui['visible_types'] = uiSpec['visible_types'];
  newui['viewsets'] = uiSpec['viewsets'];
  return newui;
};

export const generatenewname = (fieldui: ProjectUIFields, newname: string) => {
  const newfield = JSON.parse(JSON.stringify(fieldui));
  newfield['component-parameters']['id'] = newname;
  newfield['component-parameters']['name'] = newname;
  return newfield;
};

export const generatenewfield = (
  namespace: string,
  componentName: string,
  fieldui: ProjectUIFields | null,
  fieldName: string | null,
  props: any | null
) => {
  let uifield: ProjectUIFields =
    fieldui === null
      ? getComponentPropertiesByName(namespace, componentName).settingsProps[1]
      : fieldui;
  if (fieldName !== null) uifield = generatenewname(uifield, fieldName);
  if (uifield['component-name'] === 'BasicAutoIncrementer') {
    uifield['component-parameters']['form_id'] = props.currentform;
    return uifield;
  }

  return uifield;
};

export const getdvalue = (value: any) => {
  return JSON.parse(JSON.stringify(value));
};

const getvalue = (
  fieldui: ProjectUIFields,
  field: string,
  view: string,
  fieldName: string
) => {
  const name = field.replace(fieldName, '');
  if (view === 'FormParamater') {
    //this is for persistent, it's for developing/testing only, not ready for production yet
    if (name === 'persistent' || name === 'displayParent') return fieldui[name];
    if (name === 'relation_linked_vocabPair') {
      try {
        return fieldui['component-parameters']['relation_linked_vocabPair'][0];
      } catch (error) {
        return DEFAULT_REALTION_LINK_VOCAB;
      }
    }
    return fieldui['component-parameters'][name];
  }
  if (name === 'options' && view === 'ElementProps') {
    const options = fieldui['component-parameters']['ElementProps']['options'];
    let returnvalue = '';
    options.map(
      (option: any) => (returnvalue = option.value + ',' + returnvalue)
    );
    return returnvalue;
  }
  if (name === 'optiontree' && view === 'ElementProps') {
    const optiontree =
      fieldui['component-parameters']['ElementProps']['optiontree'];
    return JSON.stringify(optiontree);
  }
  if (['access', 'validationSchema'].includes(view)) return fieldui[name];
  if (view === 'meta' && fieldui['meta'] !== undefined) {
    if (name === 'uncertainty_include' || name === 'uncertainty_label')
      return fieldui['meta']['uncertainty'][name.replace('uncertainty_', '')];
    return fieldui['meta'][name];
  }
  if (view === 'meta' && fieldui['meta'] === undefined) {
    return false;
  }
  if (view === 'logic') {
    if (
      fieldui['logic_select'] !== undefined &&
      fieldui['logic_select']['type'] !== undefined
    )
      return fieldui['logic_select']['type'];
    else return [];
  }
  try {
    return fieldui['component-parameters'][view] !== undefined
      ? fieldui['component-parameters'][view][name] ??
          fieldui['component-parameters'][view]['children']
      : fieldui['component-parameters'][name];
  } catch (err) {
    console.error('error to get value:', view, name, err, fieldui);
    return 'not get value' + view + name;
  }
};

export const setSetingInitialValues = (
  uiSetting: ProjectUIModel,
  fieldui: ProjectUIFields,
  fieldName: string
) => {
  const initialValues: ProjectUIFields = {};

  // initialValues[fieldName]=fieldui['initialValue']
  // if(fieldui['component-name']==='TakePoint') initialValues[fieldName]=null

  uiSetting['viewsets']['settings']['views'].map((view: string) =>
    uiSetting['views'][view]['fields'].map(
      (field: string) =>
        (initialValues[field + fieldName] = getvalue(
          fieldui,
          field,
          view,
          fieldName
        ))
    )
  );
  const othersuiSpec = uiSettingOthers;
  othersuiSpec.visible_types.map((viewsets: string) =>
    othersuiSpec['viewsets'][viewsets]['views'].map((view: string) =>
      othersuiSpec['views'][view]['fields'].map(
        (field: string) =>
          (initialValues[field + fieldName] = getvalue(
            fieldui,
            field,
            view,
            fieldName
          ))
      )
    )
  );
  console.debug(initialValues);
  return initialValues;
};

const isArrayInArray = (arr: Array<any>, item: Array<any>) => {
  const item_as_string = JSON.stringify(item);
  const contains = arr.some(ele => {
    return JSON.stringify(ele) === item_as_string;
  });
  return contains;
};

const Componentsetting = (props: componenentSettingprops) => {
  const {handlerchangewithview, ...others} = props;

  const [uiSetting, setuiSetting] = useState(props.uiSetting);

  useEffect(() => {
    //this function should be used to get new project ui when project_id changes??

    let isactive = true;
    if (isactive) {
      setini();
    }
    return () => {
      isactive = false;
    };
  }, [
    props.projectvalue['forms'][props.currentform][
      'uncertainty' + props.currentform
    ],
  ]);

  const updatecertainty = (
    annotation_value: boolean,
    uncertainty_value: boolean
  ) => {
    const newuis: ProjectUIModel = uiSetting;
    newuis['fields']['annotation' + props.fieldName].checked = annotation_value;
    newuis['fields']['uncertainty_include' + props.fieldName].checked =
      uncertainty_value;
    newuis['views']['meta']['fields'] = ['annotation' + props.fieldName];
    if (annotation_value === true)
      newuis['views']['meta']['fields'].push(
        'annotation_label' + props.fieldName
      );
    newuis['views']['meta']['fields'].push(
      'uncertainty_include' + props.fieldName
    );
    if (uncertainty_value === true)
      newuis['views']['meta']['fields'].push(
        'uncertainty_label' + props.fieldName
      );
    setuiSetting({...newuis});
  };
  const setini = () => {
    try {
      updatecertainty(
        props.projectvalue['forms'][props.currentform][
          'annotation' + props.currentform
        ] ?? true,
        props.projectvalue['forms'][props.currentform][
          'uncertainty' + props.currentform
        ] ?? true
      );
    } catch (error) {
      updatecertainty(true, false);
    }
  };
  const handlerchanges = (event: any) => {
    const name = event.target.name.replace(props.fieldName, '');
  };

  const handlerchangewithviewSpec = (event: any, view: string) => {
    //any actions that could in this form
    props.handlerchangewithview(event, view);
    console.log(view + event.target.name + props.fieldName);
    if (
      view === 'meta' &&
      props.uiSpec['fields'][props.fieldName]['meta'] !== undefined
    ) {
      const newvalues = props.uiSpec;
      const name = event.target.name.replace(props.fieldName, '');
      if (name === 'uncertainty_include')
        newvalues['fields'][props.fieldName]['meta']['uncertainty'][
          name.replace('uncertainty_', '')
        ] = event.target.checked;
      else if (name === 'annotation')
        newvalues['fields'][props.fieldName]['meta'][name] =
          event.target.checked;
      else if (name === 'uncertainty_label')
        newvalues['fields'][props.fieldName]['meta']['uncertainty'][
          name.replace('uncertainty_', '')
        ] = event.target.value;
      else if (name === 'annotation_label')
        newvalues['fields'][props.fieldName]['meta'][name] = event.target.value;
      props.setuiSpec({...newvalues});

      if (name === 'uncertainty_include') {
        const value = event.target.checked;
        updatecertainty(
          props.uiSpec['fields'][props.fieldName]['meta'] !== undefined
            ? props.uiSpec['fields'][props.fieldName]['meta']['annotation'] ??
                true
            : true,
          value
        );
      }

      if (name === 'annotation') {
        const value = event.target.checked;
        updatecertainty(
          value,
          props.uiSpec['fields'][props.fieldName]['meta'] !== undefined &&
            props.uiSpec['fields'][props.fieldName]['meta']['uncertainty'] !==
              undefined
            ? props.uiSpec['fields'][props.fieldName]['meta']['uncertainty'][
                'include'
              ] ?? false
            : false
        );
      }
    }
    if (view === 'FormParamater') {
      const newvalues = props.uiSpec;
      const name = event.target.name.replace(props.fieldName, '');
      if (name === 'required') {
        const value = event.target.checked;
        if (value === true) {
          if (
            !isArrayInArray(
              newvalues['fields'][props.fieldName]['validationSchema'],
              ['yup.required']
            )
          ) {
            newvalues['fields'][props.fieldName]['validationSchema'].push([
              'yup.required',
            ]);
            props.setuiSpec({...newvalues});
            console.log('Not contain' + 'SHOULD');
          }
        } else {
          if (
            isArrayInArray(
              newvalues['fields'][props.fieldName]['validationSchema'],
              ['yup.required']
            )
          ) {
            newvalues['fields'][props.fieldName]['validationSchema'] =
              newvalues['fields'][props.fieldName]['validationSchema'].filter(
                (valid: Array<string>) => {
                  return !valid.includes('yup.required');
                }
              );
            props.setuiSpec({...newvalues});
            console.log('Contain' + 'SHould NOT');
          }
        }
        console.debug(newvalues['fields'][props.fieldName]['validationSchema']);
      }
    }
    if (view === 'other') {
      const name = event.target.name.replace(props.fieldName, '');
      if (name === 'field_type') {
        const value = event.target.value;
        if (value !== 'default') {
          const newvalues = props.uiSpec;
          newvalues['fields'][props.fieldName]['component-parameters'][
            'InputProps'
          ]['type'] = value;
          switch (value) {
            case 'string':
              newvalues['fields'][props.fieldName]['type-returned'] =
                'faims-core::String';
              newvalues['fields'][props.fieldName]['validationSchema'] = [
                ['yup.string'],
              ];
              if (
                newvalues['fields'][props.fieldName]['component-parameters'][
                  'required'
                ]
              )
                newvalues['fields'][props.fieldName]['validationSchema'] = [
                  ['yup.string'],
                  ['yup.required'],
                ];
              break;
            case 'number':
              newvalues['fields'][props.fieldName]['validationSchema'] =
                newvalues['fields'][props.fieldName]['type-returned'] =
                  'faims-core::Integer';
              newvalues['fields'][props.fieldName]['validationSchema'] = [
                ['yup.number'],
              ];
              if (
                newvalues['fields'][props.fieldName]['component-parameters'][
                  'required'
                ]
              )
                newvalues['fields'][props.fieldName]['validationSchema'] = [
                  ['yup.number'],
                  ['yup.required'],
                ];
              break;
            case 'email':
              newvalues['fields'][props.fieldName]['type-returned'] =
                'faims-core::Email';
              newvalues['fields'][props.fieldName]['validationSchema'] = [
                ['yup.string'],
                ['yup.email', 'Enter a valid email'],
              ];
              if (
                newvalues['fields'][props.fieldName]['component-parameters'][
                  'required'
                ]
              )
                newvalues['fields'][props.fieldName]['validationSchema'] = [
                  ['yup.string'],
                  ['yup.email', 'Enter a valid email'],
                  ['yup.required'],
                ];
              break;
            default:
              break;
          }
          props.setuiSpec({...newvalues});
          // InputProps: {
          //   type: 'number',
          // }
        }
      }
    }
    if (view === 'logic') {
      const value = event.target.value;
      let newvalues = props.uiSpec;
      let newuis = uiSetting;
      const name = event.target.name.replace(props.fieldName, '');
      newvalues = definelogic(
        newvalues,
        value,
        props.fieldName,
        name,
        props.currentview
      );
      newuis = generateuiforlogic(
        props.uiSpec,
        newuis,
        props.fieldName,
        props.currentform
      );
      props.setuiSpec({...newvalues});
      setuiSetting({...newuis});
    }
  };
  return (
    <>
      <Defaultcomponentsetting
        handlerchangewithview={handlerchangewithviewSpec}
        handlerchanges={handlerchanges}
        {...others}
        fieldui={props.fieldui}
        uiSetting={uiSetting}
      />
    </>
  );
};

const definelogicvalue = (
  value: any,
  fieldname: string,
  pur_fieldname: string
) => {
  if (value === undefined) {
    console.error('Error to get values for define logic');
    return value;
  }
  if (value['is_logic'] === undefined)
    return {...value, is_logic: {[fieldname]: [pur_fieldname]}};
  if (value['is_logic'][fieldname] === undefined)
    return {...value, is_logic: {[fieldname]: [pur_fieldname]}};
  if (!value['is_logic'][fieldname].includes(pur_fieldname)) {
    const values = value['is_logic'];
    values[fieldname].push(pur_fieldname);
    return {...value, is_logic: {...values}};
  }
  return value;
};
// add for branching logic setting, this is for testing/developing ONLY, not ready for production yet
const definelogic = (
  newvalues: ProjectUIModel,
  value: any,
  fieldname: string,
  name: string,
  viewName: string
) => {
  if (name === 'logic_select') {
    newvalues['fields'][fieldname][name] = {type: value};
    return newvalues;
  }
  if (
    newvalues['fields'][fieldname]['logic_select']['type'].includes('field')
  ) {
    // newvalues['fields'][fieldname]['logic_select'][
    //   name.replace('select', '').replace(fieldname, '')
    // ] = value;
    const pur_fieldname = name.replace('select', '').replace(fieldname, '');
    if (value.length > 0) {
      value.map((v: string) =>
        newvalues['fields'][v]['is_logic'] !== undefined
          ? newvalues['fields'][v]['is_logic'][fieldname] !== undefined
            ? !newvalues['fields'][v]['is_logic'][fieldname].includes(
                pur_fieldname
              ) &&
              newvalues['fields'][v]['is_logic'][fieldname].push(pur_fieldname)
            : (newvalues['fields'][v]['is_logic'][fieldname] = [pur_fieldname])
          : (newvalues['fields'][v]['is_logic'] = {
              [fieldname]: [pur_fieldname],
            })
      );
    }

    return newvalues;
  }
  if (newvalues['fields'][fieldname]['logic_select']['type'].includes('view')) {
    // newvalues['fields'][fieldname]['logic_select'][
    //   name.replace('select', '').replace(fieldname, '')
    // ] = value;
    const pur_fieldname = name.replace('select', '').replace(fieldname, '');
    if (value.length > 0) {
      value.map(
        (v: string) =>
          (newvalues['views'][v] = definelogicvalue(
            newvalues['views'][v],
            fieldname,
            pur_fieldname
          ))
      );
    }
    return newvalues;
  }
  console.error(newvalues);
  return newvalues;
};

const getlogicoption = (
  uiSpec: ProjectUIModel,
  currentform: string,
  type: string
) => {
  const options: Array<option> = [];
  if (type.includes('field')) {
    uiSpec['viewsets'][currentform]['views'].map((view: string) => {
      uiSpec['views'][view]['fields'].map((field: string) =>
        uiSpec['fields'][field]['component-name'] !== 'TemplatedStringField'
          ? options.push({
              value: field,
              label: uiSpec['fields'][field]['component-name'] + ' - ' + field,
            })
          : field
      );
    });
    return options;
  }

  if (type.includes('view')) {
    uiSpec['viewsets'][currentform]['views'].map((view: string) => {
      options.push({
        value: view,
        label: view,
      });
    });
    return options;
  }

  return options;
};

const generateuiforlogic = (
  uiSpec: ProjectUIModel,
  newvalues: ProjectUIModel,
  fieldName: string,
  currentform: string
) => {
  //TODO pass the value of all field in this form

  // let fields: Array<string> = [];

  const options = getlogicoption(
    uiSpec,
    currentform,
    uiSpec['fields'][fieldName]['logic_select']['type']
  );
  const newfieldlist: Array<string> = [];
  // only working for select,tick or audio
  if (
    uiSpec['fields'][fieldName]['component-parameters']['ElementProps'] ===
    undefined
  )
    return newvalues;
  const values =
    uiSpec['fields'][fieldName]['component-parameters']['ElementProps'][
      'options'
    ];
  for (let i = 0; i < values.length; i++) {
    //get all list field for the uiSpeting
    const name = 'select' + values[i].value + fieldName;
    const newfield = generatenewfield(
      'faims-custom',
      'MultiSelect',
      null,
      name,
      null
    );
    newfield['component-parameters']['ElementProps']['options'] = options;
    newfield['component-parameters']['required'] = true;
    newfield['validationSchema'] = [
      ['yup.string'],
      ['yup.required'],
      ['yup.min', 1],
    ];
    newfield['initialValue'] = [];
    newvalues['fields'][name] = newfield;
    // newini[name] = inivalue;
    newfieldlist[i] = name;
  }
  newvalues['views']['logic']['fields'] = [
    'logic_select' + fieldName,
    ...newfieldlist,
  ];
  // newvalues['fields']['template' + fieldName]['value'] = isinit
  //   ? templatevalue
  //   : value;
  // newini['numberfield' + props.fieldName] = fieldnum;
  // newini['label' + props.fieldName] =
  //   props.uiSpec['fields'][props.fieldName]['component-parameters'][
  //     'InputLabelProps'
  //   ]['label'];
  // // newini['template'+props.fieldName]=isinit?templatevalue:value
  // console.log(newini);
  // props.setinitialValues({...props.initialValues, ...newini});
  return newvalues;
};

const getuivalue = (
  namespace: string,
  componentName: string,
  uiSpec: ProjectUIModel,
  fieldName: string,
  designvalue: string
) => {
  if (designvalue === 'settings') {
    const originprops = getComponentPropertiesByName(namespace, componentName);
    const fieldui = uiSpec['fields'][fieldName] ?? originprops.settingsProps[1];
    const uiSetting = originprops.settingsProps[0];
    const newui = regeneratesettinguiSpec(uiSetting, fieldName, designvalue);
    const Component = originprops.builder_component;
    return {newui, fieldui, Component};
  } else {
    const uiSetting = JSON.parse(JSON.stringify(uiSettingOthers));
    if (uiSpec['fields'][fieldName]['component-name'] === 'TextField') {
      uiSetting['viewsets']['valid']['views'] = [
        'other',
        'FormParamater',
        'validationSchema',
      ];
    }
    const fieldui = uiSpec['fields'][fieldName];
    const newui = regeneratesettinguiSpec(uiSetting, fieldName, designvalue);
    const Component = Componentsetting;
    return {newui, fieldui, Component};
  }
};

export function ResetComponentProperties(props: resetprops) {
  const {
    namespace,
    componentName,
    uiSpec,
    setuiSpec,
    fieldName,
    formProps,
    designvalue,
    currentview,
    currentform,
    initialValues,
    setinitialValues,
    projectvalue,
  } = props;
  const {newui, fieldui, Component} = getuivalue(
    namespace,
    componentName,
    uiSpec,
    fieldName,
    designvalue
  );

  const handlerchangefunction = (
    event: FAIMSEVENTTYPE,
    elementprop: string
  ) => {
    if (
      ['meta', 'access', 'validationSchema', 'other', 'logic'].includes(
        elementprop
      )
    )
      return true;
    const newvalues = uiSpec;
    let ishird = false;
    const newfieldname = HRID_STRING + currentform;
    if (
      newvalues['fields'][fieldName]['component-name'] ===
        'TemplatedStringField' &&
      newvalues['fields'][fieldName]['component-parameters']['hrid'] === true
    ) {
      //set newvalue for hird
      ishird = true;
    }
    if (newvalues['fields'][fieldName] === undefined) {
      newvalues['fields'][fieldName] = generatenewname(fieldui, fieldName);
    }
    const name = event.target.name.replace(fieldName, '');
    if (elementprop === 'FormParamater')
      if (name === 'required') {
        newvalues['fields'][fieldName]['component-parameters'][name] =
          event.target.checked;
        if (ishird)
          newvalues['fields'][newfieldname]['component-parameters'][name] =
            event.target.checked;
      } else if (name === 'hrid') {
        //not update value here
        // newvalues['fields'][fieldName]['component-parameters'][name] =
        // event.target.checked;
      } else if (name === 'relation_linked_vocabPair') {
        // not update value here
      } else if (name === 'persistent' || name === 'displayParent') {
        //set persistent value
        newvalues['fields'][fieldName][name] = event.target.checked;
      } else {
        newvalues['fields'][fieldName]['component-parameters'][name] =
          event.target.value;
        if (ishird)
          newvalues['fields'][newfieldname]['component-parameters'][name] =
            event.target.value;
      }
    else if (
      elementprop === 'FormLabelProps' ||
      elementprop === 'FormHelperTextProps'
    ) {
      newvalues['fields'][fieldName]['component-parameters'][elementprop][
        'children'
      ] = event.target.value;
      if (ishird)
        newvalues['fields'][newfieldname]['component-parameters'][elementprop][
          'children'
        ] = event.target.value;
    } else if (name !== 'options') {
      newvalues['fields'][fieldName]['component-parameters'][elementprop][
        name
      ] = event.target.value;
      if (ishird)
        newvalues['fields'][newfieldname]['component-parameters'][elementprop][
          name
        ] = event.target.value;
    }

    setuiSpec({...newvalues});
    return true;
  };

  const handlerchangewithview = (event: FAIMSEVENTTYPE, view: string) =>
    handlerchangefunction(event, view);

  return (
    <>
      {uiSpec['fields'][fieldName] !== undefined && (
        <Component
          uiSetting={newui}
          formProps={formProps}
          component={Component}
          uiSpec={uiSpec}
          setuiSpec={setuiSpec}
          fieldName={fieldName}
          fieldui={fieldui}
          designvalue={designvalue}
          handlerchangewithview={handlerchangewithview}
          currentview={currentview}
          currentform={currentform}
          initialValues={initialValues}
          setinitialValues={setinitialValues}
          projectvalue={projectvalue}
        />
      )}
    </>
  );
}
