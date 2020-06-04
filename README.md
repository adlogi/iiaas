# Incrementing Integers As A Service

A server that serves incerementing integers.

Task description: [https://www.notion.so/Full-Stack-Developer-Take-Home-Assignment-f32f9909782e4339a1e389aaa5f08dae](https://www.notion.so/Full-Stack-Developer-Take-Home-Assignment-f32f9909782e4339a1e389aaa5f08dae)

This service allows you to:

- Register as a user using an email address and a password. You get an API key in return.
- Retrieve the next integer in your sequence when called.

```
https://iiaas.glitch.me/v1/next?key=wpJrFwpVQ9
curl https://iiaas.glitch.me/v1/next -H "key: wpJrFwpVQ9"
```

- Fetch your current integer.

```
https://iiaas.glitch.me/v1/current?key=wpJrFwpVQ9
curl https://iiaas.glitch.me/v1/current -H "key: wpJrFwpVQ9"
```

- The endpoint is secured by an API key.
- Allows you to reset your integer to an arbitrary, non-negative value.

```
https://iiaas.glitch.me/v1/set?key=wpJrFwpVQ9&value=50
curl -X "PUT" https://iiaas.glitch.me/v1/current -H "key: wpJrFwpVQ9" -d "current=50"
```

## Project Structure

On the front-end,

- Edit `views/index.html` to change the content of the webpage
- `public/client.js` is the javacript that runs when you load the webpage
- `public/style.css` is the styles for `views/index.html`

On the back-end,

- your app starts at `server.js`
- add frameworks and packages in `package.json`
- safely store app secrets in `.env` (nobody can see this but you and people you invite)

Click `Show` in the header to see your app live. Updates to your code will instantly deploy.

## Made by [Glitch](https://glitch.com/)

**Glitch** is the friendly community where you'll build the app of your dreams. Glitch lets you instantly create, remix, edit, and host an app, bot or site, and you can invite collaborators or helpers to simultaneously edit code with you.

Find out more [about Glitch](https://glitch.com/about).

( ᵔ ᴥ ᵔ )