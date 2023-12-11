import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Lists from '../Lists/Lists';
import axios from 'axios';
import Root from "../../url";

function SimpleDialog(props) {
  const { onClose, open, title, user_id, list, del } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth={true} maxWidth={"xs"} scroll={"paper"}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>
      <Lists 
      title={title}
      user_id={user_id}
      list={list}
      del={del}
      />
      </DialogContent>
    </Dialog>
  );
}

export default function PopOut(props) {
  const [open, setOpen] = React.useState(false);
  const [list, setList] = React.useState()
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function getData() {
      try {
        const url = Root() + "/profilelists/" + props.user_id + "/" + props.title
        const response = await axios.get(url)
        if (response.data.status === "OK") {
          setList(response.data.info)
          setIsLoading(false)
        }
        else console.log("Problem")
      } catch (error) {
        console.log(error.response.data)
      }
    }
    getData()
}, [])

  const del = async (info) => {
    try {
      const url = Root() + "/deleteuser/" + info.my_id + "/" + info.title + "/" + info.o_id
      const response = await axios.get(url)
      if (response.data.status === "OK") {
        const newList = list.filter(item => item._id !== info.o_id)
        setList(newList)
      }
      else console.log("Problem")
    } catch (error) {
      console.log(error.response.data)
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  if (isLoading) return <div>Loading...</div>
  else return (
    <div>
      <Button variant="" onClick={handleClickOpen}>
        <strong>{props.title + " " + list.length}</strong>
      </Button>
      <SimpleDialog
        open={open}
        onClose={handleClose}
        title={props.title}
        user_id={props.user_id}
        list={list}
        del={del}
      />
    </div>
  );
}