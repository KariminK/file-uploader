/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/views/*.ejs"],
  theme: {
    extend: {
      backgroundImage: {
        cosmos:
          "url('https://images.unsplash.com/photo-1716050866907-05f17aa6deda?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      },
    },
  },
  plugins: [],
};
