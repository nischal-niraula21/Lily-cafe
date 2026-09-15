import "dotenv/config";
import { setServers } from "node:dns";
import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import GalleryImage from "../models/GalleryImage.js";

setServers(["8.8.8.8", "1.1.1.1"]);

const folder =
    process.env.CLOUDINARY_FOLDER || "lily-cafe/gallery";

async function getCloudinaryImages() {
    const images = [];
    let nextCursor;

    do {
        let result;

        if (
            typeof cloudinary.api.resources_by_asset_folder === "function"
        ) {
            result =
                await cloudinary.api.resources_by_asset_folder(
                    folder,
                    {
                        resource_type: "image",
                        type: "upload",
                        max_results: 100,
                        next_cursor: nextCursor,
                    }
                );
        } else {
            result = await cloudinary.api.resources({
                resource_type: "image",
                type: "upload",
                prefix: `${folder}/`,
                max_results: 100,
                next_cursor: nextCursor,
            });
        }

        images.push(...(result.resources || []));
        nextCursor = result.next_cursor;
    } while (nextCursor);

    return images;
}

async function syncGallery() {
    try {
        await connectDB();

        const resources = await getCloudinaryImages();

        console.log(
            `Found ${resources.length} images in ${folder}`
        );

        if (!resources.length) {
            console.log(
                "No images found in Cloudinary."
            );
            return;
        }

        for (let i = 0; i < resources.length; i++) {
            const image = resources[i];

            await GalleryImage.findOneAndUpdate(
                { publicId: image.public_id },
                {
                    publicId: image.public_id,
                    url: image.secure_url,
                    alt: "Lily Cafe & Restaurant",
                    sortOrder: i + 1,
                    isActive: true,
                },
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true,
                }
            );

            console.log(
                `Synced ${i + 1}/${resources.length}`
            );
        }

        console.log(
            "Gallery successfully synced."
        );
    } catch (error) {
        console.error(
            "Gallery sync failed:",
            error
        );
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

syncGallery();