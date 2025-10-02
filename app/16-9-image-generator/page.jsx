export const metadata = {
  title: "16:9 Image Generator & Converter | NanoBanana",
  description: "Generate native 16:9 images or convert any photo to 16:9.",
};

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <iframe
        src="https://nano-banana-16-9-image-creator.vercel.app/"
        className="w-full h-[calc(100vh-4rem)] border-0"
        loading="eager"
        title="16:9 Image Generator"
      />
    </div>
  );
}

