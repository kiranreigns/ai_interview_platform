"use server";

import ImageKit from "imagekit";
import { db } from "@/firebase/admin";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function uploadProfilePhoto(file: File, userId: string) {
  try {
    // Get current user data to check for existing photo
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();

    // Delete old photo if exists
    if (userData?.profileURL) {
      try {
        const fileId = userData.profileURL.split('/').pop()?.split('?')[0];
        if (fileId) {
          await imagekit.deleteFile(fileId);
        }
      } catch (error) {
        console.log("Error deleting old photo:", error);
      }
    }

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload new photo to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: `profile_${userId}_${Date.now()}`,
      folder: "/profiles",
    });

    // Update user document with new profile URL
    await db.collection("users").doc(userId).update({
      profileURL: uploadResponse.url,
    });

    return {
      success: true,
      profileURL: uploadResponse.url,
    };
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    return {
      success: false,
      message: "Failed to upload profile photo",
    };
  }
}

export async function removeProfilePhoto(userId: string) {
  try {
    // Get current user data
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();

    if (userData?.profileURL) {
      // Delete photo from ImageKit
      try {
        const fileId = userData.profileURL.split('/').pop()?.split('?')[0];
        if (fileId) {
          await imagekit.deleteFile(fileId);
        }
      } catch (error) {
        console.log("Error deleting photo from ImageKit:", error);
      }

      // Remove profileURL from user document
      await db.collection("users").doc(userId).update({
        profileURL: null,
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error removing profile photo:", error);
    return {
      success: false,
      message: "Failed to remove profile photo",
    };
  }
}