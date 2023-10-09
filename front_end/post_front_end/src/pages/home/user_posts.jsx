import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layout/mainlayout";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const UserPosts = () => {
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("User not authenticated.");
                    return;
                }

                const response = await axios.get(
                    "http://localhost:5000/api/user/my-posts",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setUserPosts(response.data);
            } catch (error) {
                console.error("Error fetching user posts:", error);
            }
        };

        fetchUserPosts();
    }, []);

    const navigate = useNavigate();

    return (
        <div>
            <Layout>
                <div className="shadow-lg rounded-2xl p-4  border-2 bg-white">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-lg text-[#0e7490e0]">
                            Your Posts
                        </h2>

                        <div
                            onClick={() => navigate("/create-post")}
                            className={`flex font-medium text-sm items-center gap-2 p-3 tracking-wider rounded-lg bg-[#0e7490e0] text-white cursor-pointer `}
                        >
                            {" "}
                            <Plus />
                            Create Post{" "}
                        </div>
                    </div>
                    {userPosts.length > 0 && (
                        <div className="mt-6">
                            {userPosts.map((post) => (
                                <div
                                    onClick={() => navigate(`/post/${post._id}`)}
                                    className="cursor-pointer"
                                    key={post._id}
                                    style={{
                                        border: "1px solid #ccc",
                                        borderRadius: "10px",
                                        padding: "20px",
                                        marginBottom: "20px",
                                        backgroundColor: "white",
                                    }}
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
                            ))}
                        </div>
                    )}

                    {userPosts.length == 0 && (
                        <div className="py-12 w-full flex justify-center items-centers">
                            <p className="opacity-70 text-md tracking-wide">
                                No posts found...
                            </p>
                        </div>
                    )}
                </div>
            </Layout>
        </div>
    );
};

export default UserPosts;