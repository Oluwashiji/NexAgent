/**
 * API client. Every call to the backend goes through here instead of
 * scattering fetch() calls across components - one place to handle the
 * base URL, auth headers, and error formatting.
 */

const API_URL = import.meta.env.VITE_API_URL as string

const TOKEN_KEY = 'nexagent_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function isLoggedIn(): boolean {
  return getToken() !== null
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    let detail = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body?.detail) {
        detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail)
      }
    } catch {
      // response wasn't JSON - keep the generic message
    }
    throw new ApiError(detail, res.status)
  }
  return res.json()
}

export async function signup(email: string, password: string, businessName: string) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, business_name: businessName }),
  })
  const data = await handleResponse(res)
  setToken(data.access_token)
  return data
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await handleResponse(res)
  setToken(data.access_token)
  return data
}

export function logout() {
  clearToken()
}

function authHeaders(): HeadersInit {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function uploadDocument(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_URL}/api/documents/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  })
  return handleResponse(res)
}

export async function listDocuments() {
  const res = await fetch(`${API_URL}/api/documents`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export async function deleteDocument(docId: string) {
  const res = await fetch(`${API_URL}/api/documents/${docId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export async function chatQuery(businessId: string, query: string, docId?: string) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ business_id: businessId, query, doc_id: docId }),
  })
  return handleResponse(res)
}