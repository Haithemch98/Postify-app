import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Button,
    Checkbox,
    Label,
    TextInput,
} from 'flowbite-react';
import background from "../../images/background.png";

const API_BASE_URL = 'http://localhost:5000/api/auth';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('SimpleUser');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');

    const history = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('role', role);
            formData.append('file', image);

            const response = await axios.post(`${API_BASE_URL}/signup`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                const { token, information } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('userInfo', JSON.stringify(information));

                history('/home');
            } else {
                setError('Signup failed. Please try again.');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error);
            } else {
                setError('An error occurred during signup.');
            }
        }
    };
    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(selectedImage);
    };

    return (
        <div className="flex w-full h-screen">
            <div className="hidden w-1/2 lg:flex bg-[#0e7490] items-center justify-center">
                <img src={background} alt="Postify background" width={500} height={500} />
            </div>
            <div className="w-1/2 flex items-center justify-center">
                <form onSubmit={handleSignup} className="flex w-1/2 flex-col gap-4">
                    <div className='mb-6 text-3xl font-semibold'>
                        Create an account
                    </div>
                    <div className='mb-2 block mx-auto'>
                        {imagePreview ? (
                            <div
                            >
                                <img
                                    className='w-28 h-28 rounded-full'
                                    src={imagePreview}
                                    alt="Profile Preview"
                                />
                            </div>
                        ) : (
                            <div className='relative'>
                                <img
                                    className='w-28 h-28 rounded-full'
                                    src="https://camo.githubusercontent.com/c6fe2c13c27fe87ac6581b9fe289d2f071bd1b4ef6f3e3c5fc2aba0bbc23fd88/68747470733a2f2f75706c6f61642e77696b696d656469612e6f72672f77696b6970656469612f636f6d6d6f6e732f372f37632f50726f66696c655f6176617461725f706c616365686f6c6465725f6c617267652e706e67"  // Replace with a random image URL
                                    alt="Profile Preview"
                                />
                                <input className='absolute w-full h-full top-0 opacity-0'
                                    type="file"
                                    accept="image/*"
                                    id="image"
                                    onChange={handleImageChange}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="username1"
                                value="Your username"
                            />
                        </div>
                        <TextInput
                            id="username1"
                            placeholder="Enter your username"
                            required
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="email1"
                                value="Your email"
                            />
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
                            <Label
                                htmlFor="password1"
                                value="Your password"
                            />
                        </div>
                        <TextInput
                            id="password1"
                            required
                            placeholder='********'
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className='flex justify-end'>
                            <p className='text-[#0e7490] underline'> <Link to="#">Forget Password ?</Link>
                            </p>
                        </div>
                    </div>


                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="role1"
                                value="Your Role"
                            />
                            <div className='flex items-center gap-6 my-3'>
                                <div className='flex items-center gap-2'>
                                    <Checkbox name='role' value="Admin" onChange={((e) => setRole(e.target.value))} />
                                    <Label
                                        className="flex"
                                        htmlFor="agree"
                                    >
                                        Admin
                                    </Label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Checkbox name='role' value="SimpleUser" onChange={((e) => setRole(e.target.value))} />
                                    <Label
                                        className="flex"
                                        htmlFor="agree"
                                    >
                                        Simple User
                                    </Label>
                                </div>
                            </div>
                        </div>

                    </div>
                    {error && <div className='text-red-500 font-semibold tracking-wide text-sm'>{error}</div>}
                    <Button type="submit">
                        Create account
                    </Button>
                    <div className='mx-auto'>
                        <p>Already have an account <span className='text-[#0e7490] underline cursor-pointer'><Link to="/">Login</Link></span></p>
                    </div>
                </form>
            </div >

        </div >
    );

};

export default Signup;

