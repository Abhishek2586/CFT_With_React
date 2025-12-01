import React from 'react';
import ProfileSidebar from './ProfileSidebar';
import ProfileDashboard from './ProfileDashboard';

const ProfilePage = ({ user, onUpdateProfile }) => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Sidebar (Profile Info) - Takes 4 columns on medium+ screens */}
                <div className="md:col-span-4">
                    <ProfileSidebar user={user} onUpdateProfile={onUpdateProfile} />
                </div>

                {/* Right Dashboard (Charts & Stats) - Takes 8 columns on medium+ screens */}
                <div className="md:col-span-8">
                    <ProfileDashboard />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
