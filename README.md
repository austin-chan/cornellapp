# Cornellapp
The Best Way to Schedule Your Semesters at Cornell University

# Isomorphic Javascript Structure
Cornellapp is entirely written in Javascript (Node), allowing logic to be shared when executing code in the frontend and backend. Using the same language in the frontend and backend cuts down development time, obviates possible confusion between multiple languages, and most importantly allows client-side rendering to be run in the server-side environment, making the application a single isomorphic entity. The isomorphic structure enables the application to deliver pre-rendered pages that only need to be initialized in the client-side instead of delivering empty pages that need to be completely built client-side. This prevents the modern phenomenon known as the [Flash of Client-Side Rendering](https://twitter.com/codepo8/status/576677287124426752), which occurs commonly in client-side frameworks like Angular and Ember, reduces user loading time, and dramatically improves SEO strength. As it stands, [React](http://facebook.github.io/react/) stands as the clear solution for creating isomorphic javascript applications, and for this reason, Cornellapp was built with React.

# React + Flux
Cornellapp's React code is architectured with a unidirectional data flow paradigm called [Flux](https://facebook.github.io/flux/), which like React was created and open-sourced by Facebook – God bless them.

# Engineering Opinion

In progress...
![In-progress Screenshot](./screenshot.png?raw=true)
