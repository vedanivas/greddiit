import * as React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListContent from './ListContent';


export default function Lists(props) {   

  return (
    <List sx={{ pt: 0 }}>
        {props.list && props.list.map((item) => {
          return (
            <ListContent 
            fname={item.fname} 
            lname={item.lname} 
            uname={item.uname}
            o_id={item._id}
            my_id={props.user_id}
            title={props.title}
            del={props.del} 
            key={item._id} 
            />
          )
        })}
    </List>
  );
}