import React, { useState } from 'react';
import EditProfileModal from './EditProfileModal';

const ProfileSidebar = ({ user, onUpdateProfile }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                <div className="w-28 h-28 mx-auto mb-4 relative">
                    <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center border-4 border-teal-100 shadow-[0_0_15px_rgba(20,184,166,0.3)] overflow-hidden">
                        {/* Font Awesome Leaf Icon */}
                        <i className="fas fa-leaf text-5xl text-teal-500 opacity-90"></i>
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                    {user?.profile?.first_name && user?.profile?.last_name
                        ? `${user.profile.first_name} ${user.profile.last_name}`
                        : user?.username || 'User'}
                </h2>
                <p className="text-gray-500 text-sm mb-6">@{user?.username?.toLowerCase() || 'user'}</p>

                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full bg-teal-500 text-white py-2 rounded-lg font-semibold hover:bg-teal-600 transition-colors mb-6 flex items-center justify-center gap-2 shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                </button>

                <div className="space-y-3 text-left text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{user?.email || 'email@example.com'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{user?.profile?.phone_no || 'Add phone number'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{user?.profile?.city ? `${user.profile.city}, ${user.profile.state}` : 'Add location'}</span>
                    </div>
                </div>
            </div>

            {/* Monthly Carbon Budget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Carbon Budget</h3>
                <p className="text-sm text-gray-600 mb-2">
                    You have used <span className="font-bold text-gray-900">0 kg</span> of your <span className="font-bold text-gray-900">500.0 kg</span> allowance.
                </p>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-teal-500 h-3 rounded-full" style={{ width: '0%' }}></div>
                </div>
            </div>

            {/* Actionable Insights */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Actionable Insights
                </h3>
                <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                        <svg className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <p className="text-sm text-gray-600">Switching one car trip to public transit could save ~15kg CO₂e.</p>
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Achievements
                </h3>
                <div className="flex gap-3 items-start">
                    <div className="text-yellow-400">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 text-sm">Welcome!</h4>
                        <p className="text-xs text-gray-500">Start logging activities to earn your first badge.</p>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
                onUpdate={onUpdateProfile}
            />
        </div>
    );
};

export default ProfileSidebar;
