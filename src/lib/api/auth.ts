import axios from 'axios'
import { serverPost, apiDelete } from './client'
import { useAuthStore } from '@/store/authStore'
import { API_ENDPOINTS } from '@/constants/api'

type SignupInput = {
  username: string
  nickname: string
}

export async function login(clerkToken: string): Promise<'ok' | 'not_found'> {
  try {
    const data = await serverPost<{ access_token: string }>(
      API_ENDPOINTS.AUTH_LOGIN,
      clerkToken
    )
    useAuthStore.getState().setAccessToken(data.access_token)
    return 'ok'
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return 'not_found'
    }
    throw error
  }
}

export async function signup(clerkToken: string, data: SignupInput): Promise<void> {
  const res = await serverPost<{ access_token: string }>(
    API_ENDPOINTS.AUTH_SIGNUP,
    clerkToken,
    data
  )
  useAuthStore.getState().setAccessToken(res.access_token)
}

export async function logout(): Promise<void> {
  await apiDelete(API_ENDPOINTS.AUTH_LOGOUT)
  useAuthStore.getState().clearAccessToken()
}
