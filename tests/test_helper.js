const Blog = require('../models/blog')
const User = require('../models/user')
const initialBlogs = [
  {
    title: 'Let it go',
    author: 'Mike Tran',
    url: 'letitgo.com.vn',
    likes: 50
  },
  {
    title: 'Heal the World',
    author: 'M.J.',
    url: 'michael.jackson.com',
    likes: 1000
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
