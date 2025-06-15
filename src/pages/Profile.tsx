
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import BottomNavigation from '../components/BottomNavigation';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileMenuItem from '../components/profile/ProfileMenuItem';
import LogoutButton from '../components/profile/LogoutButton';
import LoginPrompt from '../components/profile/LoginPrompt';
import { profileMenuItems } from '../data/profileMenuItems';

const Profile = () => {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // If user is not logged in, show login prompt
  if (!user) {
    return <LoginPrompt />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <ProfileHeader user={user} profile={profile} />
      <ProfileStats />

      {/* Menu Items */}
      <div className="px-4 space-y-3">
        {profileMenuItems.map((item, index) => (
          <ProfileMenuItem
            key={index}
            icon={item.icon}
            label={item.label}
            description={item.description}
            color={item.color}
            path={item.path}
          />
        ))}

        <LogoutButton onSignOut={handleSignOut} />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
