module.exports = {
  "extends": ["plugin:react/recommended", "airbnb-base"],
  "parser": "babel-eslint",
  "rules": {
    // windows linebreaks when not in production environment
    "linebreak-style": ["error", process.env.NODE_ENV === 'prod' ? "unix" : "windows"]
  },
  "settings": {
    "import/resolver": {
      "node": {
        "paths": ["src"]
      }
    }
  }

};