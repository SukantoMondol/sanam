import ImageComponent from "@/components/UI/Cards/ImageComponent";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import ReactImageMagnify from "react-image-magnify";

function getSafeImageUrl(url) {
  if (!url) return "/assets/images/defaultImage.png";
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    return url.replace(/127\.0\.0\.1|localhost/, hostname);
  }
  return url;
}

const ProductImageSlider = ({
  selectedImage,
  setSelectedImage,
  productDetailsData,
}) => {
  const [error, setError] = useState(false);

  const photos = productDetailsData?.product?.photos || [];

  const currentIndex = photos.findIndex(
    (p) =>
      String(p?.id) === String(selectedImage?.id) ||
      p?.photo_full === selectedImage?.photo_full
  );

  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  const goToNextImage = () => {
    if (photos.length <= 1) return;
    const nextIdx = (safeIndex + 1) % photos.length;
    setSelectedImage(photos[nextIdx]);
    setError(false);
  };

  const goToPreviousImage = () => {
    if (photos.length <= 1) return;
    const prevIdx = (safeIndex - 1 + photos.length) % photos.length;
    setSelectedImage(photos[prevIdx]);
    setError(false);
  };

  useEffect(() => {
    setError(false);
  }, [selectedImage]);

  const activePhotoUrl = getSafeImageUrl(
    selectedImage?.photo_full || selectedImage?.photo_thumb || selectedImage?.photo
  );

  return (
    <div className="productImageSliderWrapper z-1">
      <div className="d-flex flex-xl-row flex-column flex-xl-row-reverse gap-xl-2 gap-4">
        {/* Main Image */}
        <div className="w-full position-relative">
          {photos.length > 1 && (
            <button
              onClick={goToPreviousImage}
              className="position-absolute top-50 start-0 translate-middle-y bg-white rounded-circle p-2 shadow-sm border-purple z-1"
              aria-label="previous image"
              type="button"
              style={{ cursor: "pointer" }}
            >
              <ChevronLeft className="text-purple" size={24} />
            </button>
          )}

          <div className="mainImage" key={activePhotoUrl}>
            <ReactImageMagnify
              key={activePhotoUrl}
              {...{
                smallImage: {
                  alt: selectedImage?.alt_text || productDetailsData?.product?.name || "Product Image",
                  isFluidWidth: true,
                  src: error ? "/assets/images/defaultImage.png" : activePhotoUrl,
                  onError: () => setError(true),
                  loading: "eager",
                  fetchPriority: "high",
                  sizes: "(max-width: 768px) 100vw, 388px",
                },
                largeImage: {
                  width: 1600,
                  height: 1600,
                  alt: selectedImage?.alt_text || productDetailsData?.product?.name || "Product Image",
                  src: error ? "/assets/images/defaultImage.png" : activePhotoUrl,
                  onError: () => setError(true),
                },
                enlargedImagePosition: "beside",
              }}
            />
          </div>

          {photos.length > 1 && (
            <button
              onClick={goToNextImage}
              aria-label="next image"
              className="position-absolute top-50 end-0 translate-middle-y bg-white rounded-circle p-2 shadow-sm border border-purple z-1"
              type="button"
              style={{ cursor: "pointer" }}
            >
              <ChevronRight className="text-purple" size={24} />
            </button>
          )}
        </div>

        {/* Thumbnails */}
        <div className="thumbnailsWrapper">
          {photos.map((photo, index) => {
            const isSelected =
              String(photo?.id) === String(selectedImage?.id) ||
              safeIndex === index;
            const thumbUrl = getSafeImageUrl(photo?.photo_thumb || photo?.photo_full);

            return (
              <div
                key={photo?.id || index}
                className={`border rounded cursor-pointer p-1 ${
                  isSelected ? "border-purple" : ""
                }`}
                onClick={() => {
                  setSelectedImage(photo);
                  setError(false);
                }}
                style={{ cursor: "pointer" }}
              >
                <ImageComponent
                  src={thumbUrl}
                  alt={photo?.alt_text || "Thumbnail"}
                  width={70}
                  height={70}
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductImageSlider;
