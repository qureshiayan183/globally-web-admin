import { Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Layout from "./Components/Layout";
import Settings from "./Pages/Setting/SecuritySettings";
import NotFound from "./utils/NotFound";
import Login from "./Pages/Login/Login";
import PublicRoute from "./Route/PublicRoute";
import PrivateRoute from "./Route/PrivateRoute";
import Blogs from "./Pages/Blog/blog/Blogs";
import NewBlogForm from "./Pages/Blog/blog/components/NewBlogForm";
import BlogCategory from "./Pages/Blog/blog-category/BlogCategory";
import AddBlogCategory from "./Pages/Blog/blog-category/AddBlogCategory";
import Comment from "./Pages/Blog/blog_comment/Comment";
import ImageUrlGenerate from "./Pages/Image_Url_Generate/ImageUrlGenerate";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/auth/login" element={<Login />} />
      </Route>

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/settings/security" element={<Settings />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/create" element={<NewBlogForm />} />
          <Route path="/blogs/category" element={<BlogCategory />} />
          <Route path="/blogs/category/create" element={<AddBlogCategory />} />
          <Route path="/blogs/comments" element={<Comment />} />
          <Route path="/image-url-generater" element={<ImageUrlGenerate />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
