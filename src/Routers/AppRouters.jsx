import { HomePage } from '../Home/Pages/HomePage'

export const AppRouters = () => {

  return (

    <>
    <Routes>

        <Route path='home' element={<HomePage />} />

        <Route path='/*' element={<Navigate to={'home'} />} />

    </Routes>
    </>

  )
}
