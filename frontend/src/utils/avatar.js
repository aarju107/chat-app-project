export const getAvatarUrl = (user) => {
  if (!user) return '/avatars/neutral.svg';
  const savedPhoto = user.profilePhoto || '';
  if (savedPhoto && !savedPhoto.includes('api.dicebear.com/9.x/avataaars')) return savedPhoto;
  if (user.gender === 'female') return '/avatars/female.svg';
  if (user.gender === 'male') return '/avatars/male.svg';
  return '/avatars/neutral.svg';
};
