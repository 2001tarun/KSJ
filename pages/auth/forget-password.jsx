import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email) {
        toast.error("Email field is required.");
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:4000/api/send-reset-password-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      console.log("response", data);

      if (data.success) {
        toast.success(data.message);
        setEmail('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error sending reset password link:', error);
      toast.error('Failed to send reset password link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-slate-700 text-center">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow md:mt-0 sm:max-w-md sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Change Password
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 lg:mt-5 md:space-y-5">
              <div className='text-left'>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5" placeholder="name@company.com" required />
              </div>
              <button type="submit" className="w-full text-white bg-slate-700 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5" disabled={loading}>
                {loading ? 'Sending...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
        <ToastContainer />
      </section>
    </>
  );
}
