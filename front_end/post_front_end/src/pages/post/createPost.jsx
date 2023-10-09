/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/mainlayout";
import { Button, Label, TextInput, Textarea } from "flowbite-react";

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  const handleAddPost = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("file", image);
      }

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("User not authenticated.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/user-posts");
    } catch (error) {
      console.error(
        "Error adding post:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Layout>
        <div className="shadow-lg rounded-2xl p-4 flex flex-col gap-[10px] border-2 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg text-[#0e7490e0]">
              Create new Post
            </h2>
          </div>

          <form
            onSubmit={handleAddPost}
            className=" flex w-full flex-col gap-4"
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title1" value="Post title" />
              </div>
              <TextInput
                id="title1"
                placeholder="Enter post title"
                required
                type="text"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="content1" value="Post content" />
              </div>
              <Textarea
                rows={4}
                className="resize-none"
                id="content1"
                placeholder="Enter post content"
                required
                type="text"
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="mb-2 block">
              <Label htmlFor="content1" value="Select an Image" />
              <div className="mt-2">
                {imagePreview ? (
                  <div>
                    <img
                      className="w-28 h-28 rounded-full"
                      src={imagePreview}
                      alt="Profile Preview"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      className="w-36 h-32 rounded-md"
                      src="https://www.trschools.com/templates/imgs/default_placeholder.png" // Replace with a random image URL
                      alt="Profile Preview"
                    />
                    <input
                      className="absolute w-36 h-32 top-0 opacity-0"
                      type="file"
                      accept="image/*"
                      id="image"
                      onChange={handleImageUpload}
                    />
                  </div>
                )}
              </div>
            </div>

            <Button type="submit">Create</Button>
          </form>
        </div>
      </Layout>
    </div>
  );
};

export default AddPost;