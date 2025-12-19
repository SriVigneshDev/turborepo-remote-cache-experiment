import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://reqres.in/api',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'reqres_b3851a2172f649328218559d59a7c81b',
  },
})

export interface ApiError {
  status: number
  message: string
}
