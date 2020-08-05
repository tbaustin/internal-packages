

module.exports = [
  {
    from: `/admin/static/*`,
    to: `/admin/static/:splat`,
    status: 200,
  },
  {
    from: `/admin/*`,
    to: `/admin/index.html`,
    status: 200,
  },
  {
    from: `/admin`,
    to: `/admin/index.html`,
    status: 200,
  }
]
