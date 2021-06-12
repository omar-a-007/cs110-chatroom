# Extended Chatroom Project

## Quick Usage Instructions
### Start Server

1. cd server
2. npm install
3. npm start

### Start Frontend (React)

1. cd client
2. npm install
3. npm start

## View Frontend

Navigate to: http://localhost:3000
Ports can be customized in client/constants and server/constants. Make sure you adjust the related port as they rely on each other.

## Info

I completed the project using using websockets, thus both a server and client server are required to be running.
Environment variables can be found in the client/server constants folder (for setting port, etc)

### Known Issues:
/login and /signup
-   If the action fails (invalid data, already taken account, etc), you need to re-enter your data.
-   The easiest way is to refresh.
-   You will still see your old data, BUT: it will not persist through to the form action, causing the login/signup to fail again.
-   -   I use state variables so Im not quite sure why this occurs, but I decided to focus on other elements of the project instead.

## Features:
#### Homepage
-   Sort Chatrooms by creation date (Ascending, decending)
-   Room stats: Participants, Messages, Creation Date
-   Static (for now) room image
-   Search Rooms

#### Chatroom
-   Emoticons are emojified, thats things like :) :D ;D etc etc
-   Author online status is displayed with a green (online) or gray (offline) dot
-   Entering an empty string informs the user to enter a message
-   Displays a history of messages (limited to 20, but limit is customizable through constants)
-   Chat scrolls to bottom on loading/new message.
    -   In the bottom right, there is a small black dot when you click on it, it will scroll to the bottom
-   Hover over a message for additional actions
    As the author of a message, you can delete it (other actions are not yet supported). If youre not the author this isnt displayed.
    On the backend, the logged in user is also checked with the claimed author id to protect against forgery attacks
-   Socket Authentication Middleware
    Persists token and makes sure we are logged in when messaging
    
#### Profile
-   You can update your Display Name
    TODO: Full profile buildout. The schema is already there to store a lot more information, such as favorite rooms, etc.
    
#### Everywhere
-   Authentication, Data Validation+Sanitization (via express-validator, socket based checking, and Formik)

#### Server
-   Api Routes
-   -   Everything is serverd through <server>/api/
-   -   All routes have been thoroughly tested via Postman
-   Sockets served via the default GET <server>/socket.io/
-   Everything else is blocked with a basic 404 Not Authorized Response

## Toolset
#### Frameworks
-   Node/Express, MongoDB via Mongoose, React

#### Server Packages
-   bcrypt              (password hashing)
-   cors                (since running a server/client setup, requests originate from a different port and will be blocked by browsers by default)
-   express-validator   (validate + sanitize requests)
-   morgan              (log server response codes and response time)
-   socket.io           ✨ Magic ✨ Also is the reason a seperate client/server are needed and made doing this 10-20x harder, easily. That said, I learned a lot.

#### Client Packages
*Note: There are several packages that I installed, played with, and removed but remain in the package.json such as emoji-mart*
-   axios                   (making web requests more easily)
-   bootstrap               
-   formik                  (More advanced form creation)
-   moment                  (Easily process/convert timestamps into readable formats)
-   react-emoji             (Converts emoticons into emoji's)
-   react-scroll-to-bottom  (Scroll an enclosed section to the bottom. Just as easy to do with useRef, which I was doing previously.)
-   yup                     (JS schema builder, mainly used in conjunction with formik)
-   socket.io-client        ✨ Magic ✨

