import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UsersData from './presentation/components/usersData';
import CreateAndEditForm from './presentation/components/createAndEditForm';
import UserData from './presentation/components/userData';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="/users" element={<UsersData />} />
        <Route path="/users/create" element={<CreateAndEditForm />} />
        <Route path="/users/:id" element={<UserData />} />
        <Route path="/users/:id/edit" element={<CreateAndEditForm />} />
      </Routes>
    </BrowserRouter>
  )
}