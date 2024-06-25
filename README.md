## Blog Project

This project is a full-stack blog application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to register, login, create, edit, and view blog posts. The backend is implemented with Express and MongoDB, while the frontend is developed using React.


### Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed
- MongoDB instance running locally or remotely
- `.env` file configured with necessary environment variables (`MONGODB_URI`, `PORT`, `JWT_SECRET`)

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd <repository-directory>

npm install

Configuration
Create a .env file in the root directory of your project. Add environment-specific variables on new lines in the form of NAME=VALUE. For example:

MONGODB_URI=<your-mongodb-uri>
PORT=<your-port-number>
JWT_SECRET=<your-jwt-secret>

Run
To run the server, execute:

npm start OR npm run dev

The server will start at http://localhost:<PORT>, where <PORT> is the port number specified in your .env file or defaults to 5000.

Usage
Register User: POST /register

Creates a new user with a username and password.
Login User: POST /login

Authenticates a user and returns a JWT for subsequent requests.
Get User Profile: GET /profile

Retrieves the users profile information using JWT authentication.
Logout User: POST /logout

Clears the JWT cookie to logout the user.
Create Post: POST /post

Creates a new post with optional file upload for the cover image.
Update Post: PUT /post

Updates an existing post with optional file upload for the cover image.
Get All Posts: GET /post

Retrieves a list of all posts, sorted by creation date.
Get Single Post: GET /post/:id

Retrieves a single post by its ID.
Technologies Used
Express.js
MongoDB (Mongoose)
BcryptJS
JSON Web Tokens (JWT)
Multer
CORS
Contributing
Feel free to fork this repository, make changes, and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
This project was created based on educational purposes and practical applications of Node.js, Express, and MongoDB.
