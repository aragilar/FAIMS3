import React, {useEffect, useState} from 'react';
import {CircularProgress, Chip} from '@material-ui/core';
import {getProjectMetadata} from '../../projectMetadata';
import {ProjectID} from '../../datamodel';

type MetadataProps = {
  project_id: ProjectID;
  metadata_key: string;
  metadata_label?: string;
};

export default function MetadataRenderer(props: MetadataProps) {
  const project_id = props.project_id;
  const metadata_key = props.metadata_key;
  const metadata_label = props.metadata_label;
  const [metadata_value, setMetadata] = useState(null as string | null);

  useEffect(() => {
    const getMeta = async () => {
      try {
        const meta = await getProjectMetadata(project_id, metadata_key);
        setMetadata(meta);
      } catch (err) {
        setMetadata('Unknown');
      }
    };
    getMeta();
  });

  return (
    <Chip
      size={'small'}
      style={{marginRight: '5px'}}
      label={
        <React.Fragment>
          {metadata_label ? (
            <span>{metadata_label}: </span>
          ) : (
            <React.Fragment />
          )}
          {metadata_value ? (
            <span>{metadata_value}</span>
          ) : (
            <CircularProgress size={12} thickness={4} />
          )}
        </React.Fragment>
      }
    />
  );
}
