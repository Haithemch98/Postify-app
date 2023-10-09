import { BrowserRouter, Routes, Route } from "react-router-dom"

import Signin from "./pages/authentification/signin"
import Signup from "./pages/authentification/signup"
import Home from "./pages/home/acceuil"
import UserPosts from "./pages/home/user_posts"
import AddPost from "./pages/post/createPost"
import PostDetails from "./pages/post/postDetails"
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user-posts" element={<UserPosts />} />
        <Route path="/create-post" element={<AddPost />} />
        <Route path="/post/:postId" element={<PostDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App