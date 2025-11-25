import { useEffect, useState } from "react";

export default function ModalImageGallery({ images, initialIndex = 0, onClose }) {
    const [index, setIndex] = useState(initialIndex);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!images || images.length === 0) return null;

    const current = images[index];
    const hasMultiple = images.length > 1;

    const goPrev = (e) => {
        e.stopPropagation();
        setIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goNext = (e) => {
        e.stopPropagation();
        setIndex((prev) => (prev + 1) % images.length);
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                animation: "fadeIn 0.2s ease-out"
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "relative",
                    background: "white",
                    padding: 16,
                    borderRadius: 12,
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "zoomIn 0.2s ease-out"
                }}
            >
                <img
                    src={current.src}
                    alt={current.alt || ""}
                    style={{
                        maxWidth: "80vw",
                        maxHeight: "80vh",
                        objectFit: "contain",
                    }}
                />

                {hasMultiple && (
                    <>
                        {/* левая стрелка */}
                        <button
                            onClick={goPrev}
                            style={{
                                position: "absolute",
                                left: 8,
                                top: "50%",
                                transform: "translateY(-50%)",
                                border: "none",
                                borderRadius: "999px",
                                padding: "6px 10px",
                                background: "rgba(0,0,0,0.6)",
                                color: "white",
                                fontSize: 20,
                                cursor: "pointer"
                            }}
                        >
                            ‹
                        </button>

                        {/* правая стрелка */}
                        <button
                            onClick={goNext}
                            style={{
                                position: "absolute",
                                right: 8,
                                top: "50%",
                                transform: "translateY(-50%)",
                                border: "none",
                                borderRadius: "999px",
                                padding: "6px 10px",
                                background: "rgba(0,0,0,0.6)",
                                color: "white",
                                fontSize: 20,
                                cursor: "pointer"
                            }}
                        >
                            ›
                        </button>

                        {/* счётчик страниц */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: 8,
                                left: "50%",
                                transform: "translateX(-50%)",
                                background: "rgba(0,0,0,0.6)",
                                color: "white",
                                padding: "3px 10px",
                                borderRadius: 999,
                                fontSize: 12
                            }}
                        >
                            {index + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0 }
          to { transform: scale(1); opacity: 1 }
        }
      `}</style>
        </div>
    );
}
