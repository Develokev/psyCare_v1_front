//esto va a ser la Home Page sin loguearse.
import { FooterBar } from "../Components/Footer"
import { LoginForm } from "../Components/LoginForm"
import { RegisterForm } from "../Components/RegisterForm"
import { useState } from "react"

export const HomePage = () => {

  const [loginForm, setLoginForm] = useState(false)
  const [registerForm, setRegisterForm] = useState(false)

  const handleClickLogin = () => {
    if (!loginForm) {
      setLoginForm(true)
      setRegisterForm(false)
      //console.log("setting login true")
    } else {
      setLoginForm(false);
      //console.log("setting login false")
    }
  }

  const handleClickRegister = () => {
    if (!registerForm) {
      setRegisterForm(true)
      setLoginForm(false)
      //console.log("setting register true")
    } else {
      setRegisterForm(false);
      //console.log("setting register false")
    }
  }
  
    return (
      <>
      <header>
          Esto es HEADER
      </header>

      <button
      onClick= {handleClickLogin}>Login Form</button>

      <button
      onClick= {handleClickRegister}>Register Form</button>
      {
       loginForm && <LoginForm/>
      } 
      {
       registerForm && <RegisterForm/>
      }
      <footer>
        {/* <FooterBar/> */}
      </footer>
      </>
    )
  }