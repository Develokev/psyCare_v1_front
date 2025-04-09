import {Routes, Route, Navigate} from 'react-router-dom'
import { HomePage } from '../Public/Pages/HomeUser'

export const AppRouters = () => {

  return (

    <>
    <Routes>

        <Route path='/' element={<HomePage />} />

        <Route path='/*' element={<Navigate to={'/'} />} />

    </Routes>
    </>

  )
}
