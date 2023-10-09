/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../layout/mainlayout";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import {
    Avatar,
    Button,
    Dropdown,
    Label,
    TextInput,
    Textarea,
} from "flowbite-react";

const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const PostDetails = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [editCommentId, setEditCommentId] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [editedPost, setEditedPost] = useState({
        title: "",
        content: "",
        image: "",
    });
    const [isEditingCommentMode, setisEditingCommentMode] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // Track edit mode
    const loggedInUser = JSON.parse(localStorage.getItem("userInfo"));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/posts/${postId}`
                );
                console.log(response.data)
                setPost(response.data.data);
            } catch (error) {
                console.error("Error fetching post details:", error);
            }
        };
        fetchPostDetails();
    }, []);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/posts/${postId}`
                );
                setPost(response.data.data);
            } catch (error) {
                console.error("Error fetching post details:", error);
            }
        };

        const fetchPostComments = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/comment/${postId}`
                );
                setComments(response.data);
            } catch (error) {
                console.error("Error fetching post comments:", error);
            }
        };

        fetchPostDetails();
        fetchPostComments();
    }, [postId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("User not authenticated.");
                return;
            }

            if (editCommentId) {
                // Update the comment
                const response = await axios.put(
                    `http://localhost:5000/api/comment/${editCommentId}`,
                    {
                        text: editedCommentText,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Fetch updated comments for the post after updating a comment
                const commentsResponse = await axios.get(
                    `http://localhost:5000/api/comment/${postId}`
                );
                setComments(commentsResponse.data);

                // Clear the edit comment fields
                setisEditingCommentMode(false);
                setEditCommentId(null);
                setEditedCommentText("");
            } else {
                // Add a new comment
                const response = await axios.post(
                    `http://localhost:5000/api/comment/${postId}`,
                    {
                        text: commentText,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Fetch updated comments for the post after adding a comment
                const commentsResponse = await axios.get(
                    `http://localhost:5000/api/comment/${postId}`
                );
                setComments(commentsResponse.data);

                // Clear the comment text field
                setCommentText("");
            }
        } catch (error) {
            console.error("Error adding/updating comment:", error);
        } finally {
            setisEditingCommentMode(false);
        }
    };

    const handleEditComment = (comment) => {
        setisEditingCommentMode(true);
        setEditCommentId(comment._id);
        setEditedCommentText(comment.text);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("User not authenticated.");
                return;
            }

            await axios.delete(`http://localhost:5000/api/comment/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Fetch updated comments for the post after deleting a comment
            const commentsResponse = await axios.get(
                `http://localhost:5000/api/comment/${postId}`
            );
            setComments(commentsResponse.data);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleDeletePost = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("User not authenticated.");
                return;
            }

            await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate("/home");
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPost({
            ...editedPost,
            [name]: value,
        });
    };

    const handleEditPost = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("User not authenticated.");
                return;
            }

            const formData = new FormData();
            formData.append("title", editedPost.title);
            formData.append("content", editedPost.content);
            if (editedPost.image) {
                formData.append("file", editedPost.image);
            }

            const response = await axios.put(
                `http://localhost:5000/api/posts/${postId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setIsEditMode(false);
            setPost(response.data);
        } catch (error) {
            console.error("Error editing post:", error.response.data);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setEditedPost({ ...editedPost, image: file });

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
                    {post !== null ? (
                        <div>
                            <div key={post._id}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div
                                            style={{
                                                marginRight: "10px",
                                                borderRadius: "50%",
                                                overflow: "hidden",
                                                width: "50px",
                                                height: "50px",
                                            }}
                                        >
                                            <img
                                                src={`http://localhost:5000/assets/profile-pictures/${post.authorPicture}`}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                                alt="Profile"
                                            />
                                        </div>
                                        <div>
                                            <p
                                                style={{
                                                    fontWeight: "bold",
                                                    marginBottom: "5px",
                                                    fontSize: "1em",
                                                }}
                                            >
                                                {post.author}
                                            </p>
                                            <p style={{ fontSize: "0.8em", color: "#555" }}>
                                                Posted on: {formatDateTime(post.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {loggedInUser &&
                                        (console.log("Logged in user:", loggedInUser.username),
                                            console.log("Post author:", post.author),
                                            console.log("boolean",loggedInUser.username === post.author),
                                            loggedInUser.username === post.author ||
                                            loggedInUser.role === "Admin") && (
                                            <div>
                                                <Dropdown
                                                    placement="bottom"
                                                    renderTrigger={() => (
                                                        <MoreVertical className="opacity-70 cursor-pointer" />
                                                    )}
                                                >
                                                    <div
                                                        onClick={() => setIsEditMode(!isEditMode)}
                                                        className="cursor-pointer py-3 px-4 opacity-95 flex items-center gap-3 text-md"
                                                    >
                                                        <Edit
                                                            size={20}
                                                            className="opacity-80 text-[#0e7490]"
                                                        />{" "}
                                                        <span className="opacity-80">Edit Post</span>
                                                    </div>
                                                    <div
                                                        onClick={handleDeletePost}
                                                        className="cursor-pointer py-3 px-4 flex opacity-95 items-center gap-3 text-md"
                                                    >
                                                        <Trash2
                                                            size={20}
                                                            className="opacity-80 text-red-600 "
                                                        />{" "}
                                                        <span className="opacity-80">Delete Post</span>
                                                    </div>
                                                </Dropdown>
                                            </div>
                                        )}
                                </div>
                                <p
                                    className="my-3"
                                    style={{
                                        fontSize: "1.2em",
                                        marginBottom: "10px",
                                        color: "#555",
                                    }}
                                >
                                    {post.title}
                                </p>
                                {post.image && (
                                    <img
                                        style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            marginBottom: "10px",
                                            borderRadius: "10px",
                                        }}
                                        src={`http://localhost:5000/assets/post-images/${post.image}`}
                                        alt="Post Image"
                                    />
                                )}
                            </div>

                            {isEditMode && (
                                <div className="flex w-full flex-col gap-4">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="title1" value="Post title" />
                                        </div>
                                        <TextInput
                                            id="title1"
                                            placeholder="Enter post title"
                                            required
                                            name="title"
                                            value={editedPost.title || post.title}
                                            onChange={handleInputChange}
                                            type="text"
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
                                            value={editedPost.content || post.content}
                                            onChange={(e) =>
                                                setEditedPost({
                                                    ...editedPost,
                                                    content: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="mb-2 block">
                                        <Label htmlFor="content1" value="Select an Image" />
                                        <div className="mt-2">
                                            {imagePreview ? (
                                                <div>
                                                    <img
                                                        className="w-28 h-28 rounded-full"
                                                        src={`http://localhost:5000/assets/post-images/${imagePreview}`}
                                                        alt="Profile Preview"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <img
                                                        className="w-36 h-32 rounded-md"
                                                        src="https://www.trschools.com/templates/imgs/default_placeholder.png"
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

                                    <Button onClick={handleEditPost} type="button">
                                        Update Post
                                    </Button>

                                    <hr />
                                </div>
                            )}

                            <div className="my-4">
                                <p className="text-base font-semibold">Comments:</p>
                                <ul>
                                    {comments.length > 0 &&
                                        comments.map((comment) => (
                                            <li key={comment._id}>
                                                {isEditingCommentMode &&
                                                    editCommentId === comment._id ? (
                                                    <div className="flex flex-col gap-4 pt-2">
                                                        <Label>Edit comment : </Label>
                                                        <Textarea
                                                            rows={4}
                                                            className="resize-none"
                                                            value={editedCommentText}
                                                            onChange={(e) => {
                                                                setEditedCommentText(e.target.value);
                                                            }}
                                                            placeholder="Edit comment"
                                                        />
                                                        {isEditingCommentMode && (
                                                            <Button onClick={handleCommentSubmit}>
                                                                Edit
                                                            </Button>
                                                        )}
                                                        <hr />
                                                    </div>
                                                ) : (
                                                    <div className="pt-2 flex flex-col gap-4">
                                                        <div className="flex justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar
                                                                    img={`http://localhost:5000/assets/profile-pictures/${comment.authorPicture}`}
                                                                    alt="Author picture"
                                                                />
                                                                <div>{comment.author}</div>
                                                            </div>
                                                            {!isEditingCommentMode &&
                                                                loggedInUser &&
                                                                loggedInUser.username === comment.author._id && (
                                                                    <div>
                                                                        <Dropdown
                                                                            placement="bottom"
                                                                            renderTrigger={() => (
                                                                                <MoreVertical className="opacity-70 cursor-pointer" />
                                                                            )}
                                                                        >
                                                                            <div
                                                                                onClick={() =>
                                                                                    handleEditComment(comment)
                                                                                }
                                                                                className="cursor-pointer py-3 px-4 opacity-95 flex items-center gap-3 text-md"
                                                                            >
                                                                                <Edit
                                                                                    size={20}
                                                                                    className="opacity-80 text-[#0e7490]"
                                                                                />{" "}
                                                                                <span className="opacity-80">Edit</span>
                                                                            </div>
                                                                            {!isEditingCommentMode &&
                                                                                loggedInUser &&
                                                                                (loggedInUser.username === comment.author ||
                                                                                    loggedInUser.username === post.author ||
                                                                                    loggedInUser.role === "Admin") && (
                                                                                    <div
                                                                                        onClick={() =>
                                                                                            handleDeleteComment(comment._id)
                                                                                        }
                                                                                        className="cursor-pointer py-3 px-4 flex opacity-95 items-center gap-3 text-md"
                                                                                    >
                                                                                        <Trash2
                                                                                            size={20}
                                                                                            className="opacity-80 text-red-600 "
                                                                                        />{" "}
                                                                                        <span className="opacity-80">
                                                                                            Delete
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                        </Dropdown>
                                                                    </div>
                                                                )}
                                                        </div>
                                                        <div>{comment.text}</div>
                                                    </div>
                                                )}
                                                {<div className="comment-buttons">
                                                    {!isEditingCommentMode && loggedInUser && loggedInUser.username === comment.author && (
                                                        <button onClick={() => handleEditComment(comment)}>Edit</button>
                                                    )}
                                                    {!isEditingCommentMode && loggedInUser && (loggedInUser.username === comment.author || loggedInUser.username === post.author || loggedInUser.role === "Admin") && (
                                                        <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                                                    )}
                                                    {isEditingCommentMode && <button onClick={handleCommentSubmit}>OK</button>}
                                                </div>}
                                            </li>
                                        ))}
                                </ul>
                            </div>

                            <form
                                onSubmit={handleCommentSubmit}
                                className="w-full flex flex-col gap-4"
                            >
                                <Textarea
                                    rows={4}
                                    className="resize-none"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment"
                                />
                                <Button type="submit">Add Comment</Button>
                            </form>
                        </div>
                    ) : (
                        <p>Loading post details...</p>
                    )}
                </div>
            </Layout>
        </div>
    );
};

export default PostDetails;