import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    studentId: "STU2024001",
    class: "Class 10-A",
    rollNumber: "42",
    phone: "+1 234 567 8900",
    address: "123 Education Street, Learning City",
    joinDate: "2023-09-01",
  });

  const [formData, setFormData] = useState(profileData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData(formData);
    setIsEditing(false);
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Personal Information
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {profileData.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {profileData.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {profileData.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {profileData.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Academic Information
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Student ID
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {profileData.studentId}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Class
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {profileData.class}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Roll Number
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {profileData.rollNumber}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Join Date
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {profileData.joinDate}
                      </p>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
