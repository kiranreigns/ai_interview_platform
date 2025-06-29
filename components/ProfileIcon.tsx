"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  uploadProfilePhoto,
  removeProfilePhoto,
} from "@/lib/actions/profile.action";
import { signOut } from "@/lib/actions/auth.action";

const ProfileIcon = ({ user }: ProfileIconProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a JPEG, PNG, or WebP image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadProfilePhoto(file, user.id);
      if (result.success) {
        toast.success("Profile photo updated successfully");
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to upload photo");
      }
    } catch (error: any) {
      toast.error("Failed to upload photo", error);
    } finally {
      setIsUploading(false);
      setIsOpen(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user.profileURL) return;

    try {
      const result = await removeProfilePhoto(user.id);
      if (result.success) {
        toast.success("Profile photo removed");
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to remove photo");
      }
    } catch (error: any) {
      toast.error("Failed to remove photo", error);
    } finally {
      setIsOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/sign-in";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer relative w-11 h-11 rounded-full overflow-hidden"
      >
        <Image
          src={user.profileURL || "/user-avatar.png"}
          alt="Profile"
          fill
          className="object-cover"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-74 dark-gradient border border-dark-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-dark-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={user.profileURL || "/user-avatar.png"}
                  alt="Profile"
                  width={48}
                  height={48}
                  className=" object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-dark-200 rounded transition-colors disabled:opacity-50"
            >
              {isUploading
                ? "Uploading..."
                : user.profileURL
                ? "Change Photo"
                : "Upload Photo"}
            </button>

            {user.profileURL && (
              <button
                onClick={handleRemovePhoto}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-dark-200 rounded transition-colors"
              >
                Remove Photo
              </button>
            )}

            <hr className="my-2 border-dark-200" />

            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-dark-200 rounded transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ProfileIcon;
