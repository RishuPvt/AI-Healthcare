import axios from "axios";
import { useEffect, useState } from "react";
import { FaCamera, FaPowerOff, FaUser } from "react-icons/fa";
import { backendUrl } from "../APi/Backend";
import { useNavigate } from "react-router-dom";

interface User {
  fullName: string;
  avatar?: string;
  phoneNumber: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${backendUrl}/getCurrentUser`, {
          withCredentials: true,
        });
        setUser(response.data.data);
       // console.log("res data",response.data.data);
      } catch (error: any) {
        setError(error.response?.data?.message || "Please log in");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.patch(
        `${backendUrl}/updateUserAvatar`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser((prev) =>
        prev ? { ...prev, avatar: response.data.avatar } : null
      );
    } catch (error) {
      setError("Failed to update avatar. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      setError("Logout failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  console.log(user);
  

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error || "User not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
          <h1 className="text-2xl font-bold text-white">Profile Overview</h1>
        </div>

        {/* Profile Content */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              <div
                className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden 
                shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <FaUser className="w-16 h-16 text-gray-400" />
                )}

                {/* Upload Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {/* Avatar Upload Button */}
              <label
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer
                transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <div className="relative">
                  <FaCamera className="w-5 h-5 text-blue-600" />
                  {isUploading && (
                    <div className="absolute inset-0 bg-blue-100 rounded-full opacity-50"></div>
                  )}
                </div>
              </label>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-3 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">
                {user.fullName}
              </h2>
              <div className="text-gray-600">
                <p className="text-sm font-medium">Phone Number</p>
                <p className="text-gray-500 text-sm mt-1">{user.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

         
          <div className="mt-8 flex justify-end">
             {/* Deatils Button */}
          <button
              className="flex items-center gap-2 px-6 py-2.5 bg-yellow-600 text-white rounded-lg
                hover:bg-red-700 transition-colors duration-300 shadow-sm hover:shadow-md mr-[10px]"
            >
              {/* <FaPowerOff className="w-4 h-4" /> */}
              <span className="text-sm font-medium">Update Details</span>
            </button>
             {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg
                hover:bg-red-700 transition-colors duration-300 shadow-sm hover:shadow-md"
            >
              <FaPowerOff className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
            
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
