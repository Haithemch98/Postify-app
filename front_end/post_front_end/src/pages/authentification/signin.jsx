/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";

import background from "../../images/background.png";

const API_BASE_URL = "http://localhost:5000/api/auth";

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const history = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email,
                password,
            });
            if (response.status == 200) {
                const { token, information } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("userInfo", JSON.stringify(information));
                history("/home");
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error);
            } else {
                setError("An error occurred during signup.");
            }
        }
    };

    return (
        <div className="flex w-full h-screen">
            <div className="hidden w-1/2 lg:flex bg-[#0e7490] items-center justify-center">
                <img
                    src={background}
                    alt="Postify background"
                    width={500}
                    height={500}
                />
            </div>
            <div className="w-1/2 flex items-center justify-center">
                <form onSubmit={handleLogin} className="flex w-1/2 flex-col gap-4">
                    <div className="mb-6 text-3xl font-semibold">Welcome to Postify</div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email1" value="Your email" />
                        </div>
                        <TextInput
                            id="email1"
                            placeholder="Enter your email"
                            required
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password1" value="Your password" />
                        </div>
                        <TextInput
                            id="password1"
                            required
                            placeholder="********"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>
                    {error && (
                        <div className="text-red-500 font-semibold tracking-wide text-sm">
                            {error}
                        </div>
                    )}
                    <Button type="submit">Log In</Button>
                    <div className="mx-auto">
                        <p>
                            Don't have an account{" "}
                            <span className="text-[#0e7490] underline cursor-pointer">
                                <Link to="/signup">Sign Up</Link>
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signin;