import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId };
    }),

    // Video FileRoute
    videoUploader: f({ video: { maxFileSize: "64MB" } })
      .middleware(async ({ req }) => {
        const user = await auth(req);
        if (!user) throw new UploadThingError("Unauthorized");
        return { userId: user.id };
      })
      .onUploadComplete(async ({ metadata, file }) => {
        return { uploadedBy: metadata.userId };
      }),

    // Audio FileRoute
    audioUploader: f({ audio: { maxFileSize: "16MB" } })
      .middleware(async ({ req }) => {
        const user = await auth(req);
        if (!user) throw new UploadThingError("Unauthorized");
        return { userId: user.id };
      })
      .onUploadComplete(async ({ metadata, file }) => {
        return { uploadedBy: metadata.userId };
      }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
