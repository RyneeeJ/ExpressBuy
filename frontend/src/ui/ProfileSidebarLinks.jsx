import SidebarNavLinks from "./SidebarNavLinks";

const links = [
  { label: "Profile Details", path: "/profile", end: true },
  { label: "Addresses", path: "/profile/addresses" },
  { label: "Order History", path: "/profile/orders" },
  { label: "Wishlist", path: "/profile/wishlist" },
  { label: "Change Password", path: "/profile/change-password" },
];

const ProfileSidebarLinks = () => {
  return <SidebarNavLinks links={links} isProfilePage={true} />;
};

export default ProfileSidebarLinks;
