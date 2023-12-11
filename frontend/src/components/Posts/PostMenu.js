import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled, alpha } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import FlagIcon from '@mui/icons-material/Flag';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function LongMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [followstat, setFollowStat] = React.useState(props.following)
  const [savestat, setSaveStat] = React.useState(props.saved)

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFollow = () => {
    setFollowStat(!followstat);
    props.follow(props.user_id);
  }

  const handleSave = () => {
    setSaveStat(!savestat);
    props.save({post_id: props.post_id, savestat: savestat});
  }

  const handleRemove = () => {
    props.remove(props.post_id);
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {
          followstat ?
          <MenuItem onClick={handleClose} disableRipple>
          <HowToRegIcon />
          Follow
          </MenuItem>
          :
          <MenuItem onClick={handleFollow} disableRipple>
          <PersonAddAlt1Icon />
          Follow
          </MenuItem>
        }
        {
          props.where === "subgreddiit" ?
            savestat ?
            <MenuItem onClick={handleClose} disableRipple>
            <BookmarkAddedIcon />
             Save Post
            </MenuItem>
            :
            <MenuItem onClick={handleSave} disableRipple>
            <BookmarkAddIcon />
            Save Post
            </MenuItem>
          :
          <MenuItem onClick={handleRemove} disableRipple>
          <BookmarkRemoveIcon />
           Remove Post
          </MenuItem>
        }
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleClose} disableRipple>
          <FlagIcon />
          Report
        </MenuItem>
      </StyledMenu>
    </div>
  );
}