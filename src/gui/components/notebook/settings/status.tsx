import React from 'react';
import {Box, Chip, ChipProps} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import HourglassTopOutlinedIcon from '@mui/icons-material/HourglassTopOutlined';

// import {ProjectInformation} from '../../../../datamodel/ui';
interface ProjectStatusProps {
  status: string | undefined;
  // | 'local_draft'
  // | 'awaiting_approval'
  // | 'published'
  // | 'archived'
  // | 'deleted'
}
interface iconMappingProps {
  [key: string]: React.ReactElement;
}
interface colorMappingProps {
  [key: string]: ChipProps['color'];
}
const statusTypes = [
  'local_draft',
  'awaiting_approval',
  'published',
  'archived',
  'deleted',
];
export default function ProjectStatus(props: ProjectStatusProps) {
  const colorMapping: colorMappingProps = {
    local_draft: 'warning',
    awaiting_approval: 'default',
    published: 'success',
    archived: 'info',
    deleted: 'error',
  };
  const iconMapping: iconMappingProps = {
    local_draft: <FolderOpenIcon />,
    awaiting_approval: <HourglassTopOutlinedIcon />,
    published: <TaskAltOutlinedIcon />,
    archived: <Inventory2OutlinedIcon />,
    deleted: <DeleteForeverIcon />,
  };
  return (
    <Box mb={1}>
      <Chip
        color={
          props.status !== undefined ? colorMapping[props.status] : 'error'
        }
        icon={
          props.status !== undefined && statusTypes.includes(props.status) ? (
            iconMapping[props.status]
          ) : (
            <QuestionMarkIcon />
          )
        }
        label={
          props.status !== undefined
            ? props.status.split('_').join(' ')
            : 'undefined'
        }
        sx={{textTransform: 'capitalize'}}
      />
    </Box>
  );
}
