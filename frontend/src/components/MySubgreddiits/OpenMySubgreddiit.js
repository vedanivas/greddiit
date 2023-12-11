import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import FlagIcon from '@mui/icons-material/Flag';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DisplayUsers from './DisplayUsers';
import { useParams } from 'react-router-dom';
import DisplayRequests from './DisplayRequests';

export default function LabTabs() {

  const { subgreddiitID } = useParams()
  
  const [value, setValue] = React.useState('0');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab icon={<GroupIcon />} label="Users" value="0" />
            <Tab icon={<PersonAddAlt1Icon />} label="Requests" value="1" />
            <Tab icon={<LeaderboardIcon />} label="Stats" value="2" />
            <Tab icon={<FlagIcon />} label="Reports" value="3" />
          </TabList>
        </Box>
        <TabPanel value="0"><DisplayUsers /></TabPanel>
        <TabPanel value="1"><DisplayRequests /></TabPanel>
        <TabPanel value="2">Stats</TabPanel>
        <TabPanel value="3">Reports</TabPanel>
      </TabContext>
    </Box>
  );
}