/* eslint-disable react/prop-types */
import Navbar from "../components/navbar";

const Layout = ({ children }) => {
    return (
        <div className="w-full min-h-screen bg-slate-100 p-4">
            <Navbar />
            <div className="w-[40%] mx-auto py-6">{children}</div>
        </div>
    );
};

export default Layout;