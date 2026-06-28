import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Landing from '../pages/Landing'
import RolePortal from '../pages/RolePortal';
import Signin from "../pages/Signin"
import Signup from "../pages/SignUp"
import Forgetpsw from '../pages/ForgetPassword'
import BookSlot from '../pages/BookSlot';
import TurfView from '../pages/TurfView'
import Payment from '../pages/Payment'
import Tournamentall from '../pages/tournaments/Tournaments'
import TournRegestration from '../pages/tournaments/TournRegestration';
import UserProfile from '../pages/profiles/UserProfile'
import UserDashboard from '../pages/profiles/UserDashboard'
import OwnerDashboard from '../pages/owner/OwnerDashboard';
import OwnerTurfManagement from '../pages/owner/OwnerTurfManagement';
import OwnerProfile from '../pages/owner/OwnerProfile';

export default function Routers() {
  return (
    <Routes>
        <Route path='/' element={<RolePortal/>}/>
        <Route path='/home' element={<Landing/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/Signin' element={<Signin/>}/>
        <Route path='/Signup' element={<Signup/>}/>
        <Route path='/forgot-password' element={<Forgetpsw/>}/>
        <Route path='/bookslot' element={<BookSlot/>}/>
        <Route path='/turfview/:id' element={<TurfView/>}/>
        <Route path='/turfview/:id/payment' element={<Payment/>}/>
        <Route path='/tournaments' element={<Tournamentall/>}/>
        <Route path='/tournamentsregistration/:tournamentId' element={<TournRegestration/>}/>
        <Route path='/userprofile' element={<UserProfile/>}/>
        <Route path='/dashboard' element={<UserDashboard/>}/>
        <Route path='/owner/dashboard' element={<OwnerDashboard/>}/>
        <Route path='/owner/turfs' element={<OwnerTurfManagement/>}/>
        <Route path='/owner/profile' element={<OwnerProfile/>}/>
    </Routes>
  )
}
