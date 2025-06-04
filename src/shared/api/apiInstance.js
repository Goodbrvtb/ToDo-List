export class TaskApi {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }
  async _request(endpoint, method = "GET", body = null) {
    const headers = {
      Authorization: `Bearer ${this.token}`,
      ...(body && { "Content-Type": "application/json" })
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.status !== 204 ? response.json() : null;
  }
  async getTasks() {
    return this._request("/api/todos");
  }
  async createTask(task) {
    return this._request("/api/todos", "POST", task);
  }
  async deleteTask(id) {
    return this._request(`/api/todos/${id}`, "DELETE");
  }
  async editTaskApi(todo, id) {
    return this._request(`/api/todos/${id}`, "PATCH", todo);
  }
  async patchTaskApi(id) {
    return this._request(`/api/todos/${id}/isCompleted`, "PATCH");
  }
}
