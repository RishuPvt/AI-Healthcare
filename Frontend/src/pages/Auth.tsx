import { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../APi/Backend'; 
import { useNavigate } from "react-router-dom";
interface FormData {
  fullName: string;
  phoneNumber: string;
  password: string;
}

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [apiError, setApiError] = useState('');
const navigate = useNavigate()



const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    setLoading(true);
 

    try {
      const url = isLogin 
        ? `${backendUrl}/login`
        : `${backendUrl}/RegisterUser`;

      const response = await axios.post(url, {
        ...formData,

      }, {
        withCredentials: true
      });

      // Handle successful authentication
      console.log('Auth successful:', response.data.data);
      // Redirect user or update app state here
      if (response.status === 200){
        navigate("/")
      }
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {isLogin 
              ? "Don't have an account? Sign Up" 
              : "Already have an account? Login"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                disabled={loading}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                maxLength={10}
                className={`flex-1 block w-full rounded-none rounded-r-md border ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                } focus:border-blue-500 focus:ring-blue-500`}
                disabled={loading}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
              disabled={loading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {apiError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              isLogin ? 'Login' : 'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;