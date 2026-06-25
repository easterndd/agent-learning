const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
const AUTH_TOKEN_KEY = "enterprise-ai-copilot-token";

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: "bearer";
  user_id: string;
  username: string;
};

export function getAuthToken(): string | null {
  // localStorage 只能在浏览器使用；服务端渲染阶段要直接返回 null。
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveAuthToken(token: string): void {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  // 所有页面统一走这里，后续要做 401 跳转、请求日志、toast 都可以在这里加。
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    // auth=true 表示这个请求需要携带登录 token。
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  if (!response.ok) {
    // TODO: 改成自定义 ApiError，把 status/detail 暴露给页面做更细提示。
    throw new Error(`API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function apiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "GET" });
}

export async function apiPost<TResponse, TBody>(
  path: string,
  body: TBody,
  options: RequestOptions = {},
): Promise<TResponse> {
  return apiRequest<TResponse>(path, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiPatch<TResponse, TBody>(
  path: string,
  body: TBody,
  options: RequestOptions = {},
): Promise<TResponse> {
  return apiRequest<TResponse>(path, {
    ...options,
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function apiDelete(path: string, options: RequestOptions = {}): Promise<void> {
  return apiRequest<void>(path, { ...options, method: "DELETE" });
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return apiPost<LoginResponse, LoginRequest>("/auth/login", payload);
}
