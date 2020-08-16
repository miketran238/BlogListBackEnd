/* eslint-disable linebreak-style */

const totalLikes = (blogs) => {
  let res = 0
  blogs.map(blog => res += blog.likes)
  return res
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  return blogs.reduce((a,b) => a.likes>b.likes?a:b)
}


module.exports = {
  totalLikes,
  mostLikes
}