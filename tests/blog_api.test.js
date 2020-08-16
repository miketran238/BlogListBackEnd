const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('the first blog is about Let it go', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].title).toBe('Let it go')
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  expect(contents).toContain(
    'Heal the World'
  )
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultBlog.body).toEqual(blogToView)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'What I talk about',
    author: 'Murakami',
    url: 'tsuMukai@com',
    likes: 1000
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain(
    'What I talk about'
  )
})

test('delete the first blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Do Vuong Dai Ngoc',
    url: 'dvdn.com',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('update the first blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  console.log(blogToUpdate)
  const newBlog = {
    title: 'Let it down',
    author: 'Mike Chan',
    url: 'letitgo.com.vn',
    likes: 2000
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).toContain('Let it down')
})

afterAll(() => {
  mongoose.connection.close()
})