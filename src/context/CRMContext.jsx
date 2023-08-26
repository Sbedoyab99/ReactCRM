import { createContext, useState } from "react";

const token = localStorage.getItem('token') ? localStorage.getItem('token') : ''
const isAuth = token !== '' ? true : false

const CRMContext = createContext([{}, () => {}])
const CRMProvider = props => {
  const [auth, setAuth] = useState({
    token,
    auth: isAuth
  })

  return (
    <CRMContext.Provider value={[auth, setAuth]}>
      {props.children}
    </CRMContext.Provider>
  )
}

export {
  CRMContext,
  CRMProvider
}