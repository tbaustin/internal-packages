module.exports = {
  plugins: [
    {
      resolve: `gatsby-theme-esca-boilerplate`,
      options: {
        icon: ``
      }
    },
    {
      resolve: `gatsby-plugin-compile-es6-packages`,
      options: {
        modules: [`gatsby-theme-esca-boilerplate`]
      }
    }
  ]
}
