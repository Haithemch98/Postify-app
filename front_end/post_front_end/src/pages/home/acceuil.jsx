import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/mainlayout";

const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const Home = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/posts');
                console.log(response.data);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    return (
        <div>
            <Layout>
                {posts.map((post) => (
                    <div
                        key={post._id}
                        onClick={() => handlePostClick(post._id)}
                        className="cursor-pointer"
                    >
                        <div
                            key={post._id}
                            className="shadow-lg rounded-2xl p-4  border-2 bg-white"
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "10px",
                                }}
                            >
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
                                            color: "#555",
                                        }}
                                    >
                                        {post.author}
                                    </p>
                                    <p style={{ fontSize: "0.8em", color: "#555" }}>
                                        Posted on: {formatDateTime(post.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <p
                                style={{
                                    fontSize: "1.2em",
                                    marginBottom: "10px",
                                    color: "#555",
                                }}
                            >
                                {post.title}
                            </p>
                            {post.content && (
                                <p style={{ marginBottom: "10px", color: "#555" }}>
                                    {post.content}
                                </p>
                            )}
                            {post.image && (
                                <img
                                    className="rounded-lg w-full block mb-3"
                                    src={`http://localhost:5000/assets/post-images/${post.image}`}
                                    alt="Post Image"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </Layout>
        </div>
    );
};

export default Home;