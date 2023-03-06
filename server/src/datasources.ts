import { RESTDataSource } from 'apollo-datasource-rest'

export default class JsonPlaceAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = 'https://jsonplaceholder.typicode.com/'
  }

  async getUsers() {
    const data = await this.get('/users')
    return data
  }
  
  async getUser(id: string) {
    const data = await this.get(`/users/${id}`)
    return data
  }

  async getPosts() {
    const data = await this.get('/posts')
    return data
  }
}

export type { JsonPlaceAPI as JsonPlaceAPIType }