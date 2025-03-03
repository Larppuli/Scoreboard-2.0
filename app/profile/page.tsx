"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Stack, LoadingOverlay, Text } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { CldImage } from "next-cloudinary";
import { useAppContext } from "@/app/lib/AppContext";
import ImageUpload from "@/components/ImageUpload/ImageUpload";

export default function Page() {
  const router = useRouter();
  const { user, loading, clearContext } = useAppContext();
  const [currentImagePublicId, setCurrentImagePublicId] = useState<
    string | null
  >(null);
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const defaultImage = "DefaultPFP";
  const userImageBase = user?._id
    ? `profilepictures/profile_picture_${user._id}`
    : null;

  const fetchImage = useCallback(async () => {
    setImageLoading(true);
    if (!userImageBase) {
      setCurrentImagePublicId(defaultImage);
      setImageLoading(false);
      return;
    }

    try {
      const timestamp = new Date().getTime();
      const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/v${timestamp}/${userImageBase}`;

      const response = await fetch(imageUrl, { cache: "no-store" });

      if (response.ok) {
        setCurrentImagePublicId(userImageBase);
      } else {
        setCurrentImagePublicId(defaultImage);
      }
    } catch (error) {
      console.error("Error checking image existence:", error);
      setCurrentImagePublicId(defaultImage);
    } finally {
      setImageLoading(false);
    }
  }, [userImageBase, cloudName]);

  useEffect(() => {
    if (user?._id) {
      fetchImage();
    }
  }, [user, fetchImage]);

  const handleImageUpload = (newImageUrl: string) => {
    setImageLoading(true);
    setCurrentImagePublicId(newImageUrl);
    setImageLoading(false);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      router.push("/login");
      clearContext();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Stack>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ color: "black", radius: "sm", blur: 4 }}
        loaderProps={{ color: "red", type: "bars" }}
      />
      <Stack align="flex-end">
        <Button
          onClick={handleLogout}
          c={"#9c9c9c"}
          w={"130px"}
          variant="subtle"
          size="md"
          rightSection={<IconLogout />}
        >
          Logout
        </Button>
      </Stack>

      <Stack align="center">
        <div style={{ position: "relative", width: 150, height: 150 }}>
          {imageLoading ? (
            <LoadingOverlay
              visible
              zIndex={10}
              overlayProps={{ radius: "50%", color: "gray", blur: 2 }}
              loaderProps={{ color: "blue", type: "dots" }}
            />
          ) : (
            currentImagePublicId && (
              <CldImage
                width="150"
                height="150"
                src={`https://res.cloudinary.com/dles09a71/image/upload/v${new Date().getTime()}/${currentImagePublicId}`}
                alt="Profile Picture"
                priority
                onLoad={() => setImageLoading(false)}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            )
          )}
        </div>

        <ImageUpload
          setSelectedImage={handleImageUpload}
          setLoading={setImageLoading}
        />
        <Text mt={"-10px"} size="35px" fw={"bold"} c={"white"}>
          {user?.userName}
        </Text>
      </Stack>
    </Stack>
  );
}
