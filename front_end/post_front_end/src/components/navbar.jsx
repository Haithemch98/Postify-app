import { Home, LogOut, Pencil } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "flowbite-react";
import { useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";

const Navbar = () => {
    const { pathname } = useLocation();
    const [userImage, setUserImage] = useState(null);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("userInfo"));
        if (loggedInUser) {
            setUserImage(loggedInUser.picture);
            setUserName(loggedInUser.username);
        }
    }, []);

    const navigate = useNavigate();

    return (
        <div className="w-full h-20 shadow-md bg-white rounded-lg flex items-center justify-between px-10">
            <div className="text-2xl text-[#0e7490] font-semibold">Postify</div>
            <div className="flex items-center gap-10">
                <Link to="/home">
                    <div
                        className={`flex text-[#0e7490] font-medium text-sm items-center gap-2 ${pathname.includes("home")
                                ? "py-3 px-8 rounded-lg bg-[#0e7490e0] text-white  duration-300"
                                : ""
                            } cursor-pointer `}
                    >
                        <Home />
                        Home
                    </div>
                </Link>
                <Link to="/user-posts">
                    <div
                        className={`flex text-[#0e7490] font-medium text-sm items-center gap-2 ${pathname.includes("post")
                                ? "py-3 px-8 rounded-lg bg-[#0e7490e0] text-white  duration-300"
                                : ""
                            } cursor-pointer `}
                    >
                        {" "}
                        <Pencil />
                        My Posts
                    </div>
                </Link>
            </div>
            <div className="flex items-center gap-6">
                <Avatar
                    img={`http://localhost:5000/assets/profile-pictures/${userImage}`}
                    rounded
                />
                <Dropdown inline label={userName}>
                    <div
                        onClick={() => navigate("/")}
                        className="py-3 px-4 flex items-center gap-3 text-md opacity-70 cursor-pointer"
                    >
                        <LogOut size={20} />
                        Sign out
                    </div>
                </Dropdown>
            </div>
        </div>
    );
};

export default Navbar;
// 0e7490