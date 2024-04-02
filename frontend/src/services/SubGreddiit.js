import axios from 'axios'
const baseUrl = '/api/SubGreddiits'

let token = null
if (window.localStorage.getItem('token')) {
  token = `bearer ${(JSON.parse(window.localStorage.getItem('token'))).token}`
}
const setToken = newToken => {
  token = `bearer ${(JSON.parse(window.localStorage.getItem('token'))).token}`
}


const getAll = () => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data).catch(error => console.log(error))
}

const getid = (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const loggedUserJSON = window.localStorage.getItem('token')
  if (loggedUserJSON) {
    const request = axios.get(`${baseUrl}/${id}`, config)
    return request.then(response => response.data).catch(error => console.log(error))
  }
  else {
    console.log("User is not logged in, but is trying to Fetch get request")
  }
}

const getID = () => {
  const loggedUserJSON = window.localStorage.getItem('token')
  const config = {
    headers: { Authorization: token },
  }
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    const request = axios.get(`${baseUrl}/User/${user.id}`, config)
    return request.then(response => response.data).catch(error => console.log(error))
  }
  else {
    console.log("User is not logged in, but is trying to Fetch get request")
  }
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const UpdateClicks = (id,newObject) => {
  const config = {
    headers: { Authorization: `bearer ${(JSON.parse(window.localStorage.getItem('token'))).token}` },
  }
  const request = axios.put(`${baseUrl}/Click/${id}`,{},config)
  return request.then(response => response.data).catch(error => console.log(error))
}

const UpdateProfile = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.put(`${baseUrl}/update/${id}`, newObject, config)
  return request.then(response => response.data).catch(error => console.log(error))
}

const BlockUser = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.put(`${baseUrl}/block/${id}`, newObject, config)
  return request.then(response => response.data).catch(error => console.log(error))
}

const AcceptRequest = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  } 
  const request = axios.put(`${baseUrl}/accept/${id}`, newObject, config)
  return request.then(response => response.data).catch(error => console.log(error))
}

const RejectRequest = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.put(`${baseUrl}/reject/${id}`, newObject, config)
  return request.then(response => response.data).catch(error => console.log(error))
}

const JoinSubGreddit = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.put(`${baseUrl}/join/${id}`, newObject, config)
  return request.then(response => response.data).catch(error => console.log(error))
}

const LeaveSubGreddit = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.put(`${baseUrl}/leave/${id}`, newObject, config)
  return request.then(response => response.data).catch(error => console.log(error))
}
// Updating Reports and Reported
const DeleteReport = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.put(`${baseUrl}/Reports/${id}`, newObject, config)
  return request.then(response => response.data).catch(error => console.log(error))
}

const DeletePost = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.put(`${baseUrl}/Posts/${id}`, newObject, config)
  return request.then(response => response.data).catch(error => console.log(error))
}

const DeleteRemoveUser = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.put(`${baseUrl}/RemoveUser/${id}`, newObject, config)
  return request.then(response => response.data).catch(error => console.log(error))
}

const Delete = (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then(response => response.data).catch(error => console.log(error))
}

const newobj = { getAll, getID, getid, create, UpdateProfile, setToken, Delete, DeleteReport, BlockUser, JoinSubGreddit, LeaveSubGreddit, AcceptRequest, RejectRequest, UpdateClicks, DeletePost }
export default newobj 