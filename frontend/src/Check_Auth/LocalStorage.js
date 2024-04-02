const user_is_authenticated = () => {
    return localStorage.getItem('token');
}

const user_logout = () => {
    localStorage.removeItem('token');
}

export { user_is_authenticated,user_logout };