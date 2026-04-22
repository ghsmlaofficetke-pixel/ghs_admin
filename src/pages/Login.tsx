import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../features/auth/authSlice'

export default function Login() {
  const dispatch = useDispatch<any>()
  const navigate = useNavigate()

  const submit = async () => {
    await dispatch(login({ email: 'test@test.com', password: '123456' }))
    navigate('/dashboard')
  }

  return <button onClick={submit}>Login</button>
}
